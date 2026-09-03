import React, { useState, useEffect } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactFormAgentes() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [utms, setUtms] = useState({ source: '', campaign: '', medium: '' });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtms({
      source: params.get('utm_source') || '',
      campaign: params.get('utm_campaign') || '',
      medium: params.get('utm_medium') || '',
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (import.meta.env.PUBLIC_PREVIEW === 'true') {
      setToast({ type: 'error', message: 'El envío está desactivado en las previews. Usa esta página solo para revisar el diseño.' });
      return;
    }
    setIsSubmitting(true);
    setToast(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot
    if (formData.get('website')) {
      window.location.href = '/gracias';
      return;
    }

    const necesidad = formData.get('necesidad') as string;
    const data = {
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      telefono: formData.get('telefono'),
      agencia: formData.get('agencia'),
      necesidad,
      mensaje: formData.get('mensaje'),
      rgpd: formData.get('rgpd') === 'on',
      fuente: 'travelagentia.com',
      source: 'agentes-ia',
      utm_source: utms.source,
      utm_campaign: utms.campaign,
      utm_medium: utms.medium,
    };

    // Plausible
    // @ts-ignore
    if (window.plausible) window.plausible('form_submit_agentes', { props: { necesidad } });

    try {
      const res = await fetch(import.meta.env.PUBLIC_N8N_WEBHOOK || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setToast({ type: 'success', message: '¡Mensaje enviado! Te contactaremos en menos de 24 horas.' });
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      setToast({ type: 'error', message: 'Error al enviar. Inténtalo de nuevo o escríbenos a automatiza2@automatiza2.com' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl mx-auto w-full bg-[#111] p-8 rounded-xl border border-white/10 shadow-2xl">
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website-agentes">Website</label>
        <input type="text" id="website-agentes" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="nombre" className="text-sm text-gray-300">Nombre *</label>
        <input required type="text" id="nombre" name="nombre" className="bg-background border border-white/20 p-3 rounded text-textWhite focus:border-primary focus:outline-none transition-colors" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm text-gray-300">Email *</label>
          <input required type="email" id="email" name="email" className="bg-background border border-white/20 p-3 rounded text-textWhite focus:border-primary focus:outline-none transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="telefono" className="text-sm text-gray-300">Teléfono</label>
          <input type="tel" id="telefono" name="telefono" className="bg-background border border-white/20 p-3 rounded text-textWhite focus:border-primary focus:outline-none transition-colors" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="agencia" className="text-sm text-gray-300">Nombre de agencia</label>
        <input type="text" id="agencia" name="agencia" className="bg-background border border-white/20 p-3 rounded text-textWhite focus:border-primary focus:outline-none transition-colors" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="necesidad" className="text-sm text-gray-300">¿Qué necesitas? *</label>
        <select required id="necesidad" name="necesidad" className="bg-background border border-white/20 p-3 rounded text-textWhite focus:border-primary focus:outline-none transition-colors">
          <option value="">Selecciona una opción</option>
          <option value="atencion-cliente">Atención al cliente 24/7</option>
          <option value="propuestas">Propuestas automáticas</option>
          <option value="seguimiento">Seguimiento comercial</option>
          <option value="busqueda">Búsqueda inteligente de destinos</option>
          <option value="otro">Otro / No lo tengo claro</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="mensaje" className="text-sm text-gray-300">Mensaje</label>
        <textarea id="mensaje" name="mensaje" rows={3} className="bg-background border border-white/20 p-3 rounded text-textWhite focus:border-primary focus:outline-none transition-colors resize-none" placeholder="Cuéntanos más sobre tu agencia..." />
      </div>

      <div className="flex items-start gap-3 mt-2">
        <input required type="checkbox" id="rgpd-agentes" name="rgpd" className="mt-1 w-5 h-5 accent-primary" />
        <label htmlFor="rgpd-agentes" className="text-sm text-gray-400 leading-tight">
          Acepto la <a href="/privacidad" className="text-primary hover:underline">política de privacidad</a> y el tratamiento de mis datos. *
        </label>
      </div>

      {toast && (
        <div className={`flex items-center gap-2 text-sm p-3 rounded ${toast.type === 'success' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {toast.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 bg-primary text-background font-bold uppercase tracking-widest px-8 py-4 rounded hover:bg-primaryHover disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> ENVIANDO...</> : <><Send className="w-4 h-4" /> SOLICITAR INFORMACIÓN</>}
      </button>
    </form>
  );
}
