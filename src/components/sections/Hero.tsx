'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.gridOverlay} />
      
      <div className={cn('container', styles.container)}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="label">DE AGENTE A AGENTE</span>
          
          <h1 className="gradient-text">
            Inteligencia Artificial que funciona porque la usamos cada día
          </h1>
          
          <p className={styles.subtitle}>
            Consultoría, formación y automatización de IA diseñadas exclusivamente para agencias de viajes. 
            Probadas en una agencia real. Implementadas en más de 70 agencias.
          </p>
          
          <div className={styles.ctas}>
            <Button variant="primary">EMPIEZA AHORA</Button>
            <Button variant="secondary">VER CÓMO FUNCIONA</Button>
          </div>
          
          <motion.div 
            className={cn('glass', styles.badge)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span>✦ +70 agentes en la comunidad</span>
            <span className={styles.separator}>·</span>
            <span>✦ +500 agencias en red con Traveltool</span>
            <span className={styles.separator}>·</span>
            <span>✦ Ponente AEVAV 2026</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
