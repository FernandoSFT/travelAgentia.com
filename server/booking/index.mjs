import { serve } from '@hono/node-server';
import { createBookingApp } from './app.mjs';
import { createGoogleCalendar } from './google-calendar.mjs';
import { parseWeek } from './schedule.mjs';

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Falta ${name}.`);
  return value;
}

function integer(name, fallback, min, max) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} inválido.`);
  return value;
}

const schedule = {
  week: parseWeek(required('BOOKING_WEEKLY_HOURS')),
  daysAhead: integer('BOOKING_DAYS_AHEAD', 21, 1, 60),
  noticeMinutes: integer('BOOKING_NOTICE_MINUTES', 1440, 0, 10_080),
};
const calendar = createGoogleCalendar({
  clientId: required('BOOKING_GOOGLE_CLIENT_ID'),
  clientSecret: required('BOOKING_GOOGLE_CLIENT_SECRET'),
  refreshToken: required('BOOKING_GOOGLE_REFRESH_TOKEN'),
  calendarId: required('BOOKING_GOOGLE_CALENDAR_ID'),
  conflictCalendars: (process.env.BOOKING_GOOGLE_CONFLICT_CALENDARS ?? '').split(',').map(id => id.trim()).filter(Boolean),
});
const origins = (process.env.BOOKING_ORIGINS ?? 'https://travelagentia.com,https://www.travelagentia.com')
  .split(',').map(origin => origin.trim()).filter(Boolean);

const app = createBookingApp({ schedule, calendar, origins });
serve({
  fetch: app.fetch,
  hostname: '127.0.0.1',
  port: integer('BOOKING_PORT', 4326, 1024, 65535),
}, info => console.log(`API de reservas en 127.0.0.1:${info.port}`));
