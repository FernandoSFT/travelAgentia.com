import { useState, useEffect } from 'react';

const CONSENT_KEY = 'cookie-consent';
const CONSENT_VERSION = 1;
const CONSENT_TTL_MS = 24 * 30 * 24 * 60 * 60 * 1000; // 24 months

export interface CookieConsent {
  version: number;
  timestamp: number;
  analytics: boolean;
  functional: boolean;
}

function loadConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed: CookieConsent = JSON.parse(raw);
    if (parsed.version !== CONSENT_VERSION) return null;
    if (Date.now() - parsed.timestamp > CONSENT_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(analytics: boolean, functional: boolean): CookieConsent {
  const consent: CookieConsent = {
    version: CONSENT_VERSION,
    timestamp: Date.now(),
    analytics,
    functional,
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent('cookieConsentChange', { detail: consent }));
  return consent;
}

export function getConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  return loadConsent();
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(false);
  const [functionalOn, setFunctionalOn] = useState(false);

  useEffect(() => {
    const existing = loadConsent();
    if (!existing) {
      setVisible(true);
    }

    const handler = () => {
      const c = loadConsent();
      if (!c) setVisible(true);
    };
    window.addEventListener('openCookiePanel', () => {
      setShowPanel(true);
      setVisible(true);
    });
    return () => window.removeEventListener('openCookiePanel', handler);
  }, []);

  function acceptAll() {
    saveConsent(true, true);
    setVisible(false);
    setShowPanel(false);
  }

  function acceptEssential() {
    saveConsent(false, false);
    setVisible(false);
    setShowPanel(false);
  }

  function savePreferences() {
    saveConsent(analyticsOn, functionalOn);
    setVisible(false);
    setShowPanel(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      {/* Overlay when panel is open */}
      {showPanel && (
        <div
          className="absolute inset-0 bg-black/60 pointer-events-auto"
          onClick={() => setShowPanel(false)}
        />
      )}

      <div className="relative w-full max-w-2xl pointer-events-auto">
        {/* Panel de preferencias (capa 2) */}
        {showPanel && (
          <div className="mb-3 bg-[#1a1a1a] border border-white/10 rounded-xl p-6 shadow-2xl">
            <h2 className="text-white font-semibold text-lg mb-1">Preferencias de cookies</h2>
            <p className="text-gray-400 text-sm mb-5">
              Puedes activar o desactivar cada categoría. Las cookies esenciales son siempre necesarias para el funcionamiento básico del sitio y no pueden desactivarse.
            </p>

            <div className="space-y-4">
              {/* Esenciales */}
              <div className="flex items-start justify-between gap-4 py-3 border-b border-white/10">
                <div>
                  <p className="text-white text-sm font-medium">Esenciales</p>
                  <p className="text-gray-400 text-xs mt-0.5">Guardan tus preferencias de cookies. Siempre activas.</p>
                </div>
                <span className="shrink-0 text-xs text-gray-500 mt-0.5 font-medium">Siempre activas</span>
              </div>

              {/* Analíticas */}
              <div className="flex items-start justify-between gap-4 py-3 border-b border-white/10">
                <div>
                  <p className="text-white text-sm font-medium">Analíticas</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Usamos Plausible Analytics — sin cookies, con IP anonimizada, datos en la UE. Ayuda a mejorar el sitio.
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={analyticsOn}
                  onClick={() => setAnalyticsOn(v => !v)}
                  className={`shrink-0 relative w-10 h-6 rounded-full transition-colors ${analyticsOn ? 'bg-[#C9A84C]' : 'bg-white/20'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${analyticsOn ? 'translate-x-4' : ''}`} />
                </button>
              </div>

              {/* Funcionales */}
              <div className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="text-white text-sm font-medium">Funcionales (Google Calendar)</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Necesarias para mostrar el calendario de reservas. Google LLC puede establecer cookies y procesar datos en EE.UU.
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={functionalOn}
                  onClick={() => setFunctionalOn(v => !v)}
                  className={`shrink-0 relative w-10 h-6 rounded-full transition-colors ${functionalOn ? 'bg-[#C9A84C]' : 'bg-white/20'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${functionalOn ? 'translate-x-4' : ''}`} />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-5">
              <button
                onClick={savePreferences}
                className="flex-1 bg-[#C9A84C] hover:bg-[#E8D48B] text-[#0A0A0A] font-bold text-sm uppercase tracking-widest py-2.5 px-4 rounded-lg transition-colors"
              >
                Guardar preferencias
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-widest py-2.5 px-4 rounded-lg transition-colors"
              >
                Aceptar todo
              </button>
            </div>
          </div>
        )}

        {/* Banner principal (capa 1) */}
        {!showPanel && (
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 shadow-2xl">
            <p className="text-sm text-gray-300 mb-4">
              Usamos cookies propias esenciales y servicios de terceros (Google Calendar). Puedes aceptar todo, continuar solo con las esenciales o personalizar tus preferencias.{' '}
              <a href="/cookies" className="text-[#C9A84C] hover:underline">Política de Cookies</a>
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={acceptAll}
                className="flex-1 bg-[#C9A84C] hover:bg-[#E8D48B] text-[#0A0A0A] font-bold text-sm uppercase tracking-widest py-2.5 px-4 rounded-lg transition-colors"
              >
                Aceptar todo
              </button>
              <button
                onClick={acceptEssential}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-widest py-2.5 px-4 rounded-lg transition-colors"
              >
                Solo esenciales
              </button>
              <button
                onClick={() => setShowPanel(true)}
                className="flex-1 border border-white/20 hover:border-white/40 text-gray-300 font-bold text-sm uppercase tracking-widest py-2.5 px-4 rounded-lg transition-colors"
              >
                Personalizar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
