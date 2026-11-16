import api from './api';
import {
  mockGetReservas,
  mockCrearReserva,
  mockCancelarReserva,
  mockCompletarReserva,
  mockGetMesasOcupadas,
} from './mockData';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

export const getReservas = async (page = 0, size = 10, clienteTelefono = '') => {
  if (useMock) {
    return mockGetReservas(page, size, clienteTelefono);
  }
  const params = { page, size };
  if (clienteTelefono && clienteTelefono.trim()) {
    params.clienteTelefono = clienteTelefono.trim();
  }
  const response = await api.get('/reservas', { params });
  return response.data;
};

export const crearReserva = async (reservaData) => {
  if (useMock) {
    return mockCrearReserva(reservaData);
  }
  const response = await api.post('/reservas', reservaData);
  return response.data;
};

export const cancelarReserva = async (id) => {
  if (useMock) {
    return mockCancelarReserva(id);
  }
  try {
    const response = await api.patch(`/reservas/${id}/cancelar`);
    return response.data;
  } catch (error) {
    // Si el servidor solo acepta PUT por versión legacy:
    const fallbackResponse = await api.put(`/reservas/${id}/cancelar`);
    return fallbackResponse.data;
  }
};

export const completarReserva = async (id) => {
  if (useMock) {
    return mockCompletarReserva(id);
  }
  const response = await api.patch(`/reservas/${id}/completar`);
  return response.data;
};

export const getMesasOcupadas = async (fecha, turnoId) => {
  if (useMock) {
    return mockGetMesasOcupadas(fecha, turnoId);
  }
  const response = await api.get('/reservas/mesas-ocupadas', {
    params: { fecha, turnoId },
  });
  return response.data;
};
