import type {
  SeccionWeb,
  AjusteGlobal,
  Servicio,
  ProyectoCaso,
  Charla,
  Curso,
  Podcast,
  Testimonio,
  Faq,
  Hito,
  BlogPost
} from "./notion.types";

export const mockSecciones: SeccionWeb[] = [
  {
    Slug: "hero",
    Título: "Inteligencia Artificial para Agencias",
    Subtítulo: "De agente a agente",
    Cuerpo: "Consultoría y automatización.",
    "CTA texto": "EMPIEZA AHORA",
    "CTA link": "/contacto",
    Página: "Home",
    Orden: 1,
    Publicado: true,
    "Notas internas": ""
  },
  {
    Slug: "sobre-mi-hero",
    Título: "Sobre mí",
    Subtítulo: "Trayectoria",
    Cuerpo: "Hola, soy Fernando.",
    "CTA texto": "",
    "CTA link": "",
    Página: "Sobre mí",
    Orden: 1,
    Publicado: true,
    "Notas internas": ""
  }
];

export const mockAjustes: AjusteGlobal[] = [
  {
    Clave: "calendar_url",
    Valor: "",
    Tipo: "URL",
    Grupo: "Contacto",
    Notas: ""
  }
];

export const mockServicios: Servicio[] = [
  {
    Nombre: "Consultoría IA",
    Icono: "✨",
    "Descripción corta": "Consultoría estratégica.",
    "Descripción larga": "Detalles de consultoría...",
    "Precio desde (€)": 500,
    "Slug URL": "consultoria",
    "CTA texto": "Reservar",
    Orden: 1,
    Destacado: true,
    Publicado: true,
    Imagen: []
  }
];

export const mockProyectos: ProyectoCaso[] = [
  {
    Cliente: "Viajes de Ensueño",
    Sector: "Agencia de viajes",
    Problema: "Procesos manuales lentos.",
    Solución: "Automatización con n8n.",
    "Resultado (métricas)": "+40% productividad",
    "Imagen portada": [],
    Tags: ["n8n", "Automatización"],
    Fecha: { start: "2024-01-01", end: null, time_zone: null },
    "Testimonio breve": "Un cambio radical.",
    "Slug URL": "viajes-ensueno",
    Orden: 1,
    "Destacado en home": true,
    Publicado: true
  }
];

export const mockCharlas: Charla[] = [];
export const mockCursos: Curso[] = [];
export const mockPodcasts: Podcast[] = [];
export const mockTestimonios: Testimonio[] = [];
export const mockFaqs: Faq[] = [
  {
    Pregunta: "¿Qué es la IA?",
    Respuesta: "Es el futuro.",
    Categoría: "General",
    Orden: 1,
    Publicado: true
  }
];
export const mockHitos: Hito[] = [
  {
    Título: "Fundación",
    Año: 2020,
    "Fecha exacta": { start: "2020-01-01", end: null, time_zone: null },
    Descripción: "Nace TravelAgentIA.",
    "Icono / Emoji": "🚀",
    Categoría: "Empresa",
    Orden: 1,
    Publicado: true
  }
];
export const mockBlogs: BlogPost[] = [];
