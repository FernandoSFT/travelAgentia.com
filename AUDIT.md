# Auditoría del Repositorio `travelagentia-web` (v2.1 -> v3)

## Estado Actual
- **Framework**: Next.js 16 (App Router).
- **Styling**: CSS Modules (`.module.css`) con variables nativas en `globals.css`. Aunque existen dependencias como `clsx` y `tailwind-merge`, Tailwind CSS **no está configurado ni instalado** (`tailwindcss` no está en `package.json`).
- **Componentes**: Estructura de React bajo `src/components/ui/`, `sections/` y `layout/`. Todos son `.tsx`.
- **Contenido**: Textos (copys) "hardcoded" directamente en los componentes de React (ej. `Hero.tsx`).
- **Librerías Adicionales**: `framer-motion` para animaciones y `lucide-react` para iconos.
- **Rutas**: Páginas estáticas en `src/app/` (`/`, `/aviso-legal`, `/cookies`, `/privacidad`).

## ¿Qué aprovechamos?
1. **Lógica interactiva**: Componentes que requieran estado (como `CookieBanner.tsx` y el futuro formulario de contacto) se pueden mantener como componentes React para usarlos como *Astro Islands* (con la directiva `client:load` o `client:visible`).
2. **Estructura general de componentes**: La división lógica entre `ui`, `sections` y `layout` es buena y se mantendrá en Astro (`src/components/`).
3. **Dependencias Útiles**: `lucide-react` y `framer-motion` se pueden reutilizar en los componentes interactivos de React que se mantengan.
4. **Diseño base**: Las definiciones de colores y tipografías (Playfair, Inter, JetBrains) nos servirán como base para la configuración de Tailwind CSS.

## ¿Qué reescribimos?
1. **Core Framework**: Reemplazar Next.js por **Astro 4**. La carpeta `src/app/` se eliminará a favor de `src/pages/` (rutas `.astro`).
2. **Estilos**: Eliminar completamente los CSS Modules y reescribir los estilos de los componentes usando **Tailwind CSS**.
3. **Componentes Estáticos**: Reescribir los componentes estáticos (Hero, Footer, About, Servicios) de `.tsx` a `.astro` para aprovechar el renderizado estático nativo de Astro sin enviar JS al cliente (zero-JS).
4. **Orígenes de Datos (CMS)**: Reemplazar los textos *hardcoded* integrando `@notionhq/client` y `notion-to-md`. Se creará un wrapper (`src/lib/notion.ts`) para inyectar los datos en *build time* a los componentes `.astro`.
5. **Enrutamiento y SEO**: Reescribir el manejo de metadatos de Next.js (`export const metadata`) a etiquetas `<meta>` en los layouts de Astro (`src/layouts/Layout.astro`), integrando tipado enriquecido, sitemaps y Open Graph generados dinámicamente desde Notion.
