# Skill: web-learn

Gestiona manualmente la memoria del agente: ver qué se ha aprendido, corregir errores y añadir notas sobre proveedores.

## Opciones disponibles

Pregunta al usuario qué quiere hacer:

### A) Ver el resumen de la memoria
```
python agent/scripts/memory.py --action show
```
Muestra: proveedores conocidos, reglas de routing aprendidas e historial reciente de búsquedas.

### B) Añadir o corregir una nota sobre un proveedor
Pregunta:
- ¿Qué proveedor? (clave, ej: `portal2`)
- ¿Qué nota quieres añadir?
- ¿Para qué destinos es fuerte? (opcional, lista separada por comas)
- ¿Para qué destinos es débil? (opcional, lista separada por comas)

Ejecuta:
```
python agent/scripts/memory.py --action add-note \
  --provider <KEY> \
  --note "<NOTA>" \
  --strong-for "<DESTINO1, DESTINO2>" \
  --weak-for "<DESTINO3>"
```

### C) Registrar manualmente el resultado de una búsqueda
Útil cuando el usuario sabe de antemano qué portales funcionan para un destino.

Pregunta:
- Destino
- Tipo de petición
- Resultados por proveedor (excellent / good / ok / poor / bad / not_found)

Ejecuta:
```
python agent/scripts/memory.py --action update \
  --destination "<DESTINO>" \
  --type "<TIPO>" \
  --result '{"<portal1>": "excellent", "<portal2>": "not_found"}'
```

### D) Ver el fichero de memoria en bruto
```
cat agent/memory/routing.json
```

## Notas
- Los cambios se guardan automáticamente en `agent/memory/routing.json`.
- Para persistir el aprendizaje entre máquinas, haz commit de ese fichero: `git add agent/memory/routing.json && git commit -m "chore: actualizar memoria de routing"`.
- Con ≥3 búsquedas del mismo destino, el agente genera automáticamente una regla de routing sin necesidad de usar esta skill.
