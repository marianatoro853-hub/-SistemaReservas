/**
 * Utilidad para exportar el listado de reservas a formato Excel (.csv compatible con Microsoft Excel).
 * Cumple con el requerimiento RF-005 para informes de ventas y gestión.
 */

export const exportarReservasAExcel = (reservas, nombreArchivo = 'reporte_reservas_sena') => {
  if (!reservas || reservas.length === 0) {
    alert('No hay reservas disponibles para exportar.');
    return;
  }

  // Encabezados del archivo Excel
  const encabezados = [
    'ID Reserva',
    'Cliente',
    'Telefono',
    'Correo',
    'Fecha',
    'Turno',
    'Horario',
    'Numero Mesa',
    'Ubicacion Mesa',
    'Comensales',
    'Tipo Consumo',
    'Preferencia Dietaria',
    'Menu Seleccionado',
    'Estado',
    'Observaciones',
    'Fecha Creacion',
  ];

  // Filas de datos
  const filas = reservas.map((r) => [
    r.id,
    `"${(r.clienteNombre || '').replace(/"/g, '""')}"`,
    `"${r.clienteTelefono || ''}"`,
    `"${r.clienteEmail || ''}"`,
    `"${r.fecha || ''}"`,
    `"${r.turno?.nombre || ''}"`,
    `"${r.turno?.horaInicio || ''} - ${r.turno?.horaFin || ''}"`,
    r.mesa?.numero || '',
    `"${r.mesa?.ubicacion || ''}"`,
    r.comensales || 0,
    `"${r.tipoConsumo || 'En Sitio'}"`,
    `"${r.preferenciaDietaria || 'Estándar'}"`,
    `"${(r.menuSeleccionado || 'Menú del Día').replace(/"/g, '""')}"`,
    `"${r.estado || ''}"`,
    `"${(r.observaciones || '').replace(/"/g, '""')}"`,
    `"${r.createdAt || ''}"`,
  ]);

  // Contenido CSV con codificación UTF-8 con BOM para que Excel respete acentos y caracteres latinos
  const csvContent =
    '\uFEFF' +
    [encabezados.join(';'), ...filas.map((e) => e.join(';'))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${nombreArchivo}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
