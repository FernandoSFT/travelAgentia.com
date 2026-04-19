import React, { useState, useEffect } from 'react';

export default function ContactoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [utms, setUtms] = useState({
    source: '',
    campaign: '',
    medium: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtms({
      source: params.get('utm_source') || '',
      campaign: params.get('utm_campaign') || '',
      medium: params.get('utm_medium') || ''
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Honeypot check
    if (formData.get('website')) {
      // It's a bot
      window.location.href = '/gracias';
      return;
    }

    const data = {
      nombre: formData.get('nombre'),
      apellidos: formData.get('apellidos'),
      agencia: formData.get('agencia'),
      movil: formData.get('movil'),
      email: formData.get('email'),
      rgpd: formData.get('rgpd') === 'on',
      fuente: 'travelagentia.com',
      utm_source: utms.source,
      utm_campaign: utms.campaign,
      utm_medium: utms.medium,
    };

    try {
      const res = await fetch('https://n8n.automatiza2.com/webhook/lead-web', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        window.location.href = '/gracias';
      } else {
        setError('Ocurrió un error al enviar el formulario. Por favor, inténtalo de nuevo.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setError('No pudimos conectar con el servidor. Revisa tu conexión.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl mx-auto w-full bg-[#111] p-8 rounded-xl border border-white/10 shadow-2xl">
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="nombre" className="font-jetbrains text-sm text-gray-300">Nombre *</label>
          <input required type="text" id="nombre" name="nombre" className="bg-background border border-white/20 p-3 rounded text-textWhite focus:border-primary focus:outline-none transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="apellidos" className="font-jetbrains text-sm text-gray-300">Apellidos *</label>
          <input required type="text" id="apellidos" name="apellidos" className="bg-background border border-white/20 p-3 rounded text-textWhite focus:border-primary focus:outline-none transition-colors" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="agencia" className="font-jetbrains text-sm text-gray-300">Nombre de agencia *</label>
        <input required type="text" id="agencia" name="agencia" className="bg-background border border-white/20 p-3 rounded text-textWhite focus:border-primary focus:outline-none transition-colors" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="movil" className="font-jetbrains text-sm text-gray-300">Móvil *</label>
          <input required type="tel" id="movil" name="movil" className="bg-background border border-white/20 p-3 rounded text-textWhite focus:border-primary focus:outline-none transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-jetbrains text-sm text-gray-300">Email *</label>
          <input required type="email" id="email" name="email" className="bg-background border border-white/20 p-3 rounded text-textWhite focus:border-primary focus:outline-none transition-colors" />
        </div>
      </div>

      <div className="flex items-start gap-3 mt-4">
        <input required type="checkbox" id="rgpd" name="rgpd" className="mt-1 w-5 h-5 accent-primary" />
        <label htmlFor="rgpd" className="text-sm text-gray-400 leading-tight">
          Acepto la <a href="/privacidad" className="text-primary hover:underline">política de privacidad</a> y el tratamiento de mis datos personales para gestionar esta solicitud. *
        </label>
      </div>

      {error && <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded">{error}</div>}

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="mt-4 bg-primary text-background font-inter font-bold uppercase tracking-widest px-8 py-4 rounded hover:bg-primaryHover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isSubmitting ? 'ENVIANDO...' : 'SOLICITAR INFORMACIÓN'}
      </button>
    </form>
  );
}
