import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { duration, isAvailable, scheduledSlots, zone } from './schedule.mjs';

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function parseBooking(body) {
  const { start: rawStart, name: rawName, email: rawEmail, requestId } = body ?? {};
  if (![rawStart, rawName, rawEmail, requestId].every(value => typeof value === 'string')) return null;
  const start = Date.parse(rawStart);
  const name = rawName.trim();
  const email = rawEmail.trim().toLowerCase();
  if (!Number.isFinite(start) || new Date(start).toISOString() !== rawStart || !name || name.length > 100 ||
      /[\x00-\x1f\x7f]/.test(name) || email.length > 254 || !validEmail.test(email) || !validUuid.test(requestId)) {
    return null;
  }
  return { start, name, email, id: requestId.replaceAll('-', '') };
}

function receipt(event, booking) {
  const sameBooking = event?.id === booking.id && event.status !== 'cancelled' &&
    Date.parse(event.start?.dateTime) === booking.start &&
    event.attendees?.some(attendee => attendee.email?.toLowerCase() === booking.email);
  if (!sameBooking) return null;

  const candidate = event.hangoutLink ?? event.conferenceData?.entryPoints?.find(point => point.entryPointType === 'video')?.uri;
  const meetUrl = typeof candidate === 'string' && /^https:\/\/meet\.google\.com\/[a-z0-9-]+$/i.test(candidate) ? candidate : null;
  return {
    start: new Date(booking.start).toISOString(),
    meetUrl,
    meetFailed: event.conferenceData?.createRequest?.status?.statusCode === 'failure',
  };
}

export function createBookingApp({ schedule, calendar, origins, clock = Date.now }) {
  const app = new Hono().basePath('/api/reservas');
  const reads = new RateLimiterMemory({ points: 40, duration: 60 });
  const writes = new RateLimiterMemory({ points: 6, duration: 600 });
  const inProgress = new Set();
  const recent = new Map();

  app.use('*', async (c, next) => {
    c.header('Cache-Control', 'no-store');
    await next();
  });

  app.onError((error, c) => {
    console.error('[reservas]', error.message);
    return c.json({ error: 'unavailable' }, 503);
  });

  async function rateLimit(c, limiter) {
    // Caddy sets this header from the remote address. The server listens on loopback.
    try {
      await limiter.consume(c.req.header('X-Booking-Client-IP') || 'local');
      return null;
    } catch {
      return c.json({ error: 'rate_limited' }, 429);
    }
  }

  function reserved(start, now) {
    for (const [time, expires] of recent) {
      if (expires <= now) recent.delete(time);
    }
    return recent.has(start);
  }

  app.get('/horarios', async c => {
    const limited = await rateLimit(c, reads);
    if (limited) return limited;

    const now = clock();
    const slots = scheduledSlots(schedule, now);
    if (!slots.length) return c.json({ timeZone: zone, slots: [] });

    const busy = await calendar.busyBetween(slots[0], slots.at(-1) + duration);
    return c.json({
      timeZone: zone,
      slots: slots.filter(start => !inProgress.has(start) && !reserved(start, now) && isAvailable(start, busy))
        .map(start => new Date(start).toISOString()),
    });
  });

  app.post('/citas', bodyLimit({
    maxSize: 4096,
    onError: c => c.json({ error: 'invalid' }, 413),
  }), async c => {
    if (!origins.includes(c.req.header('Origin') ?? '')) return c.json({ error: 'forbidden' }, 403);
    const limited = await rateLimit(c, writes);
    if (limited) return limited;
    if (!/^application\/json(?:\s*;|$)/i.test(c.req.header('Content-Type') ?? '')) {
      return c.json({ error: 'invalid' }, 415);
    }

    const booking = parseBooking(await c.req.json().catch(() => null));
    if (!booking) return c.json({ error: 'invalid' }, 400);
    const { start, id } = booking;

    if (inProgress.has(start)) return c.json({ error: 'processing' }, 503);
    inProgress.add(start);

    try {
      const previous = await calendar.getEvent(id);
      if (previous) {
        const confirmed = receipt(previous, booking);
        return confirmed ? c.json(confirmed) : c.json({ error: 'conflict' }, 409);
      }

      const now = clock();
      if (!scheduledSlots(schedule, now).includes(start) || reserved(start, now)) {
        return c.json({ error: 'conflict' }, 409);
      }
      const busy = await calendar.busyBetween(start, start + duration);
      if (!isAvailable(start, busy) || !scheduledSlots(schedule, clock()).includes(start)) {
        return c.json({ error: 'conflict' }, 409);
      }

      const event = await calendar.createEvent(booking);
      const confirmed = receipt(event, booking);
      if (!confirmed) throw new Error('Google no devolvió una confirmación verificable.');
      // Cover any short delay before an inserted event appears in FreeBusy.
      recent.set(start, clock() + 120_000);
      return c.json(confirmed, 201);
    } finally {
      inProgress.delete(start);
    }
  });

  return app;
}
