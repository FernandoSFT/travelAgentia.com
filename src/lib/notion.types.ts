export interface SeccionWeb {
  Slug: string              // TITLE · ej: "hero", "about-hero", "footer"
  "Título": string          // text
  "Subtítulo": string       // text
  Cuerpo: string            // text (rich)
  "CTA texto": string       // text
  "CTA link": string        // url
  Página:                   // select
    | "Home" | "Sobre mí" | "Servicios" | "Casos"
    | "Contacto" | "Reserva cita" | "Prensa" | "Legal" | "Global"
  Orden: number             // number
  Publicado: boolean        // checkbox
  "Notas internas": string  // text
}

export interface AjusteGlobal {
  Clave: string             // TITLE · ej: "calendar_url", "email_contacto"
  Valor: string             // text
  Tipo: "Texto" | "URL" | "Email" | "Teléfono" | "HTML"  // select
  Grupo: "Contacto" | "Redes sociales" | "Legal" | "SEO" | "General"  // select
  Notas: string             // text
}

export interface Servicio {
  Nombre: string            // TITLE
  Icono: string             // text (emoji o lucide:nombre)
  "Descripción corta": string  // text
  "Descripción larga": string  // text
  "Precio desde (€)": number   // number (formato euro)
  "Slug URL": string        // text · ej: "consultoria"
  "CTA texto": string       // text
  Orden: number             // number
  Destacado: boolean        // checkbox
  Publicado: boolean        // checkbox
  Imagen: NotionFile[]      // files
}

export interface ProyectoCaso {
  Cliente: string           // TITLE
  Sector: "Agencia de viajes" | "Mayorista" | "Hotel" | "Asociación" | "Otro"
  Problema: string          // text
  "Solución": string        // text
  "Resultado (métricas)": string  // text
  "Imagen portada": NotionFile[]  // files
  Tags: Array<"IA" | "Automatización" | "Notion" | "n8n" | "Chatbot" | "CRM" | "Formación">
  Fecha: NotionDate         // date
  "Testimonio breve": string  // text
  "Slug URL": string        // text
  Orden: number
  "Destacado en home": boolean
  Publicado: boolean
}

export interface Charla {
  "Título": string          // TITLE
  Evento: string            // text
  Fecha: NotionDate         // date
  Lugar: string             // text
  Resumen: string           // text
  "Vídeo URL": string       // url
  Foto: NotionFile[]        // files
  "Slides URL": string      // url
  Orden: number
  Destacada: boolean
  Publicado: boolean
}

export interface Curso {
  Nombre: string            // TITLE
  Formato: "Online" | "Presencial" | "Mixto" | "In-company"  // select
  Horas: number
  Fecha: NotionDate
  "Precio (€)": number      // number (euro)
  Estado:                   // status
    | "Próximamente" | "Abierta inscripción" | "En curso" | "Finalizada"
  Resumen: string
  "URL inscripción": string // url
  Orden: number
  Publicado: boolean
}

export interface Podcast {
  "Título": string          // TITLE
  Programa: string
  Fecha: NotionDate
  Enlace: string            // url
  Plataforma: "Spotify" | "YouTube" | "Apple" | "Ivoox" | "Otro"
  Resumen: string
  Portada: NotionFile[]
  Publicado: boolean
}

export interface Testimonio {
  Nombre: string            // TITLE
  Cargo: string
  "Agencia / Empresa": string
  Foto: NotionFile[]
  Texto: string
  Estrellas: number         // 1-5
  Fuente: "Comunidad" | "Formación" | "Consultoría" | "Ponencia"
  Orden: number
  "Destacado en home": boolean
  Publicado: boolean
}

export interface Faq {
  Pregunta: string          // TITLE
  Respuesta: string
  Categoría:                // select
    | "General" | "Consultoría" | "Formación"
    | "Comunidad" | "Precios" | "Técnico"
  Orden: number
  Publicado: boolean
}

export interface Hito {
  "Título": string          // TITLE
  "Año": number
  "Fecha exacta": NotionDate
  "Descripción": string
  "Icono / Emoji": string   // text
  Categoría: "Empresa" | "Formación" | "Ponencia" | "Proyecto" | "Reconocimiento"
  Orden: number
  Publicado: boolean
}

export interface BlogPost {
  "Título": string          // TITLE
  Slug: string
  "Resumen (meta description)": string
  Portada: NotionFile[]
  Tags: Array<"IA" | "Automatización" | "Notion" | "Marketing" | "Casos" | "Tutorial">
  Tipo: "Artículo" | "Guía" | "Descargable" | "Vídeo"
  "Fecha publicación": NotionDate
  Destacado: boolean
  Publicado: boolean
}

export interface NotionFile {
  name: string
  url: string
}

export interface NotionDate {
  start: string
  end: string | null
  time_zone: string | null
}
