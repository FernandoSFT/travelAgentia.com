import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createBookingApp } from './app.mjs';
import { createGoogleCalendar } from './google-calendar.mjs';
import { duration, parseWeek, scheduledSlots } from './schedule.mjs';

const now = Date.parse('2026-11-23T07:00:00Z');
const nineMadrid = '2026-11-23T08:00:00.000Z';
const tenMadrid = '2026-11-23T09:00:00.000Z';
const calendarOrigin = 'https://travelagentia.com';
const schedule = { week: parseWeek('1=09:00-11:00'), daysAhead: 1, noticeMinutes: 0 };
const booking = { start: nineMadrid, name: 'Visitante de prueba', email: 'visitor@example.invalid', requestId: '123e4567-e89b-42d3-a456-426614174000' };

function post(app, body = booking, origin = calendarOrigin) {
  return app.request('/api/reservas/citas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify(body),
  });
}

function system({ busy = [], beforeInsert = async () => {} } = {}) {
  const events = new Map();
  const app = createBookingApp({
    schedule,
    clock: () => now,
    origins: [calendarOrigin],
    calendar: {
      getEvent: async id => events.get(id),
      busyBetween: async () => busy,
      createEvent: async ({ id, start, email }) => {
        await beforeInsert();
        const event = {
          id, start: { dateTime: new Date(start).toISOString() }, attendees: [{ email }],
          hangoutLink: 'https://meet.google.com/abc-defg-hij',
        };
        events.set(id, event);
        return event;
      },
    },
  });
  return { app, events };
}

test('las horas de Madrid cambian de UTC entre invierno y verano', () => {
  assert.deepEqual(scheduledSlots(schedule, now).map(value => new Date(value).toISOString()), [nineMadrid, tenMadrid]);
  const summer = Date.parse('2026-07-20T06:00:00Z');
  assert.equal(new Date(scheduledSlots(schedule, summer)[0]).toISOString(), '2026-07-20T07:00:00.000Z');
  assert.throws(() => parseWeek('1=09:00-11:00,10:00-12:00'), /solaparse/);

  const springChange = { ...schedule, week: parseWeek('7=01:00-04:00') };
  assert.deepEqual(scheduledSlots(springChange, Date.parse('2026-03-29T00:00:00Z'))
    .map(value => new Date(value).toISOString()), ['2026-03-29T01:00:00.000Z']);
});

test('la consulta devuelve huecos y limita los datos publicados', async () => {
  const end = Date.parse(tenMadrid);
  const { app } = system({ busy: [{ start: end - duration / 2, end }] });
  const response = await app.request('/api/reservas/horarios');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.deepEqual(await response.json(), { timeZone: 'Europe/Madrid', slots: [tenMadrid] });
  assert.equal((await post(app)).status, 409);
});

test('una cita confirmada se recupera con el mismo identificador y bloquea otra petición para el mismo hueco', async () => {
  const { app, events } = system();
  const first = await post(app);
  assert.equal(first.status, 201);
  const confirmation = await first.json();
  assert.deepEqual(confirmation, { start: nineMadrid, meetUrl: 'https://meet.google.com/abc-defg-hij', meetFailed: false });
  const retry = await post(app);
  assert.equal(retry.status, 200);
  assert.deepEqual(await retry.json(), confirmation);
  assert.equal((await post(app, { ...booking, email: 'other@example.invalid' })).status, 409);
  assert.equal((await post(app, { ...booking, requestId: '123e4567-e89b-42d3-a456-426614174001' })).status, 409);
  assert.equal(events.size, 1);
});

test('dos confirmaciones simultáneas no insertan dos eventos', async () => {
  const gate = Promise.withResolvers();
  const reachedInsert = Promise.withResolvers();
  const { app, events } = system({
    beforeInsert: () => { reachedInsert.resolve(); return gate.promise; },
  });
  const first = post(app);
  await reachedInsert.promise;
  try {
    const second = await post(app, { ...booking, requestId: '123e4567-e89b-42d3-a456-426614174001' });
    assert.equal(second.status, 503);
    assert.equal((await second.json()).error, 'processing');
  } finally {
    gate.resolve();
  }
  assert.equal((await first).status, 201);
  assert.equal(events.size, 1);
});

test('rechaza otros orígenes, datos inválidos y horarios ajenos a la agenda', async () => {
  const { app, events } = system();
  assert.equal((await post(app, booking, 'https://other.example')).status, 403);
  assert.equal((await post(app, { ...booking, email: 'incorrecto' })).status, 400);
  assert.equal((await post(app, { ...booking, start: '2026-11-23T13:00:00.000Z' })).status, 409);
  assert.equal(events.size, 0);
});

test('el adaptador de Google comprueba los calendarios y solicita Meet y la invitación', async () => {
  const calls = [];
  const id = 'calendar@example.invalid';
  const extra = 'work@example.invalid';
  const json = data => new Response(JSON.stringify(data));
  const google = createGoogleCalendar({
    clientId: 'fixture', clientSecret: 'fixture', refreshToken: 'fixture', calendarId: id, conflictCalendars: [extra],
  }, async (value, options) => {
    const url = new URL(value);
    calls.push({ url, options });
    if (url.hostname === 'oauth2.googleapis.com') return json({ access_token: 'fixture', expires_in: 3600 });
    if (url.pathname.endsWith('/freeBusy')) {
      return json({ calendars: { [id]: { busy: [] }, [extra]: { busy: [] } } });
    }
    return json({ id: 'bookingid' });
  });
  assert.deepEqual(await google.busyBetween(now, now + duration), []);
  await google.createEvent({ id: 'bookingid', name: booking.name, email: booking.email, start: Date.parse(nineMadrid) });
  assert.equal(calls.length, 3);
  assert.deepEqual(JSON.parse(calls[1].options.body).items, [{ id }, { id: extra }]);
  assert.equal(calls[2].url.searchParams.get('conferenceDataVersion'), '1');
  assert.equal(calls[2].url.searchParams.get('sendUpdates'), 'all');
  const event = JSON.parse(calls[2].options.body);
  assert.equal(event.visibility, 'private');
  assert.equal(event.conferenceData.createRequest.conferenceSolutionKey.type, 'hangoutsMeet');
  assert.equal(event.start.timeZone, 'Europe/Madrid');
  assert.equal(Date.parse(event.end.dateTime) - Date.parse(event.start.dateTime), duration);
});
