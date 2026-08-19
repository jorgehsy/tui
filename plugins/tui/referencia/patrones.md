# Patrones de pantalla

Recetario de copiar y pegar. Cada patron es un archivo `pantallas/<id>.js`
completo, listo para adaptar: cambia nombres de coleccion, campos e id.
Todos respetan el contrato: `html\`...\``, `class`, `<${Componente}>...<//>`,
`TUI.hoy()`, componentes solo de la lista oficial.

---

## 1. Lista + buscador + filtro por estado

Usalo cuando la coleccion tiene muchas filas y hace falta encontrar una rapido.

```js
/* === PANTALLA: clientes === */

function PantallaClientes() {
  const clientes = useDatos('clientes');
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('Todos');

  const filtrados = useMemo(() => {
    return clientes.filter(c => {
      const coincideTexto = c.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideEstado = estado === 'Todos' || c.estado === estado;
      return coincideTexto && coincideEstado;
    });
  }, [clientes, busqueda, estado]);

  const columnas = [
    { clave: 'nombre', titulo: 'Nombre' },
    { clave: 'monto',  titulo: 'Monto', render: f => TUI.dinero(f.monto) },
    { clave: 'estado', titulo: 'Estado',
      render: f => html`<${Etiqueta} tono=${f.estado === 'Activo' ? 'verde' : 'gris'}>${f.estado}<//>` }
  ];

  return html`
    <${Encabezado} titulo="Clientes" subtitulo=${filtrados.length + ' de ' + clientes.length} />

    <div class="flex gap-3 mb-4">
      <div class="flex-1">
        <${Campo} etiqueta="Buscar" placeholder="Nombre..." valor=${busqueda} alCambiar=${setBusqueda} />
      </div>
      <div class="w-48">
        <${Lista} etiqueta="Estado" valor=${estado} opciones=${['Todos', 'Activo', 'Pendiente']} alCambiar=${setEstado} />
      </div>
    </div>

    <${Tabla} columnas=${columnas} filas=${filtrados}
      alTocarFila=${f => TUI.ir('detalle-cliente', { id: f.id })}
      vacio="Nada coincide con la busqueda." />
  `;
}

TUI.registrar({ id: 'clientes', titulo: 'Clientes', icono: '🔎', componente: PantallaClientes });
```

---

## 2. Formulario de alta en Modal

Usalo cuando el usuario debe crear un registro sin salir de la pantalla de lista.
Ya esta resuelto completo en `plantilla/pantallas/registros.js`; copia ese
archivo entero y cambia coleccion y campos. Piezas clave:

- Estado del modal: `const [abierto, setAbierto] = useState(false)`.
- Borrador con un campo por dato: `const [borrador, setBorrador] = useState({ nombre: '', ... })`.
- `guardar()` valida lo minimo (`if (!borrador.nombre.trim()) return;`), llama
  `db.crear('coleccion', { ...datos, fecha: TUI.hoy() })`, limpia el borrador
  y cierra el modal.
- El boton "Nuevo" del `Encabezado` hace `onClick=${() => setAbierto(true)}`.
- Dentro del `<${Modal}>` van los `<${Campo}>`/`<${Lista}>` y al final una fila
  con `<${Boton} tono="suave">Cancelar<//>` y `<${Boton}>Guardar<//>`.

---

## 3. Pantalla de detalle

Usalo cuando al tocar una fila hay que mostrar un registro completo aparte.

```js
/* === PANTALLA: detalle-cliente === */

function PantallaDetalleCliente({ params }) {
  const cliente = db.obtener('clientes', params.id);

  if (!cliente) {
    return html`
      <${Encabezado} titulo="Cliente no encontrado" />
      <${Boton} tono="suave" onClick=${() => TUI.ir('clientes')}>Volver<//>
    `;
  }

  return html`
    <${Encabezado} titulo=${cliente.nombre} subtitulo=${'Cliente desde ' + TUI.fecha(cliente.fecha)}
      accion=${html`<${Boton} tono="suave" onClick=${() => TUI.ir('clientes')}>Volver<//>`} />

    <${Tarjeta}>
      <p class="text-sm text-slate-500 mb-1">Monto</p>
      <p class="text-2xl font-semibold text-slate-900 mb-4">${TUI.dinero(cliente.monto)}</p>
      <p class="text-sm text-slate-500 mb-1">Estado</p>
      <${Etiqueta} tono=${cliente.estado === 'Activo' ? 'verde' : 'gris'}>${cliente.estado}<//>
    <//>
  `;
}

TUI.registrar({ id: 'detalle-cliente', titulo: 'Detalle cliente', icono: '📄', componente: PantallaDetalleCliente });
```

---

## 4. Maestro-detalle en la misma pantalla

Usalo cuando conviene ver la lista y el detalle sin cambiar de pantalla.

```js
/* === PANTALLA: pedidos === */

function PantallaPedidos() {
  const pedidos = useDatos('pedidos');
  const [seleccionado, setSeleccionado] = useState(null);
  const activo = pedidos.find(p => p.id === seleccionado) || pedidos[0];

  return html`
    <${Encabezado} titulo="Pedidos" />
    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-1">
        <${Tabla}
          columnas=${[
            { clave: 'nombre', titulo: 'Pedido' },
            { clave: 'estado', titulo: 'Estado',
              render: f => html`<${Etiqueta} tono=${f.estado === 'Activo' ? 'verde' : 'gris'}>${f.estado}<//>` }
          ]}
          filas=${pedidos}
          alTocarFila=${f => setSeleccionado(f.id)} />
      </div>
      <div class="col-span-2">
        ${activo ? html`
          <${Tarjeta}>
            <h2 class="text-lg font-semibold mb-2">${activo.nombre}</h2>
            <p class="text-sm text-slate-500 mb-1">Monto</p>
            <p class="text-xl font-semibold mb-4">${TUI.dinero(activo.monto)}</p>
            <p class="text-sm text-slate-500 mb-1">Fecha</p>
            <p class="text-sm text-slate-700">${TUI.fecha(activo.fecha)}</p>
          <//>
        ` : html`<${Vacio} mensaje="Selecciona un pedido de la lista." />`}
      </div>
    </div>
  `;
}

TUI.registrar({ id: 'pedidos', titulo: 'Pedidos', icono: '📦', componente: PantallaPedidos });
```

---

## 5. Wizard de varios pasos

Usalo para una alta larga que conviene partir en pasos, con barra de progreso
y sin dejar avanzar hasta llenar el paso actual.

```js
/* === PANTALLA: nuevo-proyecto === */

function PantallaNuevoProyecto() {
  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState({ nombre: '', responsable: '', presupuesto: '' });

  const puedeAvanzar = () => {
    if (paso === 1) return datos.nombre.trim().length > 0;
    if (paso === 2) return datos.responsable.trim().length > 0;
    return true;
  };

  const finalizar = () => {
    db.crear('proyectos', {
      nombre: datos.nombre,
      responsable: datos.responsable,
      presupuesto: Number(datos.presupuesto) || 0,
      estado: 'Pendiente',
      fecha: TUI.hoy()
    });
    TUI.ir('proyectos');
  };

  return html`
    <${Encabezado} titulo="Nuevo proyecto" subtitulo=${'Paso ' + paso + ' de 3'} />

    <div class="h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
      <div class="h-full bg-slate-900 transition-all" style=${{ width: (paso / 3 * 100) + '%' }}></div>
    </div>

    <${Tarjeta}>
      ${paso === 1 && html`
        <${Campo} etiqueta="Nombre del proyecto" requerido valor=${datos.nombre}
          alCambiar=${v => setDatos({ ...datos, nombre: v })} />
      `}
      ${paso === 2 && html`
        <${Campo} etiqueta="Responsable" requerido valor=${datos.responsable}
          alCambiar=${v => setDatos({ ...datos, responsable: v })} />
      `}
      ${paso === 3 && html`
        <${Campo} etiqueta="Presupuesto" tipo="number" valor=${datos.presupuesto}
          alCambiar=${v => setDatos({ ...datos, presupuesto: v })} />
      `}

      <div class="flex gap-2 justify-end mt-4">
        ${paso > 1 && html`<${Boton} tono="suave" onClick=${() => setPaso(paso - 1)}>Atras<//>`}
        ${paso < 3
          ? html`<${Boton} disabled=${!puedeAvanzar()} onClick=${() => setPaso(paso + 1)}>Siguiente<//>`
          : html`<${Boton} disabled=${!puedeAvanzar()} onClick=${finalizar}>Finalizar<//>`}
      </div>
    <//>
  `;
}

TUI.registrar({ id: 'nuevo-proyecto', titulo: 'Nuevo proyecto', icono: '🧭', componente: PantallaNuevoProyecto });
```

---

## 6. Tablero simple con KPIs

Usalo para una pantalla de inicio con numeros grandes calculados de los datos.

```js
/* === PANTALLA: tablero === */

function PantallaTablero() {
  const facturas = useDatos('facturas');

  const total = useMemo(() => facturas.reduce((s, f) => s + f.monto, 0), [facturas]);
  const pagadas = useMemo(() => facturas.filter(f => f.estado === 'Pagada'), [facturas]);
  const pendientes = useMemo(() => facturas.filter(f => f.estado === 'Pendiente'), [facturas]);

  return html`
    <${Encabezado} titulo="Tablero" />

    <div class="grid grid-cols-3 gap-4 mb-6">
      <${Tarjeta}>
        <p class="text-sm text-slate-500 mb-1">Total facturado</p>
        <p class="text-3xl font-semibold text-slate-900">${TUI.dinero(total)}</p>
      <//>
      <${Tarjeta}>
        <p class="text-sm text-slate-500 mb-1">Pagadas</p>
        <p class="text-3xl font-semibold text-emerald-600">${pagadas.length}</p>
      <//>
      <${Tarjeta}>
        <p class="text-sm text-slate-500 mb-1">Pendientes</p>
        <p class="text-3xl font-semibold text-amber-600">${pendientes.length}</p>
      <//>
    </div>

    <${Tabla}
      columnas=${[
        { clave: 'nombre', titulo: 'Cliente' },
        { clave: 'monto', titulo: 'Monto', render: f => TUI.dinero(f.monto) },
        { clave: 'estado', titulo: 'Estado',
          render: f => html`<${Etiqueta} tono=${f.estado === 'Pagada' ? 'verde' : 'amarillo'}>${f.estado}<//>` }
      ]}
      filas=${facturas} />
  `;
}

TUI.registrar({ id: 'tablero', titulo: 'Tablero', icono: '📊', componente: PantallaTablero });
```

---

## 7. Estado vacio con accion

Usalo cuando la coleccion puede estar vacia y hay que invitar a crear el primer registro.

```js
/* === PANTALLA: proveedores === */

function PantallaProveedores() {
  const proveedores = useDatos('proveedores');
  const [abierto, setAbierto] = useState(false);
  const [borrador, setBorrador] = useState({ nombre: '' });

  const guardar = () => {
    if (!borrador.nombre.trim()) return;
    db.crear('proveedores', { nombre: borrador.nombre, fecha: TUI.hoy() });
    setBorrador({ nombre: '' });
    setAbierto(false);
  };

  return html`
    <${Encabezado} titulo="Proveedores" />

    ${proveedores.length === 0
      ? html`
        <${Vacio} mensaje="Todavia no hay proveedores registrados."
          accion=${html`<${Boton} onClick=${() => setAbierto(true)}>Agregar proveedor<//>`} />
      `
      : html`
        <${Tabla} columnas=${[{ clave: 'nombre', titulo: 'Nombre' }]} filas=${proveedores}
          alTocarFila=${null} />
      `}

    <${Modal} abierto=${abierto} alCerrar=${() => setAbierto(false)} titulo="Nuevo proveedor">
      <${Campo} etiqueta="Nombre" requerido valor=${borrador.nombre}
        alCambiar=${v => setBorrador({ ...borrador, nombre: v })} />
      <div class="flex gap-2 justify-end mt-2">
        <${Boton} tono="suave" onClick=${() => setAbierto(false)}>Cancelar<//>
        <${Boton} onClick=${guardar}>Guardar<//>
      </div>
    <//>
  `;
}

TUI.registrar({ id: 'proveedores', titulo: 'Proveedores', icono: '🏷️', componente: PantallaProveedores });
```

---

## 8. Confirmacion antes de borrar

Usalo cuando borrar es una accion seria y no debe pasar con un solo clic.

```js
/* === PANTALLA: contratos === */

function PantallaContratos() {
  const contratos = useDatos('contratos');
  const [porBorrar, setPorBorrar] = useState(null);

  const confirmarBorrado = () => {
    db.borrar('contratos', porBorrar.id);
    setPorBorrar(null);
  };

  const columnas = [
    { clave: 'nombre', titulo: 'Contrato' },
    { clave: 'monto',  titulo: 'Monto', render: f => TUI.dinero(f.monto) },
    { clave: 'acciones', titulo: '',
      render: f => html`
        <button onClick=${e => { e.stopPropagation(); setPorBorrar(f); }}
          class="text-slate-300 hover:text-red-600">borrar</button>` }
  ];

  return html`
    <${Encabezado} titulo="Contratos" />
    <${Tabla} columnas=${columnas} filas=${contratos} />

    <${Modal} abierto=${!!porBorrar} alCerrar=${() => setPorBorrar(null)} titulo="Confirmar borrado">
      <p class="text-sm text-slate-600 mb-4">
        Se va a borrar "${porBorrar?.nombre}". Esta accion no se puede deshacer.
      </p>
      <div class="flex gap-2 justify-end">
        <${Boton} tono="suave" onClick=${() => setPorBorrar(null)}>Cancelar<//>
        <${Boton} tono="peligro" onClick=${confirmarBorrado}>Borrar<//>
      </div>
    <//>
  `;
}

TUI.registrar({ id: 'contratos', titulo: 'Contratos', icono: '📑', componente: PantallaContratos });
```

---

## 9. Login falso (solo demo)

Usalo cuando el prototipo necesita simular "quien soy" sin backend real:
se elige un usuario de una lista y se guarda en `localStorage`.

```js
/* === PANTALLA: iniciar-sesion === */

function PantallaIniciarSesion() {
  const usuarios = useDatos('usuarios');
  const [nombreElegido, setNombreElegido] = useState(usuarios[0]?.nombre || '');

  const entrar = () => {
    const usuario = usuarios.find(u => u.nombre === nombreElegido);
    if (!usuario) return;
    localStorage.setItem('sesion', JSON.stringify({ id: usuario.id, nombre: usuario.nombre }));
    TUI.ir('inicio');
  };

  return html`
    <${Encabezado} titulo="Iniciar sesion" subtitulo="Elige con que usuario entrar" />

    <${Tarjeta} class="max-w-sm">
      <${Lista} etiqueta="Usuario" valor=${nombreElegido}
        opciones=${usuarios.map(u => u.nombre)}
        alCambiar=${setNombreElegido} />
      <${Boton} onClick=${entrar}>Entrar<//>
    <//>
  `;
}

TUI.registrar({ id: 'iniciar-sesion', titulo: 'Iniciar sesion', icono: '🔑', componente: PantallaIniciarSesion });
```

Para leer quien esta logueado desde cualquier otra pantalla:

```js
const sesion = JSON.parse(localStorage.getItem('sesion') || 'null');
```
