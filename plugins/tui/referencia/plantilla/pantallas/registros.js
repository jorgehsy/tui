/* === PANTALLA: registros ======================================
   Ejemplo de referencia. Muestra el patron completo:
   leer datos, listarlos en tabla, y crear uno nuevo.
   ============================================================== */

function PantallaRegistros() {
  const registros = useDatos('registros');
  const [abierto, setAbierto] = useState(false);
  const [borrador, setBorrador] = useState({ nombre: '', contacto: '', monto: '', estado: 'Pendiente' });

  const guardar = () => {
    if (!borrador.nombre.trim()) return;
    db.crear('registros', {
      nombre: borrador.nombre,
      contacto: borrador.contacto,
      monto: Number(borrador.monto) || 0,
      estado: borrador.estado,
      fecha: TUI.hoy()
    });
    setBorrador({ nombre: '', contacto: '', monto: '', estado: 'Pendiente' });
    setAbierto(false);
  };

  const columnas = [
    { clave: 'nombre',   titulo: 'Cliente' },
    { clave: 'contacto', titulo: 'Contacto' },
    { clave: 'monto',    titulo: 'Monto',  render: f => TUI.dinero(f.monto) },
    { clave: 'fecha',    titulo: 'Fecha',  render: f => TUI.fecha(f.fecha) },
    { clave: 'estado',   titulo: 'Estado',
      render: f => html`<${Etiqueta} tono=${f.estado === 'Activo' ? 'verde' : 'amarillo'}>${f.estado}<//>` },
    { clave: 'acciones', titulo: '',
      render: f => html`<button onClick=${e => { e.stopPropagation(); db.borrar('registros', f.id); }}
                          class="text-slate-300 hover:text-red-600">borrar</button>` }
  ];

  return html`
    <${Encabezado} titulo="Registros"
      subtitulo=${registros.length + ' en total'}
      accion=${html`<${Boton} onClick=${() => setAbierto(true)}>Nuevo registro<//>`} />

    <${Tabla} columnas=${columnas} filas=${registros}
      vacio="Todavia no hay registros. Crea el primero." />

    <${Modal} abierto=${abierto} alCerrar=${() => setAbierto(false)} titulo="Nuevo registro">
      <${Campo} etiqueta="Cliente"  requerido valor=${borrador.nombre}
        alCambiar=${v => setBorrador({ ...borrador, nombre: v })} />
      <${Campo} etiqueta="Contacto" valor=${borrador.contacto}
        alCambiar=${v => setBorrador({ ...borrador, contacto: v })} />
      <${Campo} etiqueta="Monto" tipo="number" valor=${borrador.monto}
        alCambiar=${v => setBorrador({ ...borrador, monto: v })} />
      <${Lista} etiqueta="Estado" valor=${borrador.estado} opciones=${['Pendiente', 'Activo']}
        alCambiar=${v => setBorrador({ ...borrador, estado: v })} />
      <div class="flex gap-2 justify-end mt-2">
        <${Boton} tono="suave" onClick=${() => setAbierto(false)}>Cancelar<//>
        <${Boton} onClick=${guardar}>Guardar<//>
      </div>
    <//>`;
}

TUI.registrar({ id: 'registros', titulo: 'Registros', icono: '📋', componente: PantallaRegistros });
