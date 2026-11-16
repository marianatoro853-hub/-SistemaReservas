/**
 * Funciones de formato para mostrar fechas legibles en español.
 */

// Convierte "2026-11-20" en "vie 20 nov 2026" (sin problemas de zona horaria)
export function formatearFecha(fechaISO) {
  if (!fechaISO) return '—';
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  return new Date(anio, mes - 1, dia)
    .toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    .replace(/\./g, '');
}
