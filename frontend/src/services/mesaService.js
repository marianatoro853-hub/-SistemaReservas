import api from './api';
import { MOCK_MESAS } from './mockData';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

export const getMesas = async () => {
  if (useMock) {
    return MOCK_MESAS;
  }
  const response = await api.get('/mesas');
  return response.data;
};
