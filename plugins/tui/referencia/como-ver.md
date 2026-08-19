# Como abrir y verificar un prototipo

**Nunca supongas que herramienta hay.** Comprueba primero:

```
command -v agent-browser
```

Segun el resultado, trabajas en uno de dos modos.

---

## Modo completo — si `agent-browser` existe

Puedes ver y verificar tu mismo. Usalo siempre que este disponible.

```
agent-browser open "file:///ruta/absoluta/index.html"
agent-browser eval "<js>"          # simular clics y leer estado
agent-browser snapshot -i -c       # que hay en pantalla
agent-browser console              # errores (ignora el aviso de Tailwind CDN)
agent-browser screenshot /ruta/captura.png
```

---

## Modo basico — si NO existe

**Este es el caso normal en las maquinas del equipo.** No hay Node instalado y
por lo tanto no hay `agent-browser`. Es correcto y esperado.

Para **mostrarle** el prototipo al usuario, en macOS:

```
open "/ruta/absoluta/index.html"
```

Eso lo abre en su navegador de siempre. Funciona sin instalar nada.

En este modo **no puedes verificar tu mismo**. Entonces:

1. No lances `tui-revisor`. No tiene con que trabajar.
2. Abre el prototipo con `open`.
3. Dile al usuario, en tres viñetas y en lenguaje llano, exactamente que
   deberia estar viendo. Por ejemplo:
   - Un menu a la izquierda con tres opciones: Clientes, Pedidos, Tablero.
   - En Clientes, una tabla con cuatro filas de ejemplo.
   - Un boton "Nuevo cliente" arriba a la derecha que abre una ventanita.
4. Preguntale con `AskUserQuestion` si se ve asi. Solo la sesion principal
   puede preguntar; los agentes no hablan con el usuario.

**Regla dura:** en modo basico nunca digas "esta listo" como si lo hubieras
visto. Di que lo abriste y que necesitas que te confirme lo que ve.

**Nunca le pidas al usuario que instale nada** para poder verificar. Prefieres
preguntarle antes que mandarlo a una terminal.
