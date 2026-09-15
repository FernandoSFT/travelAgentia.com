import { useRef, useState, type SubmitEvent } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';

const REQUEST_TIMEOUT_MS = 12_000;

const interestOptions = [
  'Programa completo — Edición presencial (400 €)',
  'Programa completo — Edición online (350 €)',
  'Curso 1 — Preparar ChatGPT',
  'Curso 2 — Aplicar a tu agencia',
  'Acompañamiento de implantación',
  'No lo tengo claro, quiero asesoramiento',
] as const;

type SubmissionStatus =
  | { type: 'idle'; message: '' }
  | { type: 'success' | 'error'; message: string };

const fieldClass =
  'min-h-12 w-full rounded-lg border border-white/20 bg-[#0A0A0A] px-4 py-3 text-text-main placeholder:text-text-muted/70 transition-colors focus:border-gold-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/40';

export default function CourseLeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmissionStatus>({ type: 'idle', message: '' });
  const submissionLock = useRef(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (import.meta.env.PUBLIC_PREVIEW === 'true') {
      setStatus({
        type: 'error',
        message: 'El envío está desactivado en esta vista previa. Usa esta página solo para revisar el diseño y el contenido.',
      });
      return;
    }

    if (submissionLock.current) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Silently accept bot submissions without forwarding them to n8n.
    if (String(formData.get('website') ?? '').trim()) {
      form.reset();
      setStatus({
        type: 'success',
        message: 'Consulta recibida. Te responderemos lo antes posible.',
      });
      return;
    }

    const webhook = import.meta.env.PUBLIC_N8N_COURSE_WEBHOOK;
    if (!webhook) {
      setStatus({
        type: 'error',
        message:
          'El formulario no está disponible temporalmente. Inténtalo de nuevo más tarde o utiliza los canales de contacto de la web.',
      });
      return;
    }

    submissionLock.current = true;
    setIsSubmitting(true);
    setStatus({ type: 'idle', message: '' });

    const readField = (name: string) => String(formData.get(name) ?? '').trim();
    const params = new URLSearchParams(window.location.search);
    const payload = {
      nombre: readField('nombre'),
      agencia: readField('agencia'),
      email: readField('email'),
      movil: readField('telefono'),
      interes: readField('interes'),
      mensaje: readField('mensaje'),
      fuente: 'travelagentia.com',
      tipo: 'consulta',
      curso: 'ChatGPT Work para agencias de viajes',
      rgpd: formData.get('rgpd') === 'on',
      source: 'travelagentia.com/curso-chatgpt-work-agencias-viajes',
      utm_source: params.get('utm_source') ?? '',
      utm_medium: params.get('utm_medium') ?? '',
      utm_campaign: params.get('utm_campaign') ?? '',
      utm_content: params.get('utm_content') ?? '',
      utm_term: params.get('utm_term') ?? '',
    };

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'omit',
        signal: controller.signal,
      });

      if (!response.ok) throw new Error('Webhook response was not successful');

      form.reset();
      setStatus({
        type: 'success',
        message:
          '¡Gracias! Hemos recibido tu consulta. Esto no reserva una plaza; te contactaremos para informarte sin compromiso.',
      });
    } catch (error) {
      const timedOut = error instanceof DOMException && error.name === 'AbortError';
      setStatus({
        type: 'error',
        message: timedOut
          ? 'La solicitud ha tardado demasiado. Comprueba tu conexión e inténtalo de nuevo.'
          : 'No hemos podido enviar la consulta. Inténtalo de nuevo en unos minutos o utiliza los canales de contacto de la web.',
      });
    } finally {
      window.clearTimeout(timeoutId);
      submissionLock.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
      className="mx-auto w-full max-w-3xl rounded-2xl border border-gold-primary/30 bg-[#111111] p-5 shadow-2xl shadow-black/30 sm:p-8 lg:p-10"
    >
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="course-website">Website</label>
        <input
          id="course-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mb-7 rounded-lg border border-gold-primary/20 bg-gold-primary/10 p-4 text-sm leading-relaxed text-gold-light">
        Este formulario es solo informativo. La inscripción y la reserva de plaza se gestionan por separado después del primer contacto.
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="course-nombre" className="text-sm font-medium text-text-main">
            Nombre completo <span className="text-gold-primary" aria-hidden="true">*</span>
          </label>
          <input
            required
            id="course-nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            maxLength={120}
            className={fieldClass}
            placeholder="Tu nombre y apellidos"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="course-agencia" className="text-sm font-medium text-text-main">
            Agencia o empresa
          </label>
          <input
            id="course-agencia"
            name="agencia"
            type="text"
            autoComplete="organization"
            maxLength={160}
            className={fieldClass}
            placeholder="Nombre de tu agencia"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="course-email" className="text-sm font-medium text-text-main">
            Email <span className="text-gold-primary" aria-hidden="true">*</span>
          </label>
          <input
            required
            id="course-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            className={fieldClass}
            placeholder="tu@email.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="course-telefono" className="text-sm font-medium text-text-main">
            Teléfono
          </label>
          <input
            id="course-telefono"
            name="telefono"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={30}
            className={fieldClass}
            placeholder="+34 ..."
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <label htmlFor="course-interes" className="text-sm font-medium text-text-main">
          ¿Qué te interesa? <span className="text-gold-primary" aria-hidden="true">*</span>
        </label>
        <select required id="course-interes" name="interes" defaultValue="" className={fieldClass}>
          <option value="" disabled>
            Selecciona una opción
          </option>
          {interestOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <label htmlFor="course-mensaje" className="text-sm font-medium text-text-main">
          Tu consulta
        </label>
        <textarea
          id="course-mensaje"
          name="mensaje"
          rows={5}
          maxLength={1500}
          className={`${fieldClass} resize-y`}
          placeholder="Cuéntanos tu caso, dudas o lo que necesitas saber..."
        />
      </div>

      <div className="mt-6 flex items-start gap-3">
        <input
          required
          id="course-rgpd"
          name="rgpd"
          type="checkbox"
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-gold-primary focus:outline-none focus:ring-2 focus:ring-gold-primary focus:ring-offset-2 focus:ring-offset-bg-dark"
        />
        <label htmlFor="course-rgpd" className="text-sm leading-relaxed text-text-muted">
          He leído y acepto la{' '}
          <a
            href="/privacidad"
            className="font-medium text-gold-light underline decoration-gold-primary/50 underline-offset-4 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
          >
            política de privacidad
          </a>{' '}
          y el tratamiento de mis datos para gestionar esta consulta. <span className="text-gold-primary" aria-hidden="true">*</span>
        </label>
      </div>

      {status.type !== 'idle' && (
        <div
          className={`mt-6 flex items-start gap-3 rounded-lg border p-4 text-sm leading-relaxed ${
            status.type === 'success'
              ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
              : 'border-red-400/30 bg-red-400/10 text-red-200'
          }`}
          role={status.type === 'error' ? 'alert' : 'status'}
          aria-live={status.type === 'error' ? 'assertive' : 'polite'}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary mt-7 flex min-h-12 w-full items-center justify-center gap-2 px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold-light focus:ring-offset-2 focus:ring-offset-bg-dark disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:text-base"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            Enviando consulta…
          </>
        ) : (
          <>
            <Send className="h-5 w-5" aria-hidden="true" />
            Enviar consulta
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs text-text-muted">
        Los campos marcados con * son obligatorios. No realizaremos ninguna inscripción automática.
      </p>
    </form>
  );
}
