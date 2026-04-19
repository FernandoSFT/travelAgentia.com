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

## Despliegue en Producción (Vercel)

La web se despliega automáticamente en Vercel cuando haces push a la rama principal (`main`/`master`).
Asegúrate de configurar **todas las variables de entorno** en el dashboard de Vercel.

### Despliegue Bajo Demanda (n8n / Webhooks)
Dado que el sitio es estático, debe recompilarse cada vez que cambias contenido en Notion.
Para esto:
1. En Vercel: Ve a *Settings > Git > Deploy Hooks* y crea un webhook.
2. En GitHub: Ve a *Settings > Secrets and variables > Actions* y crea un secreto `VERCEL_DEPLOY_HOOK` con la URL del paso 1.
3. El webhook llamará al GitHub Action configurado en `.github/workflows/rebuild.yml` (que puede ser activado también vía n8n).

## Estructura del Proyecto
- `src/lib/notion.ts`: Helpers y tipos para interactuar con Notion.
- `src/pages/`: Rutas de Astro (`/`, `/sobre-mi`, `/servicios`, etc).
- `src/layouts/`: Plantilla principal (`Layout.astro`).
- `src/components/`: Componentes React hidratados en cliente.
- `src/styles/`: CSS global (Tailwind).
