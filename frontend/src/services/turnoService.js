import api from './api';
import { MOCK_TURNOS } from './mockData';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

export const getTurnos = async () => {
  if (useMock) {
    return MOCK_TURNOS;
  }
  const response = await api.get('/turnos');
  return response.data;
};
