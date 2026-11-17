import { duration, zone } from './schedule.mjs';

const calendarApi = 'https://www.googleapis.com/calendar/v3';

class GoogleError extends Error {
  constructor(operation, status) {
    super(`Google Calendar: ${operation} (HTTP ${status})`);
    this.status = status;
  }
}

export function createGoogleCalendar({ clientId, clientSecret, refreshToken, calendarId, conflictCalendars }, fetcher = fetch) {
  const eventPath = `/calendars/${encodeURIComponent(calendarId)}/events`;
  let access;
  let refreshInFlight;

  async function refreshAccess() {
    const response = await fetcher('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: 'refresh_token',
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new GoogleError('OAuth', response.status);
    const data = await response.json();
    if (!data.access_token || !Number.isFinite(data.expires_in)) throw new Error('Respuesta OAuth incompleta.');
    return { token: data.access_token, expires: Date.now() + data.expires_in * 1_000 };
  }

  async function token() {
    if (access?.expires > Date.now() + 60_000) return access.token;
    refreshInFlight ??= refreshAccess().finally(() => { refreshInFlight = undefined; });
    access = await refreshInFlight;
    return access.token;
  }

  async function request(path, { body, method = 'GET', missing = false } = {}) {
    const accessToken = await token();
    const response = await fetcher(calendarApi + path, {
      method,
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: body && JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });
    if (response.status === 401 && access?.token === accessToken) access = undefined;
    if (missing && response.status === 404) return null;
    if (!response.ok) throw new GoogleError(method === 'GET' ? 'consulta' : 'operación', response.status);
    return response.json();
  }

  function getEvent(id) {
    return request(`${eventPath}/${id}`, { missing: true });
  }

  return {
    getEvent,
    async busyBetween(from, to) {
      const calendars = [...new Set([calendarId, ...conflictCalendars])];
      const data = await request('/freeBusy', {
        method: 'POST',
        body: {
          timeMin: new Date(from).toISOString(), timeMax: new Date(to).toISOString(),
          items: calendars.map(id => ({ id })),
        },
      });
      return calendars.flatMap(id => {
        const result = data.calendars?.[id];
        if (result?.errors?.length || !Array.isArray(result?.busy)) {
          throw new Error('Google no pudo comprobar todos los calendarios.');
        }
        return result.busy.map(interval => {
          const start = Date.parse(interval.start);
          const end = Date.parse(interval.end);
          if (!Number.isFinite(start) || !(end > start)) throw new Error('Intervalo de Google inválido.');
          return { start, end };
        });
      });
    },
    async createEvent(booking) {
      const { id, start, name, email } = booking;
      try {
        return await request(`${eventPath}?conferenceDataVersion=1&sendUpdates=all`, {
          method: 'POST',
          body: {
            id,
            summary: 'TravelAgentIA · Primera sesión gratuita',
            start: { dateTime: new Date(start).toISOString(), timeZone: zone },
            end: { dateTime: new Date(start + duration).toISOString(), timeZone: zone },
            attendees: [{ email, displayName: name }],
            visibility: 'private',
            guestsCanInviteOthers: false,
            guestsCanSeeOtherGuests: false,
            conferenceData: {
              createRequest: { requestId: id, conferenceSolutionKey: { type: 'hangoutsMeet' } },
            },
          },
        });
      } catch (error) {
        // Google may have accepted a request whose response never arrived.
        if (error.status === 409) return getEvent(id);
        throw error;
      }
    },
  };
}
