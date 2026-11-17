# Reserva gratuita de TravelAgentIA

La página estática `/reservar/` consulta `GET /api/reservas/horarios` y confirma con `POST /api/reservas/citas`. El servicio pide a Google los intervalos ocupados, devuelve únicamente los comienzos disponibles y crea un evento privado de 60 minutos. Google recibe el asistente, la solicitud de conferencia de Meet y la instrucción de enviar la invitación. La interfaz muestra los horarios en `Europe/Madrid`.

## Configuración en Hermes

1. Usa Node.js 24 y ejecuta `npm ci --include=dev` desde el checkout.
2. Habilita Google Calendar API en el proyecto de Google Cloud. Autoriza OAuth con la cuenta organizadora de la reserva actual, con acceso de escritura en ese calendario y acceso a la disponibilidad de todos los calendarios que se deben comprobar. Solicita acceso sin conexión para obtener el token de actualización. Los ámbitos que usa el servicio son `https://www.googleapis.com/auth/calendar.events` y `https://www.googleapis.com/auth/calendar.events.freebusy`. Conserva los valores OAuth en un fichero de entorno de Hermes con permisos restringidos, fuera del checkout y del directorio web.
3. Configura estas variables en el proceso Node. Las dos URLs OAuth y Calendar se consultan desde Hermes.

| Variable | Uso |
| --- | --- |
| `BOOKING_GOOGLE_CLIENT_ID` | ID del cliente OAuth. |
| `BOOKING_GOOGLE_CLIENT_SECRET` | Secreto del cliente OAuth. |
| `BOOKING_GOOGLE_REFRESH_TOKEN` | Token de actualización de la cuenta organizadora. |
| `BOOKING_GOOGLE_CALENDAR_ID` | ID que aparece en la sección «Integrar el calendario» del mismo calendario que recibe las reservas actuales. El enlace público de la agenda de reservas es independiente de este ID. |
| `BOOKING_GOOGLE_CONFLICT_CALENDARS` | IDs adicionales, separados por comas, que se consultan para evitar conflictos. Déjalo vacío si basta con el calendario de destino. |
| `BOOKING_WEEKLY_HOURS` | Franjas de la agenda actual en hora de Madrid. Formato `1=HH:MM-HH:MM,HH:MM-HH:MM;2=HH:MM-HH:MM`. Los días van de 1 (lunes) a 7 (domingo). Omite los días cerrados. Los turnos empiezan cada 60 minutos desde el comienzo de cada franja. |
| `BOOKING_NOTICE_MINUTES` | Antelación mínima. Valor predeterminado `1440`. Ajusta el valor a la agenda actual. |
| `BOOKING_DAYS_AHEAD` | Número de días calendario consultados, incluido el día actual. Valor predeterminado `21`. Ajusta el valor a la agenda actual. |
| `BOOKING_ORIGINS` | Orígenes autorizados para confirmar. Por defecto, ambos dominios de TravelAgentIA con HTTPS. |
| `BOOKING_PORT` | Puerto local del proceso. Por defecto, `4326`. |

Google Calendar API expone la ocupación de los calendarios. Las reglas de la agenda pública, como sus franjas semanales, antelación o excepciones, se gestionan aparte en Google. Copia las franjas, los calendarios que bloquean y la antelación de la agenda original. Bloquea las excepciones puntuales como eventos ocupados en uno de los calendarios consultados. Si la agenda original usa intervalos de inicio menores de 60 minutos, comprueba y adapta esta regla antes de activar la interfaz.

4. Mantén una sola instancia de `npm run booking:start` en Hermes con su gestor de servicios y el entorno anterior. El servicio escucha en `127.0.0.1`. En el bloque de Caddy de TravelAgentIA, añade este manejador antes del manejador estático genérico y valida la configuración antes de recargar Caddy:

```caddyfile
handle /api/reservas/* {
    reverse_proxy 127.0.0.1:4326 {
        header_up X-Booking-Client-IP {remote_host}
    }
}
```

5. Comprueba que `curl -fsS http://127.0.0.1:4326/api/reservas/horarios` y `curl -fsS https://travelagentia.com/api/reservas/horarios` devuelven los horarios esperados y la zona `Europe/Madrid`. Contrasta el resultado con la agenda de reservas actual. Comprueba con un correo de prueba que llega la invitación con Meet y cancela esa cita de prueba.
6. Publica la web estática con `PUBLIC_NATIVE_BOOKING=true npm run build` usando la configuración de producción habitual de Notion. Conserva la compilación anterior para volver a la reserva integrada de Google si es necesario. El formulario propio se activa solo con ese valor y con `PUBLIC_PREVIEW` desactivado.

Las reservas concurrentes que llegan al mismo proceso se coordinan y se vuelve a consultar Google antes de insertar. Google no ofrece una operación atómica de disponibilidad y creación entre canales. Si entra una cita por otro canal en el mismo instante, revisa el calendario. Si se amplía a varias instancias, el bloqueo debe compartirse entre ellas.

Para verificar la lógica y la integración con Google simulado, ejecuta `npm run booking:test`.
