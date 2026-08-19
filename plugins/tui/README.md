# tui — Tengo Una Idea

## Sección A — Para ti, que vas a usar tui

`tui` es una herramienta que corre dentro de Claude Code, en tu propia computadora. Le
cuentas tu idea de negocio en palabras normales, sin ningún término técnico, y ella hace
dos cosas por ti.

Primero te entrevista a fondo, con preguntas de opción múltiple, hasta entender bien el
problema, quién lo usa, y qué debe pasar para llamarlo un éxito. Con eso escribe un
documento de una sola idea clara: qué entra y qué queda afuera.

Después construye un prototipo real: pantallas que se abren en tu navegador, se pueden
tocar, llenar formularios y probar el flujo completo, como si la app ya existiera. No es
un dibujo ni una maqueta estática: funciona.

Todo se guarda en una carpeta en tu computadora. Puedes cerrar Claude, volver otro día, y
seguir exactamente donde quedaste, sin explicar nada de nuevo.

### Instalación

Jorge te va a pasar la dirección del repositorio de `tui`. Con esa dirección en mano,
abre Claude Code y, en el cuadro donde escribes tus mensajes, escribe este comando
(reemplazando el marcador por la dirección que te dio Jorge):

```bash
/plugin marketplace add <URL-DEL-REPO>
```

Cuando termine, en el mismo cuadro de mensajes escribe este segundo comando:

```bash
/plugin install tui@tui
```

Con eso, `tui` queda instalado y listo para usarse en cualquier proyecto nuevo.

### Cómo empezar tu primer prototipo

1. Crea una carpeta nueva y vacía en tu computadora, con el nombre de tu idea (por
   ejemplo: `control-de-pedidos`).
2. Abre Claude Code apuntando a esa carpeta.
3. Escribe `/tui:entrevista` y cuenta tu idea cuando te pregunte.

A partir de ahí, todo lo que necesitas queda dentro de esa carpeta.

### Qué esperar de cada comando

- **`/tui:entrevista`** — Te hace preguntas de opción múltiple, en varias rondas, hasta
  entender tu idea por completo. Al final te muestra un resumen y, si lo confirmas, deja
  escrito el documento de alcance de tu idea.
- **`/tui:prototipo`** — Lee ese documento y construye las pantallas. Te avisa cuando
  está listo, te dice qué puedes probar, y qué sigue. Si le pides un cambio grande, crea
  una versión nueva sin borrar la anterior.
- **`/tui:abrir`** — Abre el prototipo en tu navegador para que lo veas y lo toques. Si
  tienes más de una versión, te deja elegir cuál ver, o comparar dos lado a lado.
- **`/tui:compartir`** — Empaqueta la versión que elijas en un solo archivo que funciona
  sin internet, junto con una explicación de qué hace, para que se lo mandes a quien
  necesite verlo, incluido el equipo de Desarrollo.

### Si algo sale mal

**No pasa nada si el prototipo se ve raro o algo no responde.** Dile al agente, en
palabras normales, qué esperabas ver y qué viste en su lugar. Nunca necesitas tocar un
archivo ni abrir nada tú mismo.

- **El prototipo no abre o se ve en blanco:** dile "el prototipo no abrió" o "se ve en
  blanco" y pídele que lo revise. Él sabe cómo diagnosticarlo y arreglarlo.
- **No recuerdas en qué quedaste la última vez:** escribe `/tui:abrir` y pide que te
  resuma qué hay hecho hasta ahora.
- **Un comando no aparece cuando escribes `/tui`:** dile al agente que no ves los
  comandos de `tui` y pídele que revise si quedó bien instalado.

En cualquier caso, la respuesta es siempre la misma: cuéntaselo al agente con tus propias
palabras. Nunca tienes que abrir una terminal, editar un archivo, ni instalar nada.

---

## Sección B — Para quien mantiene el plugin

### Estructura de carpetas

```
agente-tui/
├─ .claude-plugin/marketplace.json     ← catálogo del marketplace (name, owner, plugins[])
└─ plugins/tui/
   ├─ .claude-plugin/plugin.json       ← name, version, description, author del plugin
   ├─ agents/
   │  ├─ tui-lector.md          (haiku)   — lee BRD/BITACORA/versiones y resume
   │  ├─ tui-redactor.md        (sonnet)  — redacta el BRD.md desde las respuestas
   │  ├─ tui-constructor.md     (sonnet)  — construye datos.js o una pantalla
   │  ├─ tui-revisor.md         (sonnet)  — abre el prototipo, toma captura, reporta
   │  └─ tui-empaquetador.md    (sonnet)  — arma el paquete de /tui:compartir
   ├─ skills/                          ← cada carpeta es un comando /tui:<nombre>
   │  ├─ entrevista/SKILL.md           ← método de rondas y cierre con el BRD
   │  ├─ prototipo/SKILL.md            ← orquestación, construcción y versionado
   │  ├─ abrir/SKILL.md                ← ver y comparar versiones
   │  └─ compartir/SKILL.md            ← empaquetar para mandar
   └─ referencia/                      ← material compartido, no son comandos
      ├─ tono.md                       ← cómo le habla el agente a alguien no técnico
      ├─ plantilla-BRD.md              ← formato del documento de alcance
      ├─ contrato.md                   ← contrato de construcción, se pega en cada agente
      ├─ patrones.md                   ← ejemplos: login, tabla, formulario, wizard, tablero
      └─ plantilla/                    ← index.html, estilos.css, datos.js, app.js base

**Regla importante:** el nombre de la carpeta dentro de `skills/` debe ser idéntico
al campo `name:` de su `SKILL.md`. Si no coinciden, Claude no carga el comando.
Y todo lo que no sea un comando va en `referencia/`, nunca dentro de `skills/`,
o aparecería como un comando más.
```

### Qué archivo tocar para qué cosa

| Quieres cambiar... | Edita |
|---|---|
| Las preguntas o el orden de la entrevista | `skills/entrevista/SKILL.md` |
| El formato del documento de alcance (BRD) | `referencia/plantilla-BRD.md` |
| Cómo se arma o versiona el prototipo | `skills/prototipo/SKILL.md` |
| Cómo se abre o se comparte una versión | `skills/abrir/SKILL.md`, `skills/compartir/SKILL.md` |
| El esqueleto base de todo prototipo nuevo | `referencia/plantilla/` |
| Las reglas que siguen los agentes constructores | `referencia/contrato.md` |
| Ejemplos de pantallas típicas (tabla, formulario, etc.) | `referencia/patrones.md` |
| Cómo le habla el agente al usuario | `referencia/tono.md` |
| El comportamiento de un agente específico | `agents/<nombre-del-agente>.md` |
| Nombre, versión o descripción del plugin | `plugins/tui/.claude-plugin/plugin.json` |
| Cómo aparece el plugin en el catálogo | `.claude-plugin/marketplace.json` |

Si agregas o cambias un patrón de construcción (una pieza de pantalla nueva, una regla
del contrato), revisa `contrato.md` y `patrones.md` juntos: deben decir lo mismo, porque
ambos se le pegan a los agentes constructores.

### Cómo probar un cambio antes de publicarlo

1. Haz el cambio en tu copia local de `agente-tui`.
2. Instala esa copia local apuntando a la carpeta del repo en tu disco, en vez de a la
   URL remota:
   ```bash
   /plugin marketplace add /ruta/local/a/agente-tui
   ```
   ```bash
   /plugin install tui@tui
   ```
3. Crea una carpeta de prueba nueva, abre Claude ahí, y corre el flujo completo:
   `/tui:entrevista` → `/tui:prototipo` → `/tui:abrir` → `/tui:compartir`.
4. Verifica en particular lo que tocaste: si cambiaste `contrato.md`, corre
   `/tui:prototipo` con un BRD de varias pantallas y confirma que los agentes salieron en
   paralelo y que el prototipo abre sin errores en la consola del navegador.
5. Si cambiaste `tono.md`, relee las respuestas del agente durante la entrevista y
   confirma que no se coló ninguna palabra de la tabla prohibida.

### Cómo publicar una mejora para que le llegue a todo el equipo

1. Confirma que el cambio pasó las pruebas del punto anterior.
2. Si corresponde, sube el número de `version` en
   `plugins/tui/.claude-plugin/plugin.json` (semver: parche para arreglos chicos, minor
   para funcionalidad nueva).
3. Haz commit y push a la rama principal del repositorio remoto de `agente-tui`.
4. Avisa al equipo que abran el gestor de plugins y actualicen `tui` desde ahí:
   ```bash
   /plugin
   ```
   Ese comando abre un panel con la lista de plugins instalados y la opción de
   actualizar. Con eso cada persona del piloto recibe la versión nueva.

   Si a alguien no le aparece la actualización, que vuelva a correr los dos
   comandos de instalación de la Sección A: es seguro repetirlos.
