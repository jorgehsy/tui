/* === NUCLEO ===================================================
   Esto viene con tui. NO se edita nunca, en ningun prototipo.
   Define las herramientas que usan todos los demas archivos.
   ============================================================== */

// html`...` es como se escribe la pantalla. Se usa igual que HTML normal.
window.html = htm.bind(preact.h);

// Memoria de una pantalla (lo que cambia cuando el usuario hace algo).
window.useState  = preactHooks.useState;
window.useEffect = preactHooks.useEffect;
window.useMemo   = preactHooks.useMemo;
window.useRef    = preactHooks.useRef;

// Registro de pantallas. Cada archivo de pantallas/ se anota aqui.
window.TUI = {
  pantallas: [],

  // TUI.registrar({ id, titulo, icono, componente })
  registrar(pantalla) {
    if (!pantalla || !pantalla.id || !pantalla.componente) {
      console.error('[tui] Pantalla mal registrada:', pantalla);
      return;
    }
    const yaEstaba = TUI.pantallas.findIndex(p => p.id === pantalla.id);
    if (yaEstaba >= 0) TUI.pantallas[yaEstaba] = pantalla;
    else TUI.pantallas.push(pantalla);
  },

  // Cambia de pantalla desde cualquier boton: TUI.ir('clientes')
  ir(id, params) {
    window.location.hash = params
      ? id + '?' + new URLSearchParams(params).toString()
      : id;
  },

  // Fecha de hoy en formato '2026-08-18', en la hora LOCAL del usuario.
  // Usa esto y nunca new Date().toISOString(): eso se corre un dia.
  hoy() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  },

  // Formatea dinero para mostrar. TUI.dinero(1234.5) -> "$1,234.50"
  dinero(n) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
      .format(Number(n) || 0);
  },

  // Formatea fecha ISO para mostrar. TUI.fecha('2026-08-18') -> "18 ago 2026"
  fecha(iso) {
    if (!iso) return '';
    // Se lee como fecha local, no UTC. Sin esto el dia se corre uno hacia atras.
    const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(iso + 'T00:00:00') : new Date(iso);
    if (isNaN(d)) return String(iso);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  }
};
