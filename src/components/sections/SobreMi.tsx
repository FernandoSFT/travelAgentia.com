'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './SobreMi.module.css';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';
import { GraduationCap, Briefcase, Mic2, Users, Wrench, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

const credentials = [
  { icon: <GraduationCap />, text: 'Curso Superior en IA Generativa — UCAM (750h, 30 ECTS)' },
  { icon: <Briefcase />, text: 'Gerente de SAFE TOUR — Agencia operativa desde 2008' },
  { icon: <Mic2 />, text: 'Ponente en AEVAV, V Salón del Viaje de Sevilla, DIT Gestión' },
  { icon: <ShieldCheck />, text: 'Acuerdo de exclusividad con Traveltool (Grupo VECI — ~500 agencias)' },
  { icon: <Users />, text: 'Comunidad de +70 agentes de viaje implementando IA' },
  { icon: <Wrench />, text: 'Certificaciones en Notion, Make y automatización avanzada' },
];

export const SobreMi = () => {
  return (
    <section id="sobre-mi" className={cn('section', styles.section)}>
      <div className={cn('container', styles.grid)}>
        <motion.div 
          className={styles.imageSide}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.imageContainer}>
            {/* Using a placeholder for Fernando's photo as per implementation plan */}
            <div className={styles.placeholder}>
              <span>Foto de Fernando</span>
            </div>
            {/* 
            <Image 
              src="/images/fernando.jpg" 
              alt="Fernando Córdoba" 
              width={500} 
              height={600} 
              className={styles.image}
            /> 
            */}
          </div>
        </motion.div>

        <motion.div 
          className={styles.textSide}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader 
            label="SOBRE MÍ"
            title="Soy Fernando Córdoba"
            align="left"
            className={styles.header}
          />
          
          <h3 className={styles.tagline}>
            Agente de viajes en activo. Consultor de IA especializado en el sector turístico.
          </h3>
          
          <div className={styles.bio}>
            <p>
              Llevo más de 15 años gestionando viajes desde mi propia agencia, SAFE TOUR, en Andújar (Jaén). 
              Hace tres años empecé a integrar inteligencia artificial en mi día a día: expedientes, propuestas, 
              seguimiento comercial, cobros, marketing… Todo.
            </p>
            <p>
              Hoy gestiono mi agencia con un ecosistema de más de 20 agentes de IA coordinados que trabajan sobre Notion, 
              n8n y herramientas propias. No es teoría. Es lo que uso cada mañana para abrir el correo, 
              generar propuestas y enviar presupuestos por WhatsApp.
            </p>
            <p>
              Creé TravelAgentIA porque me di cuenta de que lo que estaba construyendo podía transformar cualquier agencia. 
              No desde la teoría. Desde la trinchera.
            </p>
          </div>

          <div className={styles.credentialsGrid}>
            {credentials.map((cred, index) => (
              <div key={index} className={styles.credential}>
                <div className={styles.credIcon}>{cred.icon}</div>
                <span>{cred.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
