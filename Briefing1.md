## 🎯 Briefing del proyecto

<aside>
🤖

**Generado por**: Automatizador (coordinador Automatiza2) con apoyo de Act - Especialista Marketing & SEO y Act - Director de Desarrollo de Negocio B2B.

**Objetivo**: Rediseño completo de [travelagentia.com](http://travelagentia.com) como web de consultoría IA premium para agencias de viajes.

**Destino**: Antigravity IDE — copiar esta página como spec para generar la web.

</aside>

---

## 🎨 Dirección de diseño

### Paleta de colores

| **Elemento** | **Color** | **Código HEX** | **Uso** |
| --- | --- | --- | --- |
| Fondo principal | Negro profundo | #0A0A0A | Body, secciones hero y principales |
| Fondo secundario | Gris carbón | #1A1A1A | Cards, secciones alternas, footer |
| Fondo terciario | Gris oscuro | #2D2D2D | Bordes, separadores, hover states |
| Dorado principal | Oro cálido | #C9A84C | Títulos H1, iconos destacados, bordes premium |
| Dorado claro | Oro luminoso | #E8D48B | Subtítulos, hover en links, acentos |
| Dorado gradient | Degradado | linear-gradient(135deg, #C9A84C, #E8D48B, #C9A84C) | CTAs principales, badges, líneas decorativas |
| Texto principal | Blanco suave | #F5F5F5 | Párrafos, texto body |
| Texto secundario | Gris claro | #A0A0A0 | Subtextos, labels, meta info |

### Tipografía

| **Rol** | **Fuente** | **Peso** | **Notas** |
| --- | --- | --- | --- |
| Títulos (H1, H2) | Playfair Display | 700 / Bold | Serif elegante. Color dorado #C9A84C. Tracking +0.02em |
| Subtítulos (H3, H4) | Inter | 600 / SemiBold | Sans-serif limpia. Color #E8D48B |
| Body / Párrafos | Inter | 400 / Regular | Color #F5F5F5. Line-height: 1.7. Max-width: 720px |
| Botones CTA | Inter | 700 / Bold | Uppercase. Letter-spacing: 0.1em. Fondo degradado dorado |
| Labels / Tags | JetBrains Mono | 500 / Medium | Monospace para datos técnicos y badges. Tamaño reducido |

### Estilo visual general

- **Estética**: Dark luxury + tech premium. Inspiración: sitios de SaaS enterprise (Linear, Vercel, Stripe) cruzado con branding de consultoría de alto nivel
- **Efectos CSS**: Glassmorphism sutil en cards (backdrop-filter: blur + borde semitransparente dorado). Glow dorado suave en hover de botones. Gradient text en títulos hero (CSS background-clip: text)
- **Imágenes**: Estilo editorial, fotografías de agencias de viajes reales con overlay oscuro (70% negro). Iconografía: línea fina dorada (stroke icons)
- **Animaciones**: Scroll reveal suave (fade-up). Contador animado en métricas. Parallax sutil en hero
- **Espaciado**: Generoso. Padding vertical de secciones: 120px mínimo. Sensación de respiración y premium
- **Cards de servicio**: Fondo #1A1A1A, borde 1px #2D2D2D, hover → borde #C9A84C con transición 0.3s. Border-radius: 12px
- **Botones CTA primarios**: Fondo degradado dorado, texto #0A0A0A (negro), border-radius: 8px, padding: 16px 40px. Hover: glow dorado
- **Botones CTA secundarios**: Borde 1px dorado, fondo transparente, texto dorado. Hover: fondo dorado, texto negro
- **Separadores de sección**: Línea fina degradado dorado (1px), centered, max-width 200px

---

## 📐 Estructura de secciones

---

## SECCIÓN 1 — HERO

<aside>
💡

**Layout**: Full viewport height. Fondo: #0A0A0A con patrón sutil de puntos/grid en #1A1A1A. Centrado vertical y horizontal.

</aside>

### Meta SEO

- **Title tag**: Consultoría de IA para Agencias de Viajes | TravelAgentIA
- **Meta description**: Implementa inteligencia artificial en tu agencia de viajes con quien la usa cada día. Consultoría, formación y automatización probadas en una agencia real. De agente a agente.
- **H1** (visible): el título hero de abajo

### Contenido

**Pre-título** (label dorado, monospace, uppercase, tracking amplio):

DE AGENTE A AGENTE

**H1** (Playfair Display, degradado dorado, 56-72px):

Inteligencia Artificial que funciona porque la usamos cada día

**Subtítulo** (Inter, #A0A0A0, 20px, max-width 600px):

Consultoría, formación y automatización de IA diseñadas exclusivamente para agencias de viajes. Probadas en una agencia real. Implementadas en más de 70 agencias.

**CTAs** (dos botones lado a lado):

- Botón primario (degradado dorado): EMPIEZA AHORA → enlace a #servicios
- Botón secundario (borde dorado): VER CÓMO FUNCIONA → enlace a #metodologia

**Badge inferior** (glassmorphism card, centrado bajo CTAs):

✦ +70 agentes en la comunidad · ✦ +500 agencias en red con Traveltool · ✦ Ponente AEVAV 2026

---

## SECCIÓN 2 — EL PROBLEMA (id="problema")

<aside>
💡

**Layout**: Dos columnas. Izquierda: texto. Derecha: grid 2×2 de cards con iconos dorados. Fondo: #0A0A0A.

</aside>

### Meta SEO

- **Keyword principal**: problemas agencias de viajes con IA
- **H2**: ¿Te suena alguno de estos problemas?

### Contenido

**H2** (Playfair Display, dorado):

¿Te suena alguno de estos problemas?

**Párrafo intro** (Inter, #F5F5F5):

La mayoría de agencias de viajes saben que la IA puede ayudarles, pero no encuentran el camino. Los cursos genéricos no entienden tu negocio. Las herramientas son muchas y cambian cada semana. Y al final, vuelves a lo de siempre.

**Cards del problema** (4 cards, icono + título + descripción):

1. ⏳ **Pierdes horas en tareas que no venden**

Copiar datos, buscar precios, rellenar formularios, redactar emails desde cero… El trabajo administrativo devora tu tiempo de venta.

1. 🤖 **Probaste ChatGPT pero no te sirvió de mucho**

Sin contexto de tu agencia, sin tus proveedores, sin tu forma de trabajar… la IA genérica da respuestas genéricas.

1. 📚 **La formación en IA no habla tu idioma**

Cursos de marketing digital, tutoriales para programadores… Nadie te enseña a aplicar IA a expedientes, propuestas o seguimiento de clientes.

1. 🔄 **Cada herramienta nueva es un mundo aparte**

ChatGPT por aquí, Notion por allá, automatizaciones sueltas… Nada está conectado y acabas duplicando trabajo.

---

## SECCIÓN 3 — QUIÉN SOY (id="sobre-mi")

<aside>
💡

**Layout**: Imagen a la izquierda (foto de Fernando, borde dorado, border-radius 12px). Texto a la derecha. Fondo: #1A1A1A.

</aside>

### Meta SEO

- **Keyword**: consultor IA agencias viajes España
- **H2**: Soy Fernando Córdoba

### Contenido

**Pre-título** (label dorado): SOBRE MÍ

**H2** (Playfair Display, dorado):

Soy Fernando Córdoba

**H3** (Inter, #E8D48B):

Agente de viajes en activo. Consultor de IA especializado en el sector turístico.

**Texto** (Inter, #F5F5F5):

Llevo más de 15 años gestionando viajes desde mi propia agencia, SAFE TOUR, en Andújar (Jaén). Hace tres años empecé a integrar inteligencia artificial en mi día a día: expedientes, propuestas, seguimiento comercial, cobros, marketing… Todo.

Hoy gestiono mi agencia con un ecosistema de más de 20 agentes de IA coordinados que trabajan sobre Notion, n8n y herramientas propias. No es teoría. Es lo que uso cada mañana para abrir el correo, generar propuestas y enviar presupuestos por WhatsApp.

Creé TravelAgentIA porque me di cuenta de que lo que estaba construyendo podía transformar cualquier agencia. No desde la teoría. Desde la trinchera.

**Credenciales** (grid horizontal de badges con icono dorado):

- 🎓 Curso Superior en IA Generativa — UCAM (750h, 30 ECTS)
- 🏢 Gerente de SAFE TOUR — Agencia operativa desde 2008
- 🎤 Ponente en AEVAV, V Salón del Viaje de Sevilla, DIT Gestión
- 🤝 Acuerdo de exclusividad con Traveltool (Grupo VECI — ~500 agencias)
- 👥 Comunidad de +70 agentes de viaje implementando IA
- 🛠️ Certificaciones en Notion, Make y automatización avanzada

---

## SECCIÓN 4 — METODOLOGÍA: LOS 5 PASOS (id="metodologia")

<aside>
💡

**Layout**: Sección full-width. Timeline vertical con 5 nodos. Cada nodo: número dorado grande + título + descripción. Línea conectora dorada entre nodos. Fondo: #0A0A0A. El paso 5 destacado con borde dorado y glow.

</aside>

### Meta SEO

- **Keyword**: implementar IA en agencia de viajes paso a paso
- **H2**: Los 5 Pasos de la IA en tu agencia

### Contenido

**Pre-título** (label dorado): METODOLOGÍA PROPIA

**H2** (Playfair Display, dorado):

Los 5 Pasos de la IA en tu agencia (a día de hoy)

**Subtítulo** (Inter, #A0A0A0):

Cada agencia empieza donde está y avanza a su ritmo. La mayoría están en el Paso 1 o 2. Las más avanzadas experimentan con el 3. Yo opero en el 5 — y te acompaño hasta allí.

### Timeline

**Paso 1 — La IA como consulta**

Preguntas sueltas a la IA, sin memoria, sin contexto de tu agencia. Un "Google inteligente". Útil, pero limitado.

*La mayoría de agencias están aquí.*

**Paso 2 — Prompts especializados**

Instrucciones personalizadas con tu tono, tus proveedores, tu forma de trabajar. Mejor resultado, pero todo es manual: copiar, pegar, adaptar.

*Salto clave: de genérico a contextualizado.*

**Paso 3 — IA conectada (Copiloto)**

La IA accede a tu email, tu calendario, tu CRM. Lee datos reales de tu negocio y ejecuta tareas simples bajo tu supervisión.

*Salto clave: de solo texto a conectado con tus herramientas.*

**Paso 4 — Agentes autónomos**

Agentes con rol propio que ejecutan procesos completos: seguimiento comercial, generación de propuestas, marketing en redes. Sin que se lo pidas.

*Salto clave: de asistente a autónomo.*

**Paso 5 — Ecosistema orquestado** ✦

Múltiples agentes coordinados con un coordinador central, bases de datos compartidas y reglas de negocio unificadas. Todo conectado: expedientes, servicios, cobros, tareas, propuestas, contactos. Sin copiar y pegar nada.

*Aquí es donde opero yo. Y donde te llevo.*

**CTA bajo la timeline**:

Botón primario: ¿EN QUÉ PASO ESTÁS? HABLEMOS → enlace a #contacto

---

## SECCIÓN 5 — SERVICIOS (id="servicios")

<aside>
💡

**Layout**: 3 cards grandes en fila (responsive: stack en móvil). Cada card con icono dorado grande, título, descripción, lista de bullet points y CTA. Card central (Consultoría) ligeramente más grande y con borde dorado + badge "MÁS POPULAR". Fondo: #1A1A1A.

</aside>

### Meta SEO

- **Keyword**: consultoría IA agencias viajes, formación IA agencias, automatización agencia viajes
- **H2**: Tres caminos para avanzar

### Contenido

**Pre-título** (label dorado): SERVICIOS

**H2** (Playfair Display, dorado):

Tres caminos para avanzar

**Subtítulo** (Inter, #A0A0A0):

Tanto si estás empezando como si quieres un sistema completo, hay un servicio pensado para ti.

---

### Card 1 — Comunidad TravelAgentIA

**Icono**: 👥

**H3** (dorado): Comunidad

**Subtítulo**: Aprende, comparte, avanza con otros agentes

**Descripción**:

El punto de entrada. Una comunidad activa de agentes de viaje que ya están aplicando inteligencia artificial en su día a día. No es un curso cerrado: es un espacio vivo donde se comparten casos reales, herramientas probadas y soporte entre profesionales del sector.

**Incluye**:

- Sesiones en vivo semanales con casos prácticos
- Biblioteca de BecarIAs: GPTs especializados para agencias
- Prompts probados para expedientes, propuestas, cobros y marketing
- Acceso a la comunidad privada (soporte entre pares)
- Recursos descargables y plantillas

**Ideal para**: Agencias que quieren empezar a usar IA con guía y sin inversión grande.

**CTA**: ÚNETE A LA COMUNIDAD →

---

### Card 2 — Consultoría Guiada (badge: ✦ MÁS POPULAR)

**Icono**: 🧭

**H3** (dorado): Consultoría "Hazlo Conmigo"

**Subtítulo**: Implementación personalizada con acompañamiento experto

**Descripción**:

Trabajamos juntos, uno a uno, para implementar la IA en tu agencia de forma personalizada. Yo diseño la solución, tú aprendes a manejarla. Al final del proceso, tienes un sistema propio que entiendes y controlas.

**Incluye**:

- Diagnóstico inicial de tu agencia (procesos, herramientas, cuellos de botella)
- Diseño de tu hoja de ruta IA personalizada
- Sesiones 1:1 de implementación guiada
- Configuración de herramientas (Notion, automatizaciones, GPTs)
- Soporte prioritario durante todo el proceso
- Acceso completo a la comunidad

**Ideal para**: Agencias que quieren liderar la implementación y entender lo que hacen.

**CTA**: RESERVA TU DIAGNÓSTICO GRATUITO →

---

### Card 3 — Llaves en Mano

**Icono**: 🔑

**H3** (dorado): "Lo Hacemos por Ti"

**Subtítulo**: Implementación completa. Tú delegas, nosotros construimos.

**Descripción**:

Nos encargamos de todo: análisis, diseño, implementación y puesta en marcha. Construimos tu ecosistema de IA completo — desde el CRM inteligente hasta los agentes autónomos — adaptado a tu forma de trabajar. Tú solo tienes que usarlo.

**Incluye**:

- Auditoría completa de procesos y oportunidades
- Diseño e implementación de workspace Notion profesional
- Creación de agentes IA especializados para tu agencia
- Automatizaciones con n8n (seguimiento, propuestas, cobros, marketing)
- Formación de tu equipo para usar el sistema
- Soporte post-implementación
- Acceso completo a la comunidad

**Ideal para**: Agencias que quieren resultados inmediatos sin curva de aprendizaje técnico.

**CTA**: SOLICITA PRESUPUESTO →

---

## SECCIÓN 6 — CASOS REALES (id="casos")

<aside>
💡

**Layout**: Grid de 4 cards con icono, antes/después y resultado medible. Fondo: #0A0A0A. Cards con efecto glassmorphism y borde sutil dorado en hover.

</aside>

### Meta SEO

- **Keyword**: automatización agencia viajes resultados, IA agencia viajes caso real
- **H2**: Esto es lo que la IA ya hace en mi agencia

### Contenido

**Pre-título** (label dorado): CASOS REALES — SAFE TOUR

**H2** (Playfair Display, dorado):

Esto es lo que la IA ya hace en mi agencia

**Subtítulo** (Inter, #A0A0A0):

No son demos preparadas. Es lo que uso cada día para gestionar SAFE TOUR. Y es lo que puedes tener en la tuya.

---

**Caso 1 — De email a expediente en segundos**

- ⏱️ **Antes**: Leer email → identificar cliente → abrir expediente → copiar datos → crear tareas. 15-20 minutos.
- ⚡ **Después**: El sistema cruza el email con expedientes activos, identifica el viaje, crea tareas operativas, registra la nota y actualiza el estado. Automáticamente.
- 📊 **Resultado**: De 15 minutos a 30 segundos por interacción.

**Caso 2 — Propuesta completa generada con IA**

- ⏱️ **Antes**: Buscar hoteles, comparar precios, redactar propuesta, maquetar PDF. 2-3 horas.
- ⚡ **Después**: La IA analiza la oferta del proveedor, genera itinerario día a día, compara hoteles con reseñas reales, y produce una propuesta visual lista para enviar.
- 📊 **Resultado**: Propuestas profesionales en menos de 20 minutos.

**Caso 3 — Seguimiento comercial automático**

- ⏱️ **Antes**: Revisar manualmente qué clientes no han respondido. Se olvidaban seguimientos. Se perdían ventas.
- ⚡ **Después**: Un agente IA revisa cada lunes y jueves los presupuestos enviados, identifica a quién contactar, redacta el mensaje adaptado a cada fase del ciclo y lo deja listo para enviar.
- 📊 **Resultado**: 0 seguimientos olvidados. Tasa de respuesta mejorada.

**Caso 4 — De una oferta de proveedor a 3 piezas de marketing**

- ⏱️ **Antes**: La oferta se quedaba en el email. Si acaso, un post improvisado.
- ⚡ **Después**: La IA transforma la oferta en: checklist de equipaje personalizada + web-app de promoción del viaje + plan de redes sociales de 7 días con copies listos.
- 📊 **Resultado**: 3 piezas de contenido profesional desde 1 sola oferta.

---

## SECCIÓN 7 — PRUEBA SOCIAL (id="testimonios")

<aside>
💡

**Layout**: Sección con métricas grandes animadas (counters) arriba + testimonios/logos debajo. Fondo: #1A1A1A.

</aside>

### Contenido

**Pre-título** (label dorado): RESULTADOS

**H2** (Playfair Display, dorado):

Los números hablan

**Métricas** (counter animado, número dorado grande 48px + label blanco):

- **+70** agentes de viaje en la comunidad
- **+500** agencias en la red Traveltool (exclusividad IA)
- **+20** agentes IA operativos en SAFE TOUR
- **+15** años gestionando viajes como agente

**Logos / Menciones** (fila horizontal, logos en gris, hover dorado):

- AEVAV (ponencia Valencia 2026)
- V Salón del Viaje de Sevilla
- Traveltool / Grupo VECI
- UCAM
- DIT Gestión

**Testimonios** (cards con comillas doradas, foto circular, nombre y agencia):

*Espacio reservado — Solicitar testimonios a Chicho Avendaño (Selfietour / Travel Triple A), Inmaculada Rodríguez (Iguana Viajes), Nico Cort (socio estratégico) y miembros activos de la comunidad.*

**Formato sugerido de cada testimonio**:

> "[Cita del testimonial]"
> 

> — Nombre, Agencia
> 

---

## SECCIÓN 8 — FAQ (id="faq")

<aside>
💡

**Layout**: Acordeones (expand/collapse). Pregunta en dorado, respuesta en blanco. Fondo: #0A0A0A.

</aside>

### Meta SEO

- **Keywords long-tail**: ¿sirve la IA para agencias de viajes?, ¿necesito saber programar para usar IA en mi agencia?, ¿cuánto cuesta implementar IA en una agencia de viajes?
- **H2**: Preguntas frecuentes

### Contenido

**H2** (Playfair Display, dorado):

Preguntas frecuentes

**Q1: ¿Necesito saber de tecnología o programación?**

No. Mis servicios están diseñados para agentes de viajes, no para informáticos. Si sabes usar el correo electrónico y un navegador, puedes aplicar IA en tu agencia. Yo me encargo de la parte técnica y tú aprendes a usar las herramientas.

**Q2: ¿En qué se diferencia esto de un curso de ChatGPT?**

En todo. Aquí no te enseñamos a "hablar con la IA". Te implementamos un sistema completo, adaptado a tu negocio real: tus expedientes, tus proveedores, tus clientes, tu forma de cobrar. Es la diferencia entre saber que existe un martillo y tener una casa construida.

**Q3: ¿Cuánto tiempo tarda en verse resultados?**

Desde el primer día. En la comunidad, en una semana ya estás usando prompts que te ahorran tiempo real. Con la consultoría guiada, en 2-4 semanas tienes los primeros procesos automatizados. Con llaves en mano, en 4-8 semanas tienes el ecosistema operativo.

**Q4: ¿Funciona para agencias pequeñas?**

Especialmente para agencias pequeñas. Donde más impacto tiene la IA es en agencias de 1-5 personas que necesitan multiplicar su capacidad sin contratar. Mi propia agencia es una agencia pequeña — y con IA hago el trabajo de un equipo de 5.

**Q5: ¿Qué herramientas se usan?**

Principalmente Notion (como centro de operaciones), n8n (para automatizaciones), GPTs personalizados y herramientas de IA generativa. Pero lo importante no es la herramienta — es el sistema que construimos con ellas. Cada agencia tiene su configuración adaptada.

**Q6: ¿Puedo empezar por la comunidad y luego pasar a consultoría?**

Sí, y es lo que recomiendo. La comunidad es el mejor primer paso para entender qué puede hacer la IA por tu agencia. Cuando tengas claro qué necesitas, pasamos a consultoría o llaves en mano con una base sólida.

**Q7: ¿Trabajas con todas las agencias o solo con algunas?**

Trabajo con agencias de viajes de todo tipo: minoristas, especializadas, independientes, franquiciadas. Mi acuerdo de exclusividad con Traveltool es para consultoría a nivel de grupo de gestión, pero la comunidad y los servicios individuales están abiertos a cualquier agencia.

---

## SECCIÓN 9 — CTA FINAL + CONTACTO (id="contacto")

<aside>
💡

**Layout**: Sección hero secundaria. Centrado. Fondo: degradado sutil de #0A0A0A a #1A1A1A. Línea dorada decorativa superior.

</aside>

### Contenido

**Pre-título** (label dorado): DA EL PRIMER PASO

**H2** (Playfair Display, dorado, grande):

¿Listo para transformar tu agencia?

**Texto** (Inter, #F5F5F5, centrado):

Reserva una sesión de diagnóstico gratuita. Analizamos juntos en qué punto estás, qué procesos puedes automatizar primero y cuál es el siguiente paso concreto para tu agencia.

Sin compromiso. Sin humo. De agente a agente.

**CTA principal** (botón grande, degradado dorado):

RESERVA TU DIAGNÓSTICO GRATUITO → enlace a Contacto. ([travelagentia.com/#/contacto](http://travelagentia.com/#/contacto))

**Datos de contacto** (debajo del CTA, gris claro, discreto):

- 📧 [automatiza2@automatiza2.com](mailto:automatiza2@automatiza2.com)
- 📱 +34 717 717 266
- 🌐 [travelagentia.com](http://travelagentia.com)

---

## SECCIÓN 10 — FOOTER

<aside>
💡

**Layout**: Fondo #0A0A0A. Logo TravelAgentIA en dorado. Links en gris con hover dorado.

</aside>

### Contenido

**Columna 1 — Marca**

- Logo TravelAgentIA (dorado sobre negro)
- Tagline: "De agente a agente"
- © 2026 TravelAgentIA — Fernando Córdoba

**Columna 2 — Navegación**

- Sobre mí
- Metodología
- Servicios
- Casos reales
- FAQ
- Contacto

**Columna 3 — Legal**

- Aviso legal
- Política de privacidad
- Política de cookies

**Columna 4 — Redes sociales**

- LinkedIn (perfil Fernando Córdoba)
- Instagram (@[safetour.es](http://safetour.es) si aplica)

---

## 🔍 Estrategia SEO

### Keywords principales (target)

| **Keyword** | **Intención** | **Sección target** |
| --- | --- | --- |
| consultoría IA agencias viajes | Transaccional | Hero, Servicios, Contacto |
| inteligencia artificial agencia de viajes | Informacional | Hero, Metodología |
| automatización agencia viajes | Transaccional | Servicios, Casos reales |
| formación IA agentes viajes | Transaccional | Servicios (Comunidad) |
| implementar IA agencia viajes | Informacional | Metodología 5 Pasos |
| ChatGPT para agencias de viajes | Informacional | Metodología (Paso 1-2), FAQ |
| automatizar propuestas viajes | Transaccional | Casos reales |
| consultor IA turismo España | Transaccional | Sobre mí |
| Notion para agencias de viajes | Informacional | FAQ, Servicios |

### SEO técnico

- **Schema markup**: Organization + LocalBusiness + FAQPage + Service
- **Open Graph**: Imagen hero con logo dorado sobre negro + claim. Dimensión: 1200×630
- **Canonical**: https://travelagentia.com/
- **Sitemap**: Auto-generado
- **Velocidad**: Objetivo LCP < 2.5s. Imágenes en WebP/AVIF. Lazy loading bajo el fold
- **Mobile-first**: Diseño responsive. Cards en stack vertical en móvil
- **Alt texts en imágenes**: Descriptivos con keyword + contexto
- **Internal linking**: Cada sección enlaza a la siguiente. CTAs repartidos
- **Heading hierarchy**: Un solo H1 (hero). H2 por sección. H3 para sub-secciones

### SEO semántico — Contenido complementario (blog futuro)

Páginas/posts sugeridos para posicionar long-tail y alimentar tráfico orgánico:

1. "Los 5 Pasos de la IA en una agencia de viajes" (pilar)
2. "Cómo automatizar el seguimiento comercial en tu agencia"
3. "Propuestas de viaje con IA: de 3 horas a 20 minutos"
4. "Notion para agencias de viajes: guía completa"
5. "ChatGPT vs sistema IA especializado: qué necesita tu agencia"
6. "Caso real: cómo gestiono SAFE TOUR con 20 agentes de IA"

---

## ⚙️ Instrucciones para Antigravity

<aside>
🚀

**Framework**: Elegir entre Next.js (App Router) o Astro para rendimiento SEO.

**Hosting**: Vercel o Cloudflare Pages.

**CMS para blog futuro**: MDX o Notion API como headless CMS.

**Formulario contacto**: Integrar con Calendly (embed o redirect al link existente).

**Analytics**: Google Analytics 4 + Google Search Console.

**Cookies**: Banner RGPD con consentimiento previo (requerido por legislación española).

</aside>

### Prioridades de implementación

1. ✅ Estructura HTML semántica con todos los H1/H2/H3 indicados
2. ✅ Paleta de colores exacta (hex codes proporcionados)
3. ✅ Tipografías: Playfair Display + Inter + JetBrains Mono (Google Fonts)
4. ✅ Responsive design mobile-first
5. ✅ Animaciones scroll-reveal (librería sugerida: Framer Motion o AOS)
6. ✅ Schema markup en JSON-LD
7. ✅ Meta tags y Open Graph completos
8. ✅ Sección de contacto con integración Calendly
9. ✅ Performance: Core Web Vitals optimizados
10. ✅ Cookie banner RGPD

---

## 📋 Checklist pre-lanzamiento

- [ ]  Textos revisados y aprobados por Fernando
- [ ]  Foto profesional de Fernando para sección "Sobre mí"
- [ ]  Logo TravelAgentIA en SVG (versión dorada + versión blanca)
- [ ]  Solicitar testimonios a miembros de la comunidad
- [ ]  Formulario de contacto integrado en web enlazado con la base de datos de notion. [Inicio del espacio de equipo](https://www.notion.so/1ac662541b2b80fcbd45cb6a00bc461c?pvs=21)
- [ ]  Definir precios (si se muestran en web) o mantener modelo "solicita info" , si el precio de 60€ por sesión.
- [ ]  Configurar ~~Calendly~~ Google Calendar con disponibilidad actualizada - https://calendar.app.google/e4XRYFbL3gk7ZeMP6
- [ ]  Textos legales: aviso legal, política de privacidad, cookies
- [ ]  Configurar Google Analytics 4 + Search Console
- [ ]  Crear imagen Open Graph (1200×630) con branding dorado/negro
- [ ]  Test de velocidad con Lighthouse (objetivo: 90+ en todas las métricas)
- [ ]  Test de accesibilidad (contraste dorado sobre negro: verificar ratio WCAG AA)
- [ ]  Revisar que el contraste #C9A84C sobre #0A0A0A cumple ratio mínimo 4.5:1 para texto body (si no, usar #E8D48B para textos pequeños)