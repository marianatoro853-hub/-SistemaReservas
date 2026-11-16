import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para estandarizar respuestas de error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let mensaje = 'Ocurrió un error de conexión con el servidor.';
    if (error.response?.data) {
      const data = error.response.data;
      if (data.message) {
        mensaje = data.message;
      }
      if (data.errors && typeof data.errors === 'object') {
        const erroresCampos = Object.values(data.errors).join(' | ');
        mensaje = `${mensaje}: ${erroresCampos}`;
      }
    }
    return Promise.reject(new Error(mensaje));
  }
);

export default api;
