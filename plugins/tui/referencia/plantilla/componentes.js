/* === COMPONENTES ==============================================
   Piezas visuales reutilizables. Viene con tui.
   Las pantallas SIEMPRE usan estas piezas; no inventan otras.
   ============================================================== */

// <${Encabezado} titulo="Clientes" accion=${...} />
window.Encabezado = ({ titulo, subtitulo, accion }) => html`
  <div class="flex items-start justify-between gap-4 mb-6">
    <div>
      <h1 class="text-2xl font-semibold text-slate-900">${titulo}</h1>
      ${subtitulo && html`<p class="text-sm text-slate-500 mt-1">${subtitulo}</p>`}
    </div>
    ${accion}
  </div>
`;

// <${Boton} onClick=${fn} tono="primario|suave|peligro">Guardar<//>
window.Boton = ({ onClick, tono = 'primario', tipo = 'button', children, disabled }) => {
  const tonos = {
    primario: 'bg-slate-900 text-white hover:bg-slate-700',
    suave:    'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
    peligro:  'bg-red-600 text-white hover:bg-red-700'
  };
  return html`
    <button type=${tipo} onClick=${onClick} disabled=${disabled}
      class="px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-40 ${tonos[tono]}">
      ${children}
    </button>`;
};

// <${Campo} etiqueta="Nombre" valor=${v} alCambiar=${fn} />
window.Campo = ({ etiqueta, valor, alCambiar, tipo = 'text', placeholder, requerido }) => html`
  <label class="block mb-4">
    <span class="block text-sm font-medium text-slate-700 mb-1">
      ${etiqueta}${requerido && html`<span class="text-red-500"> *</span>`}
    </span>
    <input type=${tipo} value=${valor ?? ''} placeholder=${placeholder}
      onInput=${e => alCambiar(e.target.value)}
      class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm
             focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400" />
  </label>
`;

// <${Lista} etiqueta="Estado" valor=${v} opciones=${['a','b']} alCambiar=${fn} />
window.Lista = ({ etiqueta, valor, opciones = [], alCambiar }) => html`
  <label class="block mb-4">
    <span class="block text-sm font-medium text-slate-700 mb-1">${etiqueta}</span>
    <select value=${valor} onChange=${e => alCambiar(e.target.value)}
      class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
      ${opciones.map(o => html`<option value=${o}>${o}</option>`)}
    </select>
  </label>
`;

// <${Tarjeta}>...<//>
window.Tarjeta = ({ children, class: cls = '' }) => html`
  <div class="bg-white rounded-xl border border-slate-200 p-5 ${cls}">${children}</div>
`;

// <${Tabla} columnas=${[{clave,titulo,render?}]} filas=${[]} alTocarFila=${fn} />
window.Tabla = ({ columnas = [], filas = [], alTocarFila, vacio = 'Todavia no hay nada aqui.' }) => {
  if (!filas.length) return html`<${Vacio} mensaje=${vacio} />`;
  return html`
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>${columnas.map(c => html`
            <th class="text-left font-medium text-slate-500 px-4 py-3">${c.titulo}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${filas.map(f => html`
            <tr onClick=${() => alTocarFila && alTocarFila(f)}
                class="border-b border-slate-100 last:border-0 ${alTocarFila ? 'cursor-pointer hover:bg-slate-50' : ''}">
              ${columnas.map(c => html`
                <td class="px-4 py-3 text-slate-700">${c.render ? c.render(f) : f[c.clave]}</td>`)}
            </tr>`)}
        </tbody>
      </table>
    </div>`;
};

// <${Etiqueta} tono="verde|amarillo|rojo|gris">Pagado<//>
window.Etiqueta = ({ tono = 'gris', children }) => {
  const tonos = {
    verde:    'bg-emerald-50 text-emerald-700 border-emerald-200',
    amarillo: 'bg-amber-50 text-amber-700 border-amber-200',
    rojo:     'bg-red-50 text-red-700 border-red-200',
    gris:     'bg-slate-100 text-slate-600 border-slate-200'
  };
  return html`<span class="inline-block px-2 py-0.5 rounded-md text-xs font-medium border ${tonos[tono]}">${children}</span>`;
};

// <${Aviso} tono="info|exito|error">Mensaje<//>
window.Aviso = ({ tono = 'info', children }) => {
  const tonos = {
    info:  'bg-sky-50 text-sky-800 border-sky-200',
    exito: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    error: 'bg-red-50 text-red-800 border-red-200'
  };
  return html`<div class="px-4 py-3 rounded-lg border text-sm mb-4 ${tonos[tono]}">${children}</div>`;
};

// <${Vacio} mensaje="..." />
window.Vacio = ({ mensaje = 'Todavia no hay nada aqui.', accion }) => html`
  <div class="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
    <p class="text-slate-400 text-sm mb-3">${mensaje}</p>
    ${accion}
  </div>
`;

// <${Modal} abierto=${b} alCerrar=${fn} titulo="...">...<//>
window.Modal = ({ abierto, alCerrar, titulo, children }) => {
  if (!abierto) return null;
  return html`
    <div class="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50" onClick=${alCerrar}>
      <div class="bg-white rounded-xl max-w-lg w-full p-6 max-h-[85vh] overflow-auto"
           onClick=${e => e.stopPropagation()}>
        <h2 class="text-lg font-semibold mb-4">${titulo}</h2>
        ${children}
      </div>
    </div>`;
};
