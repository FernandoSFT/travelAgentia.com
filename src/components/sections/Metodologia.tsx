'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './Metodologia.module.css';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: '1',
    title: 'La IA como consulta',
    description: 'Preguntas sueltas a la IA, sin memoria, sin contexto de tu agencia. Un "Google inteligente". Útil, pero limitado.',
    status: 'La mayoría de agencias están aquí.'
  },
  {
    number: '2',
    title: 'Prompts especializados',
    description: 'Instrucciones personalizadas con tu tono, tus proveedores, tu forma de trabajar. Mejor resultado, pero todo es manual: copiar, pegar, adaptar.',
    status: 'Salto clave: de genérico a contextualizado.'
  },
  {
    number: '3',
    title: 'IA conectada (Copiloto)',
    description: 'La IA accede a tu email, tu calendario, tu CRM. Lee datos reales de tu negocio y ejecuta tareas simples bajo tu supervisión.',
    status: 'Salto clave: de solo texto a conectado con tus herramientas.'
  },
  {
    number: '4',
    title: 'Agentes autónomos',
    description: 'Agentes con rol propio que ejecutan procesos completos: seguimiento comercial, generación de propuestas, marketing en redes. Sin que se lo pidas.',
    status: 'Salto clave: de asistente a autónomo.'
  },
  {
    number: '5',
    title: 'Ecosistema orquestado ✦',
    description: 'Múltiples agentes coordinados con un coordinador central, bases de datos compartidas y reglas de negocio unificadas. Todo conectado: expedientes, servicios, cobros, tareas, propuestas, contactos. Sin copiar y pegar nada.',
    status: 'Aquí es donde opero yo. Y donde te llevo.',
    highlight: true
  }
];

export const Metodologia = () => {
  return (
    <section id="metodologia" className="section">
      <div className="container">
        <SectionHeader 
          label="METODOLOGÍA PROPIA"
          title="Los 5 Pasos de la IA en tu agencia (a día de hoy)"
          subtitle="Cada agencia empieza donde está y avanza a su ritmo. La mayoría están en el Paso 1 o 2. Las más avanzadas experimentan con el 3. Yo opero en el 5 — y te acompaño hasta allí."
        />

        <div className={styles.timeline}>
          <div className={styles.line} />
          
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className={cn(styles.step, step.highlight && styles.highlighted)}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={styles.stepNumber}>
                <span>{step.number}</span>
              </div>
              
              <div className={styles.stepContent}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <div className={styles.status}>{step.status}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className={styles.ctaContainer}>
          <Button variant="primary">¿EN QUÉ PASO ESTÁS? HABLEMOS</Button>
        </div>
      </div>
    </section>
  );
};
