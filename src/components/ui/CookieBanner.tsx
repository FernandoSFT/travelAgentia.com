import React, { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('cookie-notice-dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('cookie-notice-dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-fade-in">
      <div className="max-w-4xl mx-auto bg-[#1a1a1a] border border-white/10 rounded-xl p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300 m-0">
          Utilizamos análisis anónimo (Plausible) que no requiere el uso de cookies. 
          Puede obtener más información en nuestra <a href="/cookies" className="text-primary hover:underline">Política de Cookies</a>.
        </p>
        <button 
          onClick={handleDismiss}
          className="shrink-0 bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          aria-label="Cerrar aviso"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>
  );
}
