# Plan: travelagentia.com — saneamiento y completado

**Fecha**: 2026-05-03 | **Branch**: main | **Repo**: FernandoSFT/travelAgentia.com

## Priorización

Cada fase es independiente y mergeable. Se ordena por (1) lo que más duele si falla, (2) dependencias, (3) quick wins que destraban lo demás.

---

## Fase 1 — Limpieza (3 tareas, ~15 min)

### 1.1 Eliminar código muerto
- Borrar `src/components/sections/Hero.tsx` (importa CSS inexistente, nunca usado)
- Borrar `src/components/layout/Navbar.tsx` (duplicado, nunca usado)
- Borrar `src/components/layout/Footer.tsx` (ídem)
- **Justificación**: Carga cognitiva, riesgo de que alguien lo importe y rompa build, confunde a nuevos devs.

### 1.2 Eliminar AGENTS.md obsoleto
- Contenido actual son reglas de Next.js agent — proyecto es Astro. Reemplazar por referencia a la skill `travelagentia-codebase`.
- **Justificación**: Evita que agentes futuros lean instrucciones incorrectas.

### 1.3 Verificar `.gitignore` vs `public/notion-assets/`
- Leer `.gitignore` y confirmar si la carpeta está excluida.
- Si lo está → añadir paso de caché al workflow `rebuild.yml` (o incluirla en git si los assets son estables).
- **Justificación**: Re-descargar assets en cada build de CI es lento e innecesario si los assets no cambian.

---

## Fase 2 — Paginas rotas (3 tareas, ~45 min)

### 2.1 Crear `pages/faq.astro`
- Usar `getFaqs()` de `src/lib/notion.ts` (ya existe, ya devuelve datos tipados)
- Renderizar FAQAccordion (ya existe en `src/components/FAQAccordion.tsx`) pasándole los datos como prop
- **Paralelo**: Modificar `FAQAccordion.tsx` para aceptar `faqs` como prop en lugar del array hardcoded (con fallback al hardcoded si no se pasan props)
- **Justificación**: Página no existe → 404. El briefing la incluye. El componente ya está listo, solo falta conectar datos.

### 2.2 Crear `pages/404.astro`
- Mínimo: layout con mensaje y CTA a home
- **Justificación**: UX básica. Error sin 404 personalizada da mala impresión en una web premium.

### 2.3 Crear `.env.example`
- Listar todas las vars documentadas en README: `NOTION_TOKEN`, `NOTION_MOCK`, `DS_*`, `PUBLIC_PLAUSIBLE_DOMAIN`, etc.
- **Justificación**: Onboarding de devs. Sin esto, cada nuevo colaborador adivina.

---

## Fase 3 — Schema + Blog (2 tareas, ~45 min)

### 3.1 Completar JSON-LD en `Layout.astro`
- Añadir `FAQPage` schema (si estamos en /faq)
- Añadir `Service` schema (si estamos en /servicios)
- Añadir `LocalBusiness` para SAFE TOUR
- **Justificación**: SEO. El briefing de marketing lo exige. Sin schema rico, pierdes fragmentos enriquecidos en Google.

### 3.2 Implementar fetch de bloques para blog
- En `getBlog()` (notion.ts línea 336-349), `Cuerpo` siempre es `""`
- Necesita usar `notion-to-md` (ya instalado) para convertir bloques de cada página
- Alternativa: si el blog no se usa aún, documentarlo como pendiente y no tocar código
- **Justificación**: El blog es contenido pilar del SEO según el briefing. Sin cuerpo, no sirve.

---

## Fase 4 — Métricas y assets (2 tareas, ~30 min)

### 4.1 Crear imagen Open Graph (`public/images/og.png`)
- 1200×630, fondo #0A0A0A, logo TravelAgentIA dorado, claim
- **Justificación**: Social sharing. Sin OG image, los enlaces en WhatsApp/Twitter/LinkedIn se ven pobres.

### 4.2 Fuentes: añadir `<link rel="preload">` en Layout.astro
- Preload de `inter-latin.woff2` y `playfair-display-700-latin.woff2`
- **Justificación**: FCP/LCP. Las fuentes son blocking sin preload. Lighthouse ya da 97-99, esto lo lleva a 100.

---

## Resumen

| Fase | Tareas | Tiempo est. | Impacto |
|---|---|---|---|
| 1 — Limpieza | 3 | 15 min | Mantenibilidad + CI |
| 2 — Páginas rotas | 3 | 45 min | UX + onboarding |
| 3 — Schema + Blog | 2 | 45 min | SEO + contenido |
| 4 — Assets | 2 | 30 min | Marketing + perf |

**Total**: 10 tareas, ~2h15min. Todas las fases son independientes y mergeables por separado.
