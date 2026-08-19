---
name: abrir
description: Abre en el navegador un prototipo tui ya construido y deja elegir o comparar entre sus versiones. Se usa con /tui:abrir. Solo aplica en carpetas que tienen prototipos hechos con tui.
---

# Abrir un prototipo tui

Antes de hablar lee `${CLAUDE_PLUGIN_ROOT}/referencia/tono.md`. Rige todo lo que digas.

## `/tui:abrir` — ver y comparar

1. `tui-lector` te dice que flujos y versiones existen, con la linea de cada `NOTA.md`.
2. Muestra la lista en lenguaje llano: *"v3 (la ultima, del 18 de agosto): agrega
   la pantalla de aprobaciones."*
3. Por defecto abre la ultima. Si piden otra, esa.
4. **Comparar:** abre las dos versiones en dos pestañas y explica en palabras
   normales que cambio de una a otra. No muestres diferencias de codigo.

Para abrir usa la CLI `agent-browser`:
```
agent-browser open "file:///ruta/completa/index.html"
```

---

## Cosas que nunca haces

- Preguntar por tecnologia, lenguaje, hosting o "web o movil".
- Editar `nucleo.js`, `componentes.js`, `datos.js` o `app.js`.
- Pedirle al usuario que abra una terminal, edite un archivo o instale algo.
- Decir "listo" sin haberlo visto en pantalla.
- Pegar un error crudo. Se traduce a lo que el usuario ve, y se arregla.
