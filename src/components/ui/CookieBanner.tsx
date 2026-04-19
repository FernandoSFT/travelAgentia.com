'use client';

import React, { useState, useEffect } from 'react';
import styles from './CookieBanner.module.css';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={cn('glass', styles.banner)}>
      <div className={styles.content}>
        <p>
          Utilizamos cookies propias y de terceros para mejorar nuestros servicios y mostrarle publicidad relacionada con sus preferencias mediante el análisis de sus hábitos de navegación. Puede obtener más información en nuestra <Link href="/cookies">Política de Cookies</Link>.
        </p>
        <div className={styles.actions}>
          <button className={styles.decline} onClick={handleDecline}>Rechazar</button>
          <Button variant="primary" onClick={handleAccept} className={styles.accept}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
};
