'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './CasosReales.module.css';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';
import { Mail, FileText, Zap, BarChart3 } from 'lucide-react';

const cases = [
  {
    icon: <Mail />,
    title: 'De email a expediente en segundos',
    before: 'Leer email → identificar cliente → abrir expediente → copiar datos → crear tareas. 15-20 minutos.',
    after: 'El sistema cruza el email con expedientes activos, identifica el viaje, crea tareas operativas, registra la nota y actualiza el estado. Automáticamente.',
    result: 'De 15 minutos a 30 segundos por interacción.'
  },
  {
    icon: <FileText />,
    title: 'Propuesta completa generada con IA',
    before: 'Buscar hoteles, comparar precios, redactar propuesta, maquetar PDF. 2-3 horas.',
    after: 'La IA analiza la oferta del proveedor, genera itinerario día a día, compara hoteles con reseñas reales, y produce una propuesta visual lista para enviar.',
    result: 'Propuestas profesionales en menos de 20 minutos.'
  },
  {
    icon: <Zap />,
    title: 'Seguimiento comercial automático',
    before: 'Revisar manualmente qué clientes no han respondido. Se olvidaban seguimientos. Se perdían ventas.',
    after: 'Un agente IA revisa cada lunes y jueves los presupuestos enviados, identifica a quién contactar, redacta el mensaje adaptado a cada fase del ciclo y lo deja listo para enviar.',
    result: '0 seguimientos olvidados. Tasa de respuesta mejorada.'
  },
  {
    icon: <BarChart3 />,
    title: 'De oferta a marketing multicanal',
    before: 'La oferta se quedaba en el email. Si acaso, un post improvisado.',
    after: 'La IA transforma la oferta en: checklist de equipaje personalizada + web-app de promoción del viaje + plan de redes sociales de 7 días con copies listos.',
    result: '3 piezas de contenido profesional desde 1 sola oferta.'
  }
];

export const CasosReales = () => {
  return (
    <section id="casos" className="section">
      <div className="container">
        <SectionHeader 
          label="CASOS REALES — SAFE TOUR"
          title="Esto es lo que la IA ya hace en mi agencia"
          subtitle="No son demos preparadas. Es lo que uso cada día para gestionar SAFE TOUR. Y es lo que puedes tener en la tuya."
        />

        <div className={styles.grid}>
          {cases.map((item, index) => (
            <motion.div 
              key={index}
              className={cn('glass', styles.card)}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={styles.icon}>{item.icon}</div>
              <h3>{item.title}</h3>
              
              <div className={styles.comparison}>
                <div className={styles.before}>
                  <span className={styles.compLabel}>⏱️ Antes:</span>
                  <p>{item.before}</p>
                </div>
                <div className={styles.after}>
                  <span className={styles.compLabel}>⚡ Después:</span>
                  <p>{item.after}</p>
                </div>
              </div>
              
              <div className={styles.result}>
                <span className={styles.compLabel}>📊 Resultado:</span>
                <p>{item.result}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
