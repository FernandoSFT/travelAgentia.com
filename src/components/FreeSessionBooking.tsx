import { useEffect, useState, type FormEvent } from 'react';
import { CalendarDays, CheckCircle2, Video } from 'lucide-react';

const timeZone = 'Europe/Madrid';
const dateFormat = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long', day: 'numeric', month: 'long', timeZone,
});
const timeFormat = new Intl.DateTimeFormat('es-ES', {
  hour: '2-digit', minute: '2-digit', timeZone,
});
const fieldClass = 'w-full rounded-lg border border-white/20 bg-bg-dark px-3 py-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-primary';

type Booking = { start: string; name: string; email: string; requestId: string };
type Receipt = { start: string; meetUrl: string | null; meetFailed: boolean };

export default function FreeSessionBooking() {
  const [slots, setSlots] = useState<string[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [refresh, setRefresh] = useState(0);
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [retryBooking, setRetryBooking] = useState<Booking | null>(null);
  const [message, setMessage] = useState('');
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    fetch('/api/reservas/horarios', {
      signal: controller.signal,
    }).then(async response => {
      if (!response.ok) throw new Error('Disponibilidad no accesible');
      const data = await response.json();
      if (!Array.isArray(data.slots) || data.slots.some((slot: unknown) => typeof slot !== 'string' || !Number.isFinite(Date.parse(slot)))) {
        throw new Error('Disponibilidad incompleta');
      }
      if (!active) return;
      setSlots(data.slots);
      setLoadState('ready');
    }).catch(() => {
      if (active) setLoadState('error');
    }).finally(() => {
      window.clearTimeout(timeout);
    });
    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [refresh]);

  function refreshSlots() {
    setLoadState('loading');
    setDate('');
    setStart('');
    setRefresh(value => value + 1);
  }

  async function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || !start) return;
    const booking = retryBooking ?? {
      start,
      name: name.trim(),
      email: email.trim(),
      requestId: crypto.randomUUID(),
    };
    setSending(true);
    setMessage('');

    try {
      const response = await fetch('/api/reservas/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
        signal: AbortSignal.timeout(35_000),
      });
      if (response.status === 409) {
        setRetryBooking(null);
        setMessage('Ese horario ya no está disponible. Elige otro.');
        refreshSlots();
        return;
      }
      if (response.status === 400) {
        setRetryBooking(null);
        setMessage('Revisa tu nombre y correo electrónico.');
        return;
      }
      if (!response.ok) throw new Error('Confirmación pendiente');
      const confirmation = await response.json();
      if (confirmation.start !== start) throw new Error('Confirmación incompleta');
      setReceipt(confirmation);
    } catch {
      setRetryBooking(booking);
      setMessage('No hemos podido comprobar la confirmación. Vuelve a intentarlo con los mismos datos.');
    } finally {
      setSending(false);
    }
  }

  if (receipt) {
    const instant = new Date(receipt.start);
    return (
      <div className="rounded-xl border border-gold-primary/40 bg-bg-dark p-5 sm:p-8" role="status">
        <CheckCircle2 aria-hidden="true" className="mb-3 h-7 w-7 text-gold-primary" />
        <h3 className="text-xl font-bold text-white">Reserva confirmada</h3>
        <p className="mt-2 text-text-muted">{dateFormat.format(instant)} a las {timeFormat.format(instant)} · hora peninsular española.</p>
        <p className="mt-2 text-text-muted">
          {receipt.meetUrl
            ? 'Consulta los detalles de la cita en la invitación de Google Calendar.'
            : receipt.meetFailed
              ? 'Google no pudo generar el enlace de Meet. Ponte en contacto con TravelAgentIA si no lo recibes.'
              : 'Consulta la invitación de Google Calendar para ver el enlace de Meet cuando esté disponible.'}
        </p>
        {receipt.meetUrl && (
          <a className="btn-secondary mt-5 inline-block" href={receipt.meetUrl} target="_blank" rel="noopener noreferrer">Abrir Google Meet</a>
        )}
      </div>
    );
  }

  const dates = [...new Set(slots.map(slot => dateFormat.format(new Date(slot))))];
  const hours = slots.filter(slot => dateFormat.format(new Date(slot)) === date);
  const locked = sending || Boolean(retryBooking);
  const notice = message && <p className="text-sm text-gold-primary" role="alert">{message}</p>;

  if (loadState !== 'ready' || !slots.length) {
    return (
      <div className="space-y-3 rounded-xl border border-white/10 bg-bg-dark p-5">
        {notice}
        <p className="text-text-muted" role="status">
          {loadState === 'loading' ? 'Consultando horarios disponibles…' :
            loadState === 'error' ? 'No hemos podido consultar los horarios.' : 'Ahora mismo no hay horarios disponibles.'}
        </p>
        {loadState !== 'loading' && (
          <button type="button" className="btn-secondary" onClick={refreshSlots}>Actualizar horarios</button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={confirm} className="space-y-5 rounded-xl border border-white/10 bg-bg-dark p-4 sm:p-7" aria-busy={sending}>
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Video aria-hidden="true" className="h-5 w-5 shrink-0 text-gold-primary" />
        <span>Google Meet · 60 minutos · hora peninsular española</span>
      </div>
      <fieldset disabled={locked} className="space-y-5 disabled:opacity-70">
        <legend className="sr-only">Datos de la reserva</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-white">
            <span className="flex items-center gap-2"><CalendarDays aria-hidden="true" className="h-4 w-4 text-gold-primary" /> Fecha</span>
            <select className={fieldClass} required value={date} onChange={event => { setDate(event.target.value); setStart(''); }}>
              <option value="">Selecciona un día</option>
              {dates.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold text-white">
            <span className="block">Hora</span>
            <select className={fieldClass} required disabled={!date} value={start} onChange={event => setStart(event.target.value)}>
              <option value="">{date ? 'Selecciona una hora' : 'Elige primero la fecha'}</option>
              {hours.map(slot => <option key={slot} value={slot}>{timeFormat.format(new Date(slot))}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold text-white">
            <span className="block">Nombre</span>
            <input className={fieldClass} name="name" autoComplete="name" maxLength={100} value={name} onChange={event => setName(event.target.value)} required />
          </label>
          <label className="space-y-2 text-sm font-semibold text-white">
            <span className="block">Correo electrónico</span>
            <input className={fieldClass} name="email" type="email" autoComplete="email" maxLength={254} value={email} onChange={event => setEmail(event.target.value)} required />
          </label>
        </div>
      </fieldset>
      <p className="text-sm text-text-muted">
        Usaremos tus datos para gestionar la cita y enviarte la invitación. Consulta nuestra{' '}
        <a href="/privacidad" className="text-gold-primary underline">política de privacidad</a>.
      </p>
      {notice}
      <button type="submit" className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto" disabled={sending || !start}>
        {sending ? 'Confirmando…' : retryBooking ? 'Reintentar confirmación' : 'Confirmar reserva gratuita'}
      </button>
    </form>
  );
}
