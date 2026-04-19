'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './Servicios.module.css';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Users, Compass, Key, Check } from 'lucide-react';

const services = [
  {
    icon: <Users />,
    title: 'Comunidad TravelAgentIA',
    subtitle: 'Aprende, comparte, avanza con otros agentes',
    description: 'El punto de entrada. Una comunidad activa de agentes de viaje que ya están aplicando inteligencia artificial en su día a día. No es un curso cerrado: es un espacio vivo donde se comparten casos reales, herramientas probadas y soporte entre profesionales del sector.',
    bullets: [
      'Sesiones en vivo semanales con casos prácticos',
      'Biblioteca de BecarIAs: GPTs especializados',
      'Prompts probados para expedientes y propuestas',
      'Acceso a la comunidad privada',
      'Recursos descargables y plantillas'
    ],
    ideal: 'Ideal para: Agencias que quieren empezar a usar IA con guía y sin inversión grande.',
    cta: 'ÚNETE A LA COMUNIDAD'
  },
  {
    icon: <Compass />,
    title: 'Consultoría "Hazlo Conmigo"',
    subtitle: 'Implementación personalizada con acompañamiento experto',
    description: 'Trabajamos juntos, uno a uno, para implementar la IA en tu agencia de forma personalizada. Yo diseño la solución, tú aprendes a manejarla. Al final del proceso, tienes un sistema propio que entiendes y controlas.',
    bullets: [
      'Diagnóstico inicial de tu agencia',
      'Diseño de tu hoja de ruta IA personalizada',
      'Sesiones 1:1 de implementación guiada',
      'Configuración de herramientas (Notion, Make)',
      'Soporte prioritario durante el proceso',
      'Acceso completo a la comunidad'
    ],
    ideal: 'Ideal para: Agencias que quieren liderar la implementación y entender lo que hacen.',
    cta: 'RESERVA TU DIAGNÓSTICO GRATUITO',
    popular: true
  },
  {
    icon: <Key />,
    title: '"Lo Hacemos por Ti"',
    subtitle: 'Implementación completa. Tú delegas, nosotros construimos.',
    description: 'Nos encargamos de todo: análisis, diseño, implementación y puesta en marcha. Construimos tu ecosistema de IA completo — desde el CRM inteligente hasta los agentes autónomos — adaptado a tu forma de trabajar. Tú solo tienes que usarlo.',
    bullets: [
      'Auditoría completa de procesos',
      'Workspace Notion profesional',
      'Agentes IA especializados para tu agencia',
      'Automatizaciones con n8n completas',
      'Formación de tu equipo',
      'Soporte post-implementación'
    ],
    ideal: 'Ideal para: Agencias que quieren resultados inmediatos sin curva de aprendizaje técnico.',
    cta: 'SOLICITA PRESUPUESTO'
  }
];

export const Servicios = () => {
  return (
    <section id="servicios" className={cn('section', styles.section)}>
      <div className="container">
        <SectionHeader 
          label="SERVICIOS"
          title="Tres caminos para avanzar"
          subtitle="Tanto si estás empezando como si quieres un sistema completo, hay un servicio pensado para ti."
        />

        <div className={styles.grid}>
          {services.map((service, index) => (
            <motion.div 
              key={index}
              className={cn(
                styles.card, 
                service.popular && styles.popular,
                'premium-card'
              )}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {service.popular && <div className={styles.badge}>✦ MÁS POPULAR</div>}
              
              <div className={styles.icon}>{service.icon}</div>
              
              <div className={styles.content}>
                <h3>{service.title}</h3>
                <h4 className={styles.cardSubtitle}>{service.subtitle}</h4>
                <p className={styles.description}>{service.description}</p>
                
                <ul className={styles.bullets}>
                  {service.bullets.map((bullet, i) => (
                    <li key={i}>
                      <Check className={styles.checkIcon} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                
                <p className={styles.ideal}>{service.ideal}</p>
              </div>
              
              <div className={styles.footer}>
                <Button variant={service.popular ? 'primary' : 'secondary'} className={styles.fullButton}>
                  {service.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
