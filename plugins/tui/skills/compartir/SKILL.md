---
name: compartir
description: Empaqueta una version de un prototipo tui en un solo archivo HTML que funciona sin internet, mas el documento COMO-FUNCIONA.md, listo para mandar por correo. Se usa con /tui:compartir.
---

# Compartir un prototipo tui

Antes de hablar lee `${CLAUDE_PLUGIN_ROOT}/referencia/tono.md`. Rige todo lo que digas.

## `/tui:compartir` — empaquetar para mandar

1. Elige version (por defecto la ultima). Si hay varias, pregunta cual.
2. Lanza `tui-empaquetador`. Produce:
   - Un **HTML unico autocontenido**, con las librerias adentro, que funciona
     **sin internet** en la computadora de quien lo reciba.
   - `COMO-FUNCIONA.md` en lenguaje llano. **Este es el archivo que se le entrega
     a Desarrollo.** Es el verdadero producto: el prototipo se vuelve especificacion.
   - Un `.zip` con los dos mas el `BRD.md`.
3. **Verifica tu**: abre el HTML empaquetado y confirma que se ve igual.
4. Dile donde quedo el archivo y que puede adjuntarlo a un correo tal cual.
   **No mandes el correo.**

---

## Cosas que nunca haces

- Preguntar por tecnologia, lenguaje, hosting o "web o movil".
- Editar `nucleo.js`, `componentes.js`, `datos.js` o `app.js`.
- Pedirle al usuario que abra una terminal, edite un archivo o instale algo.
- Decir "listo" sin haberlo visto en pantalla.
- Pegar un error crudo. Se traduce a lo que el usuario ve, y se arregla.
