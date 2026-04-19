'use client';

import styles from './Footer.module.css';
import { cn } from '@/lib/utils';
import { Linkedin, Instagram } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={cn('container', styles.grid)}>
        <div className={styles.column}>
          <a href="/" className={styles.logo}>
            <span className="gradient-text">TravelAgentIA</span>
          </a>
          <p className={styles.tagline}>"De agente a agente"</p>
          <p className={styles.copyright}>
            © {currentYear} TravelAgentIA — Fernando Córdoba
          </p>
        </div>

        <div className={styles.column}>
          <h4>Navegación</h4>
          <nav className={styles.nav}>
            <a href="#sobre-mi">Sobre mí</a>
            <a href="#metodologia">Metodología</a>
            <a href="#servicios">Servicios</a>
            <a href="#casos">Casos reales</a>
            <a href="#faq">FAQ</a>
            <a href="#contacto">Contacto</a>
          </nav>
        </div>

        <div className={styles.column}>
          <h4>Legal</h4>
          <nav className={styles.nav}>
            <a href="/aviso-legal">Aviso legal</a>
            <a href="/privacidad">Política de privacidad</a>
            <a href="/cookies">Política de cookies</a>
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
