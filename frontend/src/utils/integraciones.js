/**
 * Utilidades de integración con plataformas externas:
 * 1. WhatsApp Business API (Caso de Uso 2, Figura 5)
 * 2. Google Calendar (Pregunta 6 de Entrevista)
 */

/**
 * Genera el enlace directo para enviar la confirmación de la reserva vía WhatsApp.
 */
export const generarEnlaceWhatsApp = (reserva, numeroDestino = '') => {
  const telefonoLimpio = (numeroDestino || reserva.clienteTelefono || '').replace(/\D/g, '');
  const codigo = `#SENA-${String(reserva.id).padStart(5, '0')}`;

  const mensaje = 
`*🍽️ CONFIRMACIÓN DE RESERVA – SENA RISARALDA*
----------------------------------------
Estimado/a *${reserva.clienteNombre}*, su reserva ha sido confirmada con éxito.

📌 *Código:* ${codigo}
📅 *Fecha:* ${reserva.fecha}
⏰ *Turno:* ${reserva.turno?.nombre} (${reserva.turno?.horaInicio} - ${reserva.turno?.horaFin})
🪑 *Mesa Asignada:* Mesa #${reserva.mesa?.numero} (${reserva.mesa?.ubicacion})
👥 *Comensales:* ${reserva.comensales} personas
🥡 *Modalidad:* ${reserva.tipoConsumo || 'En Sitio'}
🥗 *Preferencia Dietaria:* ${reserva.preferenciaDietaria || 'Estándar'}
🍽️ *Plato Elegido:* ${reserva.menuSeleccionado || 'Menú Pedagógico'}

📍 *Lugar:* Escuela Gastronómica SENA Centro de Comercio y Servicios.
Por favor llegar 10 minutos antes del inicio del turno. ¡Le esperamos!`;

  const url = `https://api.whatsapp.com/send?phone=57${telefonoLimpio}&text=${encodeURIComponent(mensaje)}`;
  return url;
};

/**
 * Genera el enlace para añadir el evento directamente en Google Calendar.
 */
export const generarEnlaceGoogleCalendar = (reserva) => {
  const titulo = encodeURIComponent(`Reserva Escuela Gastronómica SENA - Mesa #${reserva.mesa?.numero}`);
  const detalles = encodeURIComponent(
    `Reserva confirmada a nombre de ${reserva.clienteNombre} para ${reserva.comensales} comensales. Modalidad: ${reserva.tipoConsumo || 'En Sitio'}. Menú: ${reserva.menuSeleccionado || 'Menú del Día'}. Código: #SENA-${reserva.id}`
  );
  const ubicacion = encodeURIComponent('Escuela Gastronómica SENA, Regional Risaralda, Pereira');

  // Formato de fechas para Google Calendar: YYYYMMDDTHHmmssZ
  const fechaLimpia = (reserva.fecha || '').replace(/-/g, '');
  const horaInicioLimpia = (reserva.turno?.horaInicio || '12:00:00').replace(/:/g, '').substring(0, 4) + '00';
  const horaFinLimpia = (reserva.turno?.horaFin || '15:00:00').replace(/:/g, '').substring(0, 4) + '00';

  // Hora aproximada local
  const fechas = `${fechaLimpia}T${horaInicioLimpia}/${fechaLimpia}T${horaFinLimpia}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${fechas}&details=${detalles}&location=${ubicacion}`;
};
