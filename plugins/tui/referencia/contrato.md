# Contrato de construccion

Este documento se pega **completo** en el prompt de cada agente constructor.
Si dos agentes trabajan en paralelo y ambos respetan esto, sus archivos encajan
sin que nadie los revise.

---

## 1. Regla de oro: un agente, un archivo

Nunca dos agentes sobre el mismo archivo. El reparto es siempre:

| Archivo | Quien lo escribe | Se edita? |
|---|---|---|
| `index.html` | Solo el orquestador | Solo para agregar `<script src>` |
| `nucleo.js` | Nadie. Viene con tui. | **Nunca** |
| `componentes.js` | Nadie. Viene con tui. | **Nunca** |
| `datos.js` | Nadie. Viene con tui. | **Nunca** |
| `estilos.css` | Nadie, salvo pedido explicito | Casi nunca |
| `semilla.js` | Un agente | Si |
| `pantallas/<id>.js` | Un agente por pantalla | Si |
| `app.js` | Nadie. Viene con tui. | **Nunca** |

---

## 2. Como se escribe una pantalla

Archivo `pantallas/clientes.js`. Este es el esqueleto exacto:

```js
/* === PANTALLA: clientes === */

function PantallaClientes({ params }) {
  const clientes = useDatos('clientes');
  const [abierto, setAbierto] = useState(false);

  return html`
    <${Encabezado} titulo="Clientes"
      accion=${html`<${Boton} onClick=${() => setAbierto(true)}>Nuevo<//>`} />

    <${Tabla}
      columnas=${[
        { clave: 'nombre', titulo: 'Nombre' },
        { clave: 'monto',  titulo: 'Monto', render: f => TUI.dinero(f.monto) }
      ]}
      filas=${clientes}
      alTocarFila=${f => TUI.ir('detalle', { id: f.id })} />
  `;
}

TUI.registrar({ id: 'clientes', titulo: 'Clientes', icono: '👥', componente: PantallaClientes });
```

Reglas:
- El nombre de la funcion es `Pantalla` + el id en Mayuscula. Unico en todo el prototipo.
- La ultima linea **siempre** es `TUI.registrar({...})`.
- `id` en minusculas, sin espacios, sin acentos. Es lo que va en la URL.
- `params` trae lo que mando `TUI.ir('detalle', {id: 'x'})`.

---

## 3. Escribir HTML: se usa `html\`...\``, no JSX

Es JavaScript normal con plantillas. Diferencias con JSX que **hay que respetar**:

| Bien | Mal | Por que |
|---|---|---|
| `class="p-4"` | `className="p-4"` | Aqui se usa `class`, como en HTML normal |
| `<${Boton}>Guardar<//>` | `<Boton>Guardar</Boton>` | Los componentes van con `<${...}>` y cierran con `<//>` |
| `<${Campo} etiqueta="x" />` | `<Campo etiqueta="x" />` | Igual: siempre `<${...}>` |
| `${lista.map(x => html\`<li>${x}</li>\`)}` | — | Cada nivel anidado necesita su propio `html\`\`` |
| `onClick=${fn}` | `onClick="fn()"` | Las funciones van con `${}` |
| `${cond && html\`<p>si</p>\`}` | — | Asi se muestra algo condicionalmente |

Prohibido, porque el prototipo se abre con doble clic y el navegador lo bloquea:
- `import` / `export`
- `<script type="module">`
- JSX
- `fetch()` a archivos locales
- cualquier libreria que no este ya en `index.html`

---

## 4. Herramientas disponibles (ya existen, no las declares)

```js
html`...`                 // escribir la interfaz
useState, useEffect, useMemo, useRef

useDatos('coleccion')             // lista que se redibuja sola al cambiar
useDatos('coleccion', {estado:'Activo'})  // filtrada

db.listar('coleccion', filtro?)   // -> array
db.obtener('coleccion', id)       // -> objeto | undefined
db.crear('coleccion', objeto)     // -> objeto con id nuevo
db.actualizar('coleccion', id, cambios)
db.borrar('coleccion', id)
db.reiniciar()                    // vuelve a los datos de ejemplo

TUI.ir('id-pantalla', params?)    // navegar
TUI.dinero(1234.5)                // -> "$1,234.50"
TUI.fecha('2026-08-18')           // -> "18 ago 2026"
TUI.hoy()                         // -> "2026-08-18" en hora local
```

**Nunca uses `new Date().toISOString()` para la fecha de hoy.** Se corre un dia.
Usa `TUI.hoy()`.

---

## 5. Componentes disponibles (usalos, no inventes otros)

```js
<${Encabezado} titulo subtitulo? accion? />
<${Boton} onClick tono="primario|suave|peligro" tipo? disabled?>texto<//>
<${Campo} etiqueta valor alCambiar tipo? placeholder? requerido? />
<${Lista} etiqueta valor opciones=${[...]} alCambiar />
<${Tarjeta}>...<//>
<${Tabla} columnas=${[{clave,titulo,render?}]} filas alTocarFila? vacio? />
<${Etiqueta} tono="verde|amarillo|rojo|gris">texto<//>
<${Aviso} tono="info|exito|error">texto<//>
<${Vacio} mensaje accion? />
<${Modal} abierto alCerrar titulo>...<//>
```

Si hace falta algo que no esta en la lista, se arma con `<div>` y clases de
Tailwind. No se agrega a `componentes.js`.

---

## 6. Los datos de ejemplo (`semilla.js`)

```js
window.SEMILLA = {
  clientes: [ { id: 'id_c1', nombre: 'Distribuidora del Centro', monto: 12500 } ]
};
```

Reglas:
- Cada objeto lleva `id` fijo, con el prefijo `id_`.
- **Datos creibles.** Nombres, montos y fechas que el equipo reconozca como
  suyos. Nunca "prueba 1", "test", "lorem ipsum", "aaa".
- Entre 3 y 8 filas por coleccion. Suficiente para que la pantalla se vea llena,
  poco para que se lea rapido.
- Fechas en formato `'2026-08-18'`.
- Que haya variedad: distintos estados, montos altos y bajos, algun caso raro.

---

## 7. Que devuelve el agente al terminar

**La conclusion, no el archivo.** Maximo 5 lineas:

```
Archivo: pantallas/clientes.js
Pantalla registrada con id: clientes
Colecciones que usa: clientes, facturas
Componentes usados: Encabezado, Tabla, Modal, Campo, Boton
Pendiente: ninguno
```

Si algo del BRD no se pudo hacer con las piezas disponibles, se dice en
"Pendiente" en una linea. No se inventa una solucion nueva.
