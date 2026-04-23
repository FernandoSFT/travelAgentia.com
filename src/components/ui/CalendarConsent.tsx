import { useState, useEffect } from 'react';
import { getConsent, type CookieConsent } from './CookieBanner';

interface Props {
  calendarUrl: string;
  fallbackUrl: string;
}

export default function CalendarConsent({ calendarUrl, fallbackUrl }: Props) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(getConsent());
    setReady(true);

    const handler = (e: Event) => {
      setConsent((e as CustomEvent<CookieConsent>).detail);
    };
    window.addEventListener('cookieConsentChange', handler);
    return () => window.removeEventListener('cookieConsentChange', handler);
  }, []);

  function acceptFunctional() {
    try {
      const raw = localStorage.getItem('cookie-consent');
      const existing = raw ? JSON.parse(raw) : {};
      const updated = { ...existing, functional: true, timestamp: Date.now() };
      localStorage.setItem('cookie-consent', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('cookieConsentChange', { detail: updated }));
      setConsent(updated);
    } catch {
      setConsent(prev => prev ? { ...prev, functional: true } : null);
    }
  }

  if (!ready) return null;

  if (consent?.functional) {
    return (
      <div className="w-full h-[700px] rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#111]">
          <p className="text-xl mb-6">Si el calendario no carga automáticamente, puedes reservar directamente aquí:</p>
          <a
            href={fallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#C9A84C] text-[#0A0A0A] font-inter font-bold uppercase tracking-widest px-8 py-4 rounded hover:bg-[#E8D48B] transition-all"
          >
            ABRIR CALENDARIO
          </a>
        </div>
        <iframe
          src={calendarUrl}
          className="w-full h-full relative z-10 bg-white"
          frameBorder={0}
          scrolling="yes"
          title="Reservar cita en Google Calendar"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-[700px] rounded-xl border border-white/10 bg-[#111] flex flex-col items-center justify-center p-8 text-center shadow-2xl">
      <div className="max-w-md">
        <svg className="mx-auto mb-4 text-[#C9A84C]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <h2 className="text-white text-xl font-semibold mb-3">Calendario de reservas</h2>
        <p className="text-gray-400 text-sm mb-2">
          Para mostrar el calendario necesitamos cargar un servicio de Google LLC (EE.UU.), que puede establecer cookies y transferir datos fuera de la UE.
        </p>
        <p className="text-gray-500 text-xs mb-6">
          Al activarlo aceptas el uso de cookies funcionales de Google. Puedes retirar este consentimiento en cualquier momento desde la{' '}
          <a href="/cookies" className="text-[#C9A84C] hover:underline">Política de Cookies</a>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={acceptFunctional}
            className="bg-[#C9A84C] hover:bg-[#E8D48B] text-[#0A0A0A] font-bold text-sm uppercase tracking-widest py-3 px-6 rounded-lg transition-colors"
          >
            Activar calendario
          </button>
          <a
            href={fallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/20 hover:border-white/40 text-gray-300 font-bold text-sm uppercase tracking-widest py-3 px-6 rounded-lg transition-colors"
          >
            Abrir en nueva pestaña
          </a>
        </div>
      </div>
    </div>
  );
}
