# Agentes — TravelAgentIA

## Proyecto

Web de TravelAgentIA: `https://github.com/FernandoSFT/travelAgentia.com`
Stack: **Astro 4** (SSG) + **React islands** + **Tailwind CSS** + **Notion CMS**

## Normas para agentes

1. **Este es Astro, no Next.js.** No uses convenciones de Next.js (no `src/app/`, no `export const metadata`, no App Router).
2. **Componentes `.astro`** = estáticos, zero JS al cliente.
3. **Componentes `.tsx`** = islands interactivas, usar `client:load` o `client:visible`.
4. **No hardcodear contenido** que deba venir de Notion — usar `get*()` de `src/lib/notion.ts`.
5. **CSS**: usar clases de Tailwind. No crear nuevos archivos `.css` sin justificación.
6. **No editar `src/lib/notion.ts`** sin conocer la API de Notion v5 (`dataSources.query`).
7. **Para desplegar**: `gh workflow run rebuild.yml` — triggere Vercel deploy hook.

## Documentación de referencia

- `skill:travelagentia-codebase` en Hermes (completa, vigente)
- `README.md` — setup local
- `AUDIT.md` — decisiones de arquitectura
- `LIGHTHOUSE.md` — métricas de rendimiento
- `src/lib/notion.ts` — wrapper Notion
- `src/lib/notion.types.ts` — tipos TypeScript
