/* === APP ======================================================
   El armazon: menu lateral + la pantalla que toca mostrar.
   Viene con tui. NO se edita en los prototipos.
   ============================================================== */

function usarRuta() {
  const [ruta, setRuta] = useState(window.location.hash.slice(1));
  useEffect(() => {
    const alCambiar = () => setRuta(window.location.hash.slice(1));
    window.addEventListener('hashchange', alCambiar);
    return () => window.removeEventListener('hashchange', alCambiar);
  }, []);
  const [id, query] = ruta.split('?');
  return { id, params: Object.fromEntries(new URLSearchParams(query || '')) };
}

function App() {
  const { id, params } = usarRuta();
  const pantallas = TUI.pantallas;

  if (!pantallas.length) {
    return html`<div class="p-10 text-slate-500">No hay pantallas registradas todavia.</div>`;
  }

  const actual = pantallas.find(p => p.id === id) || pantallas[0];
  const Pantalla = actual.componente;

  return html`
    <div class="min-h-screen flex">
      <nav class="w-60 shrink-0 bg-white border-r border-slate-200 p-4 flex flex-col">
        <div class="px-2 py-3 mb-2">
          <span class="text-xs font-semibold tracking-widest text-slate-400">PROTOTIPO</span>
        </div>
        ${pantallas.map(p => html`
          <a href=${'#' + p.id}
             class="px-3 py-2 rounded-lg text-sm mb-1 transition
                    ${p.id === actual.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}">
            ${p.icono ? p.icono + '  ' : ''}${p.titulo}
          </a>`)}
        <div class="mt-auto pt-4 border-t border-slate-100">
          <button onClick=${() => { if (confirm('Esto borra lo que hayas capturado y vuelve a los datos de ejemplo. Seguro?')) db.reiniciar(); }}
            class="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-slate-600">
            Reiniciar datos de ejemplo
          </button>
        </div>
      </nav>
      <main class="flex-1 p-8 max-w-5xl"><${Pantalla} params=${params} /></main>
    </div>`;
}

preact.render(html`<${App} />`, document.getElementById('app'));
