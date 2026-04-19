'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './Contacto.module.css';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Mail, Phone, Globe } from 'lucide-react';

export const Contacto = () => {
  const calendarUrl = "https://calendar.app.google/e4XRYFbL3gk7ZeMP6";

  const handleBooking = () => {
    window.open(calendarUrl, '_blank');
  };

  return (
    <section id="contacto" className={cn('section', styles.section)}>
      <div className={styles.gradientBg} />
      
      <div className="container">
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <SectionHeader 
            label="DA EL PRIMER PASO"
            title="¿Listo para transformar tu agencia?"
            subtitle="Reserva una sesión de diagnóstico gratuita. Analizamos juntos en qué punto estás, qué procesos puedes automatizar primero y cuál es el siguiente paso concreto para tu agencia."
            className={styles.header}
          />

          <p className={styles.disclaimer}>
            Sin compromiso. Sin humo. De agente a agente.
          </p>

          <div className={styles.ctaWrapper}>
            <Button variant="primary" onClick={handleBooking}>
              RESERVA TU DIAGNÓSTICO GRATUITO →
            </Button>
          </div>

          <div className={styles.contactInfo}>
            <div className={styles.infoItem}>
              <Mail className={styles.icon} />
              <a href="mailto:automatiza2@automatiza2.com">automatiza2@automatiza2.com</a>
            </div>
            <div className={styles.infoItem}>
              <Phone className={styles.icon} />
              <a href="tel:+34717717266">+34 717 717 266</a>
            </div>
            <div className={styles.infoItem}>
              <Globe className={styles.icon} />
              <a href="https://travelagentia.com" target="_blank">travelagentia.com</a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
