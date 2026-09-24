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
const ESTADOS = {
  abierto: { etiqueta: 'Abierto', clases: 'bg-sky-100 text-sky-800' },
  en_progreso: { etiqueta: 'En progreso', clases: 'bg-amber-100 text-amber-800' },
  resuelto: { etiqueta: 'Resuelto', clases: 'bg-emerald-100 text-emerald-800' },
};

// Prioridad -> texto + color. Lleva la palabra "Prioridad" en el texto
// para que no dependa solo del color (por la gente que no distingue rojo/verde)
const PRIORIDADES = {
  baja: { etiqueta: 'Prioridad baja', clases: 'bg-slate-100 text-slate-700' },
  media: { etiqueta: 'Prioridad media', clases: 'bg-orange-100 text-orange-800' },
  alta: { etiqueta: 'Prioridad alta', clases: 'bg-red-100 text-red-800' },
};

// Categoría -> texto bonito (con mayúscula y eso)
const CATEGORIAS = {
  hardware: 'Hardware',
  software: 'Software',
  red: 'Red',
  accesos: 'Accesos',
};

// Clases para las piezas de cada tarjeta, para no repetirlas a cada rato
const CLASES = {
  // la tarjeta normal: blanca con borde y sombrita
  tarjeta: 'flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm',
  // la tarjeta de un ticket resuelto: "apagada" (fondo gris y más transparente)
  // para que la vista se vaya a los pendientes (nivel 3)
  tarjetaResuelta: 'flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 opacity-60',

  numero: 'text-sm font-semibold text-slate-400',              // el "#1"
  titulo: 'text-lg font-semibold text-slate-900',              // el título del ticket
  descripcion: 'text-sm text-slate-600',                       // la descripción
  solicitante: 'text-sm text-slate-500',                       // quién lo pidió
  badge: 'inline-block rounded-full px-2 py-0.5 text-xs font-medium', // base de las etiquetitas de color
  filaBadges: 'flex flex-wrap gap-2',                          // contenedor de las etiquetitas
  filaBotones: 'mt-auto flex flex-wrap gap-2 pt-2',            // contenedor de los botones (mt-auto = pegados abajo)

  // botones de la tarjeta, todos cambian con hover
  btnAvanzar: 'rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700',     // "Empezar" / "Marcar resuelto"
  btnEditar: 'rounded-lg bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-300', // "Editar"
  btnEliminar: 'rounded-lg bg-red-50 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100',      // "Eliminar"

  // para el #mensaje cuando es un error: rojito para que se note
  mensajeError: 'rounded-lg bg-red-50 py-6 text-center text-red-700',
};
