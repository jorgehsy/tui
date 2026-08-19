/* === DATOS (motor) ============================================
   Viene con tui. NO se edita en los prototipos.
   Guarda todo en el navegador (localStorage), asi el prototipo
   recuerda lo que el usuario hizo aunque recargue la pagina.

   FASE 2: el dia que exista una base de datos real, se cambia
   SOLO el cuerpo de estas funciones por llamadas fetch().
   Ninguna pantalla se toca.
   ============================================================== */

(function () {
  const PREFIJO = 'tui:';
  const oyentes = [];
  let sembrado = false;

  function sembrar() {
    if (sembrado) return;
    sembrado = true;
    const semilla = window.SEMILLA || {};
    Object.keys(semilla).forEach(col => {
      if (localStorage.getItem(PREFIJO + col) === null) {
        localStorage.setItem(PREFIJO + col, JSON.stringify(semilla[col]));
      }
    });
  }

  function leer(col) {
    sembrar();
    try { return JSON.parse(localStorage.getItem(PREFIJO + col)) || []; }
    catch (e) { return []; }
  }

  function escribir(col, filas) {
    localStorage.setItem(PREFIJO + col, JSON.stringify(filas));
    oyentes.forEach(fn => fn(col));
  }

  function nuevoId() {
    return 'id_' + Math.random().toString(36).slice(2, 9);
  }

  window.db = {
    // db.listar('clientes')                  -> todos
    // db.listar('clientes', {estado:'activo'}) -> solo los que calzan
    listar(col, filtro) {
      const filas = leer(col);
      if (!filtro) return filas;
      return filas.filter(f =>
        Object.keys(filtro).every(k => String(f[k]) === String(filtro[k])));
    },

    // db.obtener('clientes', 'id_abc') -> un objeto o undefined
    obtener(col, id) {
      return leer(col).find(f => f.id === id);
    },

    // db.crear('clientes', {nombre:'Ana'}) -> el objeto con su id
    crear(col, objeto) {
      const filas = leer(col);
      const nuevo = Object.assign({ id: nuevoId() }, objeto);
      filas.push(nuevo);
      escribir(col, filas);
      return nuevo;
    },

    // db.actualizar('clientes', 'id_abc', {nombre:'Ana Maria'})
    actualizar(col, id, cambios) {
      const filas = leer(col);
      const i = filas.findIndex(f => f.id === id);
      if (i < 0) return null;
      filas[i] = Object.assign({}, filas[i], cambios);
      escribir(col, filas);
      return filas[i];
    },

    // db.borrar('clientes', 'id_abc')
    borrar(col, id) {
      escribir(col, leer(col).filter(f => f.id !== id));
      return true;
    },

    // Vuelve todo a los datos de ejemplo originales.
    reiniciar() {
      Object.keys(localStorage)
        .filter(k => k.indexOf(PREFIJO) === 0)
        .forEach(k => localStorage.removeItem(k));
      sembrado = false;
      sembrar();
      oyentes.forEach(fn => fn('*'));
    },

    // Uso interno de useDatos.
    suscribir(fn) {
      oyentes.push(fn);
      return () => {
        const i = oyentes.indexOf(fn);
        if (i >= 0) oyentes.splice(i, 1);
      };
    }
  };

  // Asi lee datos una pantalla. Se vuelve a dibujar sola cuando algo cambia.
  //   const clientes = useDatos('clientes');
  window.useDatos = function (col, filtro) {
    const [, refrescar] = useState(0);
    useEffect(() => db.suscribir(() => refrescar(n => n + 1)), []);
    return db.listar(col, filtro);
  };
})();
