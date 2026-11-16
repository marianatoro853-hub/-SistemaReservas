/**
 * Constantes del módulo de reservas.
 * Se basan en el diagrama de clases: Reserva, Turno y Mesa.
 */

// Estados posibles de una reserva (atributo "estado" de la clase Reserva)
export const ESTADOS = {
  PENDIENTE: 'Pendiente',
  CONFIRMADA: 'Confirmada',
  CANCELADA: 'Cancelada',
};

// Turnos del restaurante escuela (clase Turno: nombre, hora inicio, hora fin)
export const TURNOS = [
  { id: 1, nombre: 'Desayuno', horaInicio: '07:00', horaFin: '09:00' },
  { id: 2, nombre: 'Almuerzo', horaInicio: '12:00', horaFin: '14:00' },
  { id: 3, nombre: 'Cena', horaInicio: '18:00', horaFin: '20:00' },
];

// Mesas disponibles (clase Mesa: número, capacidad, ubicación)
export const MESAS = [
  { id: 1, numero: 1, capacidad: 2, ubicacion: 'Salón principal' },
  { id: 2, numero: 2, capacidad: 2, ubicacion: 'Salón principal' },
  { id: 3, numero: 3, capacidad: 4, ubicacion: 'Salón principal' },
  { id: 4, numero: 4, capacidad: 4, ubicacion: 'Terraza' },
  { id: 5, numero: 5, capacidad: 4, ubicacion: 'Terraza' },
  { id: 6, numero: 6, capacidad: 6, ubicacion: 'Salón principal' },
  { id: 7, numero: 7, capacidad: 6, ubicacion: 'Terraza' },
  { id: 8, numero: 8, capacidad: 8, ubicacion: 'Salón de eventos' },
];

// Tipos de consumo (atributo "tipo_consumo" de la clase Reserva)
export const TIPOS_CONSUMO = ['En el restaurante', 'Para llevar'];

// Preferencias dietarias (atributo "preferencias_dietarias")
export const PREFERENCIAS_DIETARIAS = [
  'Vegetariano',
  'Vegano',
  'Sin gluten',
  'Sin lactosa',
  'Sin frutos secos',
];

// Estado inicial (vacío) del formulario de reserva
export const FORMULARIO_VACIO = {
  nombreCliente: '',
  telefono: '',
  fechaReserva: '',
  turnoId: '',
  mesaId: '',
  numComensales: 2,
  tipoConsumo: TIPOS_CONSUMO[0],
  preferenciasDietarias: [],
};

// Límite de comensales por reserva
export const MAX_COMENSALES = 8;
