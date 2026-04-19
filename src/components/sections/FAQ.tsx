'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FAQ.module.css';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: '¿Necesito saber de tecnología o programación?',
    answer: 'No. Mis servicios están diseñados para agentes de viajes, no para informáticos. Si sabes usar el correo electrónico y un navegador, puedes aplicar IA en tu agencia. Yo me encargo de la parte técnica y tú aprendes a usar las herramientas.'
  },
  {
    question: '¿En qué se diferencia esto de un curso de ChatGPT?',
    answer: 'En todo. Aquí no te enseñamos a "hablar con la IA". Te implementamos un sistema completo, adaptado a tu negocio real: tus expedientes, tus proveedores, tus clientes, tu forma de cobrar. Es la diferencia entre saber que existe un martillo y tener una casa construida.'
  },
  {
    question: '¿Cuánto tiempo tarda en verse resultados?',
    answer: 'Desde el primer día. En la comunidad, en una semana ya estás usando prompts que te ahorran tiempo real. Con la consultoría guiada, en 2-4 semanas tienes los primeros procesos automatizados. Con llaves en mano, en 4-8 semanas tienes el ecosistema operativo.'
  },
  {
    question: '¿Funciona para agencias pequeñas?',
    answer: 'Especialmente para agencias pequeñas. Donde más impacto tiene la IA es en agencias de 1-5 personas que necesitan multiplicar su capacidad sin contratar. Mi propia agencia es una agencia pequeña — y con IA hago el trabajo de un equipo de 5.'
  },
  {
    question: '¿Qué herramientas se usan?',
    answer: 'Principalmente Notion (como centro de operaciones), n8n (para automatizaciones), GPTs personalizados y herramientas de IA generativa. Pero lo importante no es la herramienta — es el sistema que construimos con ellas. Cada agencia tiene su configuración adaptada.'
  },
  {
    question: '¿Puedo empezar por la comunidad y luego pasar a consultoría?',
    answer: 'Sí, y es lo que recomiendo. La comunidad es el mejor primer paso para entender qué puede hacer la IA por tu agencia. Cuando tengas claro qué necesitas, pasamos a consultoría o llaves en mano con una base sólida.'
  },
  {
    question: '¿Trabajas con todas las agencias o solo con algunas?',
    answer: 'Trabajo con agencias de viajes de todo tipo: minoristas, especializadas, independientes, franquiciadas. Mi acuerdo de exclusividad con Traveltool es para consultoría a nivel de grupo de gestión, pero la comunidad y los servicios individuales están abiertos a cualquier agencia.'
  }
];

const AccordionItem = ({ question, answer, isOpen, onClick }: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void 
}) => {
  return (
    <div className={cn(styles.item, isOpen && styles.active)}>
      <button className={styles.question} onClick={onClick}>
        <span>{question}</span>
        <ChevronDown className={styles.chevron} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.answer}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.answerContent}>
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section">
      <div className="container">
        <SectionHeader 
          title="Preguntas frecuentes"
        />

        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
