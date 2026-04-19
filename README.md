# TravelAgentIA (v3)

Repositorio oficial para la web de TravelAgentIA.
Arquitectura reconstruida con **Astro 4**, **Tailwind CSS** e **Integración Headless con Notion**.

## Stack Tecnológico

- **Framework**: Astro 4 (SSG - Static Site Generation)
- **UI**: Tailwind CSS + React (para Astro Islands interactivos)
- **CMS**: Notion (vía `@notionhq/client` y `notion-to-md`)
- **Hosting**: Vercel

## Requisitos Previos

- Node.js 20+
- Token de integración de Notion (Secret)
- Acceso a las bases de datos de Notion de TravelAgentIA.

## Configuración Local

1. Clona el repositorio y ejecuta la instalación:
   ```bash
   npm install
   ```

2. Crea un archivo `.env.local` en la raíz del proyecto y añade tus variables:
   ```env
   NOTION_TOKEN=secret_xxx
   NOTION_PREVIEW=false
   
   # IDs de las Bases de Datos (UUIDs)
   DS_SECCIONES_WEB=
   DS_AJUSTES_GLOBALES=
   DS_SERVICIOS=
   DS_PROYECTOS_CASOS=
   DS_CHARLAS=
   DS_CURSOS=
   DS_PODCASTS=
   DS_TESTIMONIOS=
   DS_FAQ=
   DS_HITOS=
   DS_BLOG=
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Astro se conectará a Notion, descargará los datos y compilará las páginas. Visita `http://localhost:4321`.

## Configuración Avanzada y Entornos

### Modo Mock (Pruebas locales sin API real)
Si no tienes acceso temporalmente a Notion o deseas testear la UI de forma rápida, puedes ejecutar Astro en **Modo Mock**.
El flag `NOTION_MOCK=true` indicará al wrapper (`src/lib/notion.ts`) que omita el SDK de Notion y en su lugar cargue las fixtures definidas en `src/lib/notion.mock.ts`.
- **Ejecutar en dev:** `NOTION_MOCK=true npm run dev`
- **Compilar build local:** `npm run build:mock`

### Modo Preview (Ver borradores)
Por defecto, el sitio solo trae de Notion aquellos elementos cuyo campo `Publicado` sea `true`.
Si deseas probar cómo quedan los posts en modo "draft" antes de publicarlos, puedes forzar la previsualización:
Añade `NOTION_PREVIEW=true` en tu `.env.local` y se omitirá el filtro de "Publicado" para descargar absolutamente todo el contenido.

### Variables de entorno (`.env.local`)
- `NOTION_TOKEN`: El token secreto del Integration (Secret). Requerido.
- `NOTION_PREVIEW`: `true` o `false`. Si es true, ignora el check de `Publicado`.
- `NOTION_MOCK`: `true` o `false`. Si es true, usa datos de prueba estáticos de `notion.mock.ts`.
- `DS_*`: IDs de las bases de datos de Notion necesarias.
- `PUBLIC_N8N_WEBHOOK`: Endpoint donde el formulario de `/contacto` arroja el POST del lead.
- `PUBLIC_CALENDAR_URL`: Enlace público iframe de Google Calendar u otra herramienta para cita previa.

**Aviso sobre Imágenes:**
Las imágenes hosteadas en Notion tienen URLs que caducan tras 1 hora. El pipeline de `src/lib/notion.ts` se encarga de interceptarlas durante el proceso de **build**, descargarlas localmente y exponerlas en `/public/notion-assets/` bajo un hash estático. ¡Nunca sirvas URLs de Amazon S3 de Notion directamente en producción!

## Estructura del Proyecto
- `src/lib/notion.ts`: Helpers y tipos para interactuar con Notion.
- `src/pages/`: Rutas de Astro (`/`, `/sobre-mi`, `/servicios`, etc).
- `src/layouts/`: Plantilla principal (`Layout.astro`).
- `src/components/`: Componentes React hidratados en cliente.
- `src/styles/`: CSS global (Tailwind).
