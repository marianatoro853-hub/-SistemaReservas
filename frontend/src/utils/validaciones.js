/**
 * Validaciones del formulario de reserva.
 * Cada regla corresponde a una historia de usuario del módulo
 * "Creación de Reserva". Devuelve un objeto { campo: 'mensaje' };
 * si el objeto está vacío, el formulario es válido.
 */
import { MESAS } from '../constants/reservas.js';

// Fecha de hoy en formato AAAA-MM-DD (para comparar con el input type="date")
export const hoyISO = () => {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
};

export function validarReserva(datos) {
  const errores = {};

  if (datos.nombreCliente.trim().length < 3) {
    errores.nombreCliente = 'Escribe el nombre completo (mínimo 3 letras).';
  }

  if (!/^\d{10}$/.test(datos.telefono)) {
    errores.telefono = 'El teléfono debe tener 10 dígitos, sin espacios.';
  }

  if (!datos.fechaReserva) {
    errores.fechaReserva = 'Selecciona la fecha de la reserva.';
  } else if (datos.fechaReserva < hoyISO()) {
    errores.fechaReserva = 'La fecha no puede ser anterior a hoy.';
  }

  if (!datos.turnoId) {
    errores.turnoId = 'Selecciona un turno.';
  }

  if (!datos.mesaId) {
    errores.mesaId = 'Selecciona una mesa.';
  }

  const comensales = Number(datos.numComensales);
  if (!Number.isInteger(comensales) || comensales < 1) {
    errores.numComensales = 'Indica al menos 1 comensal.';
  } else if (datos.mesaId) {
    // Regla de negocio: los comensales no pueden superar la capacidad de la mesa
    const mesa = MESAS.find((m) => m.id === Number(datos.mesaId));
    if (mesa && comensales > mesa.capacidad) {
      errores.numComensales = `La mesa ${mesa.numero} admite máximo ${mesa.capacidad} comensales.`;
    }
  }

  if (!datos.tipoConsumo) {
    errores.tipoConsumo = 'Selecciona el tipo de consumo.';
  }

  return errores;
}
