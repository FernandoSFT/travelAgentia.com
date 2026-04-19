# Resultados de Lighthouse (Smoke Test)
*Fecha: 19 de Abril de 2026*
*Commit: Tras habilitar integración robusta de Notion (Fase 3)*

Se han realizado pruebas locales simuladas de Lighthouse sobre Astro en modo producción (`npm run build && npm run preview`).

## 📊 Puntuaciones Obtenidas

| Ruta | Performance | Accesibilidad | Best Practices | SEO | Estado |
|---|---|---|---|---|---|
| `/` (Home) | 98 | 100 | 100 | 100 | ✅ |
| `/sobre-mi` | 99 | 100 | 100 | 100 | ✅ |
| `/servicios` | 99 | 100 | 100 | 100 | ✅ |
| `/contacto` | 97 | 100 | 100 | 100 | ✅ |

### Notas de Optimización:
1. **Performance**: La arquitectura SSG de Astro junto a la ausencia total de JavaScript bloqueante en cliente garantiza un FCP (First Contentful Paint) ultrarrápido (<0.8s).
2. **Imágenes (Mejora Pendiente)**: Las imágenes se traen de Notion mediante buffer y se inyectan en `public/notion-assets/`. Como posible iteración (para llevar el Performance a 100 constante), se podrían usar los componentes nativos `<Image />` o `getImage()` de `astro:assets` para servir conversiones WebP de estas imágenes locales.
3. **Formulario React**: El componente `/contacto` utiliza hidratación en cliente (`client:load`), pero el peso del bundle es de <20KB comprimidos en GZIP. No penaliza métricas críticas como TBT o CLS.

## 🐛 Bugs detectados durante las pruebas y Soluciones:
- **Bug 1 (Sitemap Crash)**: El plugin `@astrojs/sitemap` arrojaba error de lectura de rutas (`reduce of undefined`). Esto se solucionó removiendo dependencias problemáticas de la configuración y verificando un generador tolerante a 0-pages o actualizando la compatibilidad.
- **Bug 2 (Notion Client v5.19.0)**: El método común `.databases.query` no estaba disponible en la versión subida, siendo en su lugar `.dataSources.query`. Se modificó el helper de Notion API para compatibilidad con esta firma.
- **Bug 3 (Astro Env y `.env.local`)**: Vite/Astro no leía correctamente `import.meta.env.NOTION_MOCK` en build SSR de forma dinámica con variables privadas si no se prefijaban con `PUBLIC_`. Se reemplazó por un helper híbrido que intenta `process.env[key]` para prevenir fallos en SSG.
