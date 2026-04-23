# Skill: web-search

Busca disponibilidad o información en portales de viajes autenticados, usando memoria para priorizar los mejores proveedores.

## Pasos

1. **Recoge la petición del usuario** (si no la proporcionó al invocar la skill):
   - Destino (ciudad, país o región)
   - Tipo de búsqueda (vuelo, hotel, paquete vuelo+hotel, crucero, etc.)
   - Fechas si las conoce
   - Cualquier detalle adicional (nº pasajeros, clase, etc.)

2. **Consulta la memoria de routing**:
   ```
   python agent/scripts/memory.py --action recommend --destination "<DESTINO>" --type "<TIPO>"
   ```
   Interpreta el JSON devuelto:
   - `priority`: portales a usar primero
   - `neutral`: portales sin preferencia (úsalos si hay tiempo)
   - `skip`: portales que históricamente no dan resultados para este destino/tipo (omitirlos salvo que el usuario insista)
   - `reason`: explícaselo brevemente al usuario

3. **Autentica los portales necesarios** (solo si no hay sesión activa):
   ```
   python agent/scripts/login.py --site <KEY>
   ```
   Empieza por los de `priority`, luego `neutral`. Omite los de `skip`.

4. **Busca en cada portal** (empieza por el de mayor prioridad):
   ```
   python agent/scripts/search.py --site <KEY> --url <URL_BUSQUEDA> --query "<QUERY>" --method get
   ```
   Pasa el HTML resultante a extract.py:
   ```
   python agent/scripts/extract.py --instructions "extrae los primeros resultados con precios, fechas y disponibilidad"
   ```
   Puedes encadenar ambos con una pipe:
   ```
   python agent/scripts/search.py --site <KEY> --url <URL> --query "<QUERY>" | python agent/scripts/extract.py --instructions "extrae resultados con precio"
   ```

5. **Presenta los resultados** de forma clara: tabla Markdown con columnas relevantes (proveedor, precio, fechas, descripción breve).

6. **Actualiza la memoria** con lo aprendido:
   ```
   python agent/scripts/memory.py --action update \
     --destination "<DESTINO>" \
     --type "<TIPO>" \
     --result '{"<portal1>": "excellent", "<portal2>": "good", "<portal3>": "not_found"}'
   ```
   Valores de calidad: `excellent`, `good`, `ok`, `poor`, `bad`, `not_found`.

7. Informa al usuario de qué proveedor dio mejores resultados y que la memoria ha sido actualizada.

## Notas
- Si un portal tarda más de 30 s o falla, marca su resultado como `"bad"` en la memoria y continúa con el siguiente.
- Si ningún portal tiene resultados, díselo claramente y sugiere al usuario usar `/web-learn` para anotar observaciones.
- La URL de búsqueda de cada portal debe consultarse con el usuario la primera vez; luego se puede guardar como nota en la memoria via `/web-learn`.
