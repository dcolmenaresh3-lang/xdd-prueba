// URL de la API. La levanta json-server cuando corres `npm run api`.
const API_URL = 'http://localhost:3000/tickets';

// Estado de la aplicación: la lista de tickets tal como la conoce el navegador.
// La pantalla siempre se dibuja a partir de este arreglo.
let tickets = [];

// Tu código empieza aquí.

// ============================================================
// ESTILOS (solo colores y textos bonitos, aquí NO hay lógica)
// ============================================================
// Estos objetos son como un "diccionario": le das lo que viene de la API
// (ej: "en_progreso") y te devuelve el texto para humanos y las clases de color.
// Ej: ESTADOS['en_progreso'].etiqueta  ->  "En progreso"
//
// OJO: las clases van escritas COMPLETAS. Nada de 'bg-' + color + '-100',
// porque el Tailwind instalado no las reconoce armadas por pedacitos.

// Estado del ticket -> texto + color de la etiquetica (badge)
// el puntico (●) es para que se vea tipo "semáforo", pero el texto sigue ahí
const ESTADOS = {
  abierto: { etiqueta: '● Abierto', clases: 'bg-sky-100 text-sky-800' },
  en_progreso: { etiqueta: '● En progreso', clases: 'bg-amber-100 text-amber-800' },
  resuelto: { etiqueta: '✓ Resuelto', clases: 'bg-emerald-100 text-emerald-800' },
};

// Prioridad -> texto + color. Lleva la palabra "Prioridad" en el texto
// para que no dependa solo del color (por la gente que no distingue rojo/verde).
// "borde" es la rayita de color que va a la izquierda de la tarjeta
const PRIORIDADES = {
  baja: { etiqueta: 'Prioridad baja', clases: 'bg-slate-100 text-slate-700', borde: 'border-l-slate-300' },
  media: { etiqueta: 'Prioridad media', clases: 'bg-orange-100 text-orange-800', borde: 'border-l-orange-400' },
  alta: { etiqueta: '🔥 Prioridad alta', clases: 'bg-red-100 text-red-800', borde: 'border-l-red-500' },
};

// Categoría -> texto bonito con emoji (queda más visual)
const CATEGORIAS = {
  hardware: '🖥️ Hardware',
  software: '💾 Software',
  red: '📶 Red',
  accesos: '🔑 Accesos',
};

// Clases para las piezas de cada tarjeta, para no repetirlas a cada rato
const CLASES = {
  // la tarjeta normal: blanca, borde gordito a la izquierda (border-l-4) donde va el color
  // de la prioridad (PRIORIDADES[...].borde), y al pasar el mouse sube la sombra y se levanta un pelito
  tarjeta: 'flex flex-col gap-3 rounded-2xl border border-l-4 border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg',
  // la tarjeta de un ticket resuelto: "apagada" (fondo gris, más transparente y sin brincar)
  // para que la vista se vaya a los pendientes (nivel 3)
  tarjetaResuelta: 'flex flex-col gap-3 rounded-2xl border border-l-4 border-slate-200 border-l-emerald-300 bg-slate-50 p-5 opacity-60',

  encabezado: 'flex items-start justify-between gap-2',                      // fila de arriba: número + estado
  numero: 'rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-500', // el "#1" en cajita
  titulo: 'text-lg font-bold leading-snug text-slate-900',                   // el título del ticket
  descripcion: 'text-sm leading-relaxed text-slate-600',                      // la descripción
  solicitante: 'text-sm text-slate-500',                                      // quién lo pidió (ej: "👤 Luz Marina")
  badge: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', // base de las etiquetitas de color
  filaBadges: 'flex flex-wrap gap-2',                                         // contenedor de las etiquetitas
  filaBotones: 'mt-auto flex flex-wrap gap-2 border-t border-slate-100 pt-3', // botones abajo con una rayita encima (mt-auto = pegados al fondo)

  // botones de la tarjeta, todos cambian con hover y se hunden al clic (active:scale-95)
  btnAvanzar: 'cursor-pointer rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95',     // "Empezar" / "Marcar resuelto"
  btnEditar: 'cursor-pointer rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95',  // "Editar"
  btnEliminar: 'cursor-pointer rounded-lg px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 active:scale-95',                 // "Eliminar" (sin fondo, más discreto)

  // para el #mensaje cuando es un error: rojito para que se note (reemplaza las clases del HTML)
  mensajeError: 'mb-5 rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-8 text-center font-medium text-red-700',
};
