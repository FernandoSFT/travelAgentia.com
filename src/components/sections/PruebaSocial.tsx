'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './PruebaSocial.module.css';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';

const stats = [
  { value: 70, label: 'Agentes de viaje en la comunidad', prefix: '+' },
  { value: 500, label: 'Agencias en la red Traveltool', prefix: '+' },
  { value: 20, label: 'Agentes IA operativos en SAFE TOUR', prefix: '+' },
  { value: 15, label: 'Años gestionando viajes como agente', prefix: '+' },
];

const logos = [
  'AEVAV', 'V Salón del Viaje', 'Traveltool', 'UCAM', 'DIT Gestión'
];

const Counter = ({ value, prefix }: { value: number; prefix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{prefix}{count}</span>;
};

export const PruebaSocial = () => {
  return (
    <section id="testimonios" className={cn('section', styles.section)}>
      <div className="container">
        <SectionHeader 
          label="RESULTADOS"
          title="Los números hablan"
        />

        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className={styles.stat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={styles.number}>
                <Counter value={stat.value} prefix={stat.prefix} />
              </div>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className={styles.logosSection}>
          <p className={styles.logosLabel}>Instituciones y grupos que confían en nosotros</p>
          <div className={styles.logosGrid}>
            {logos.map((logo, index) => (
              <motion.div 
                key={index}
                className={styles.logoItem}
                whileHover={{ color: 'var(--gold-primary)', scale: 1.05 }}
              >
                {logo}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
