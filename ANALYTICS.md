# Documentación de Analítica (Plausible)

El sitio utiliza **Plausible Analytics** para la medición de tráfico de forma respetuosa con la privacidad, sin el uso de cookies y en cumplimiento completo con la GDPR.

## Variables de Entorno Requeridas

Para activar la analítica en producción, se requiere configurar la variable:
```env
PUBLIC_PLAUSIBLE_DOMAIN=travelagentia.com
```

## Respeto a DNT (Do Not Track)
El script de Plausible y el helper de eventos custom (`src/lib/analytics.ts`) leen la preferencia `navigator.doNotTrack` del usuario. Si el usuario la tiene activa (`"1"`), se inhibe completamente el disparo de eventos y pageviews.

## Eventos Custom Implementados

Los siguientes eventos han sido instrumentalizados y pueden ser consultados en el Dashboard de Plausible (sección *Goals* u *Objetivos*):

| Event Name | Ubicación / Trigger | Propiedades Adicionales (`props`) |
| --- | --- | --- |
| `Lead Form Submit` | Redirección exitosa a `/gracias` tras completar formulario de contacto. | Ninguna. |
| `Reserva Cita Click` | Clic en cualquier enlace que lleve a `/reserva-cita` o abra el iframe de `calendar.app.google`. | Ninguna. |
| `WhatsApp Click` | Clic en botones/enlaces `wa.me` o `whatsapp://` (típicamente en el footer). | Ninguna. |
| `Email Click` | Clic en hipervínculos `mailto:` de contacto. | Ninguna. |
| `Servicio Detalle View` | Al renderizarse la vista de detalle de un servicio (`/servicios/[slug]`). | `{ slug: "nombre-del-slug" }` |
| `Download Media Kit` | Clic en elementos con la clase CSS o prop `plausible-event-name=Download+Media+Kit`. | Ninguna. |

## Cómo añadir nuevos eventos
1. Puedes añadir la llamada explícita importando el helper:
   ```javascript
   import { track } from '../lib/analytics';
   track('Nombre Evento', { property1: 'valor' });
   ```
2. O bien, mediante el event listener global en `src/layouts/Layout.astro` delegando por clases (p.ej: `className.includes('mi-clase')`).
