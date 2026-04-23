# Skill: web-login

Autentica a uno de los portales de búsqueda de viajes configurados en `agent/.env`.

## Pasos

1. Ejecuta `python agent/scripts/memory.py --action show` para ver los proveedores conocidos (si los hay).

2. Lee el fichero `agent/.env.example` para mostrar al usuario las claves de sitio disponibles.  
   Si existe `agent/.env`, léelo para extraer las claves reales (`SITE{N}_KEY`).

3. Pregunta al usuario qué sitio quiere autenticar (usa las claves disponibles).  
   Si el usuario ya lo especificó al invocar la skill, úsalo directamente.

4. Ejecuta:
   ```
   python agent/scripts/login.py --site <KEY>
   ```

5. Interpreta el JSON devuelto:
   - `"success": true` → informa al usuario que el login fue correcto e indica cuántas cookies se guardaron.
   - `"success": false` → muestra el mensaje de error y sugiere revisar las credenciales en `agent/.env`.

6. Si el login fue exitoso, indica que la sesión quedará activa durante la jornada de trabajo (las cookies se guardan en `/tmp/claude-session-<KEY>.json`).

## Notas
- Las credenciales deben estar en `agent/.env` (copiar de `agent/.env.example` y rellenar).
- Nunca muestres ni repitas las contraseñas al usuario.
- Si hay un error de red, sugiere verificar la URL configurada en `SITE{N}_LOGIN_URL`.
