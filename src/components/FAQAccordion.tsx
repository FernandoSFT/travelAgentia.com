import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

const defaultFaqs: FAQ[] = [
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

interface FAQAccordionProps {
  faqs?: FAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const items = faqs && faqs.length > 0 ? faqs : defaultFaqs;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {items.map((faq, index) => (
        <div
          key={index}
          className={`border border-[#2D2D2D] rounded-xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-[#C9A84C] bg-white/5' : 'hover:border-[#C9A84C]/50'}`}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-6 text-left group"
          >
            <span className={`text-lg font-semibold transition-colors ${openIndex === index ? 'text-[#C9A84C]' : 'text-white group-hover:text-[#E8D48B]'}`}>
              {faq.question}
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-[#C9A84C]' : 'text-gray-500'}`}
            />
          </button>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-6 pt-0 text-gray-300 leading-relaxed border-t border-[#2D2D2D]/50">
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
