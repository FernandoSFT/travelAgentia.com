# Skill: web-extract

Navega a una URL específica en un portal autenticado y extrae datos estructurados de esa página.

## Pasos

1. **Recoge los parámetros** (si no los proporcionó al invocar la skill):
   - Clave del portal (`--site`)
   - URL completa o ruta relativa (`--url`)
   - Qué extraer exactamente (precios, disponibilidad, datos de reserva, tablas, etc.)

2. **Verifica que hay sesión activa**. Si no la hay, ejecuta login primero:
   ```
   python agent/scripts/login.py --site <KEY>
   ```

3. **Navega a la URL**:
   ```
   python agent/scripts/navigate.py --site <KEY> --url <URL>
   ```

4. **Extrae los datos** pasando el HTML por stdin:
   ```
   python agent/scripts/navigate.py --site <KEY> --url <URL> | \
     python agent/scripts/extract.py --instructions "<QUÉ EXTRAER>"
   ```

5. **Interpreta el JSON** devuelto por extract.py:
   - `text`: texto limpio de la página
   - `tables`: tablas detectadas (lista de filas como dicts)
   - `links`: enlaces relevantes

6. **Presenta los datos** al usuario en el formato más útil:
   - Si hay tablas → tabla Markdown
   - Si es texto descriptivo → resumen en viñetas
   - Si hay links relevantes → lista clicable

## Ejemplos de uso
- Extraer el detalle de una oferta concreta
- Obtener los precios de una habitación en un hotel específico
- Leer la disponibilidad de asientos en un vuelo ya encontrado
- Copiar datos de una reserva ya realizada

## Notas
- Si la página redirige al login, la sesión habrá expirado: ejecuta `/web-login` de nuevo.
- Si el HTML está truncado (mensaje `TRUNCATED`), la página es muy grande; pide al usuario que refine la URL o usa filtros en la búsqueda.
