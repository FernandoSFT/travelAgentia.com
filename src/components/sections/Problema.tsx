'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './Problema.module.css';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';
import { Clock, Bot, BookOpen, Layers } from 'lucide-react';

const problems = [
  {
    icon: <Clock />,
    title: 'Pierdes horas en tareas que no venden',
    description: 'Copiar datos, buscar precios, rellenar formularios, redactar emails desde cero… El trabajo administrativo devora tu tiempo de venta.'
  },
  {
    icon: <Bot />,
    title: 'Probaste ChatGPT pero no te sirvió de mucho',
    description: 'Sin contexto de tu agencia, sin tus proveedores, sin tu forma de trabajar… la IA genérica da respuestas genéricas.'
  },
  {
    icon: <BookOpen />,
    title: 'La formación en IA no habla tu idioma',
    description: 'Cursos de marketing digital, tutoriales para programadores… Nadie te enseña a aplicar IA a expedientes, propuestas o seguimiento de clientes.'
  },
  {
    icon: <Layers />,
    title: 'Cada herramienta nueva es un mundo aparte',
    description: 'ChatGPT por aquí, Notion por allá, automatizaciones sueltas… Nada está conectado y acabas duplicando trabajo.'
  }
];

export const Problema = () => {
  return (
    <section id="problema" className="section">
      <div className={cn('container', styles.grid)}>
        <motion.div 
          className={styles.textSide}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader 
            title="¿Te suena alguno de estos problemas?"
            align="left"
            subtitle="La mayoría de agencias de viajes saben que la IA puede ayudarles, pero no encuentran el camino. Los cursos genéricos no entienden tu negocio. Las herramientas son muchas y cambian cada semana. Y al final, vuelves a lo de siempre."
          />
        </motion.div>

        <div className={styles.cardsGrid}>
          {problems.map((problem, index) => (
            <motion.div 
              key={index}
              className={cn('premium-card', styles.card)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className={styles.icon}>{problem.icon}</div>
              <h3>{problem.title}</h3>
              <p>{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
