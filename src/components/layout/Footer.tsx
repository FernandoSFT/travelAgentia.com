'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { cn } from '@/lib/utils';
import { Linkedin, Instagram } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={cn('container', styles.grid)}>
        <div className={styles.column}>
          <Link href="/" className={styles.logo}>
            <span className="gradient-text">TravelAgentIA</span>
          </Link>
          <p className={styles.tagline}>"De agente a agente"</p>
          <p className={styles.copyright}>
            © {currentYear} TravelAgentIA — Fernando Córdoba
          </p>
        </div>

        <div className={styles.column}>
          <h4>Navegación</h4>
          <nav className={styles.nav}>
            <Link href="#sobre-mi">Sobre mí</Link>
            <Link href="#metodologia">Metodología</Link>
            <Link href="#servicios">Servicios</Link>
            <Link href="#casos">Casos reales</Link>
            <Link href="#faq">FAQ</Link>
            <Link href="#contacto">Contacto</Link>
          </nav>
        </div>

        <div className={styles.column}>
          <h4>Legal</h4>
          <nav className={styles.nav}>
            <Link href="/aviso-legal">Aviso legal</Link>
            <Link href="/privacidad">Política de privacidad</Link>
            <Link href="/cookies">Política de cookies</Link>
          </nav>
        </div>

        <div className={styles.column}>
          <h4>Redes sociales</h4>
          <div className={styles.socials}>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Linkedin />
            </a>
            <a href="https://instagram.com/safetour.es" target="_blank" rel="noopener noreferrer">
              <Instagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
