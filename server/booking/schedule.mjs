export const zone = 'Europe/Madrid';
export const duration = 60 * 60 * 1000;
const day = 24 * duration;

const madridClock = new Intl.DateTimeFormat('en-GB', {
  timeZone: zone, hourCycle: 'h23', year: 'numeric', month: '2-digit',
  day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
});

function wallClock(timestamp) {
  const parts = Object.fromEntries(madridClock.formatToParts(timestamp)
    .filter(part => part.type !== 'literal')
    .map(part => [part.type, Number(part.value)]));
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
}

function madridInstant(localTime) {
  const offsets = new Set([-day, day].map(delta => {
    const probe = localTime + delta;
    return wallClock(probe) - probe;
  }));
  const matches = [...offsets].map(offset => localTime - offset)
    .filter(timestamp => wallClock(timestamp) === localTime);
  // Skip wall times that are ambiguous or nonexistent during a clock change.
  return matches.length === 1 ? matches[0] : undefined;
}

function minutes(value) {
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$|^24:00$/.test(value)) {
    throw new Error('Horario inválido en BOOKING_WEEKLY_HOURS.');
  }
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}

export function parseWeek(value) {
  if (!value?.trim()) throw new Error('Falta BOOKING_WEEKLY_HOURS.');
  const week = new Map();
  for (const entry of value.trim().split(';')) {
    const [weekday, ranges, extra] = entry.trim().split('=');
    if (!/^[1-7]$/.test(weekday) || !ranges || extra !== undefined || week.has(Number(weekday))) {
      throw new Error('Formato de BOOKING_WEEKLY_HOURS inválido.');
    }

    const windows = ranges.split(',').map(range => {
      const times = range.trim().split('-');
      if (times.length !== 2) throw new Error('Franja inválida en BOOKING_WEEKLY_HOURS.');
      return times.map(minutes);
    }).sort((a, b) => a[0] - b[0]);
    if (windows.some(([start, end], i) => end - start < 60 || (i > 0 && start < windows[i - 1][1]))) {
      throw new Error('Las franjas deben admitir una sesión de 60 minutos y no solaparse.');
    }
    week.set(Number(weekday), windows);
  }
  return week;
}

export function scheduledSlots({ week, daysAhead, noticeMinutes }, now) {
  const firstDay = Math.floor(wallClock(now) / day) * day;
  const cutoff = now + noticeMinutes * 60_000;
  const slots = [];
  for (let offset = 0; offset < daysAhead; offset += 1) {
    const date = firstDay + offset * day;
    const weekday = new Date(date).getUTCDay() || 7;
    for (const [start, end] of week.get(weekday) ?? []) {
      for (let minute = start; minute + 60 <= end; minute += 60) {
        const candidate = date + minute * 60_000;
        const instant = madridInstant(candidate);
        const endInstant = madridInstant(candidate + duration);
        if (instant !== undefined && instant >= cutoff && endInstant === instant + duration) {
          slots.push(instant);
        }
      }
    }
  }
  return slots;
}

export function isAvailable(start, busy) {
  return !busy.some(interval => start < interval.end && start + duration > interval.start);
}
