/**
 * Hook personalizado: separa la lógica de datos de la presentación.
 * Carga las reservas al montar el componente (useEffect) y expone
 * las acciones crear y cancelar con sus estados de carga y error.
 */
import { useCallback, useEffect, useState } from 'react';
import { listarReservas, crearReserva, cancelarReserva } from '../services/reservaService.js';

export default function useReservas() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const recargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      setReservas(await listarReservas());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  // Crea una reserva y refresca la lista. Lanza el error para que el formulario lo muestre.
  const crear = async (datos) => {
    const nueva = await crearReserva(datos);
    await recargar();
    return nueva;
  };

  const cancelar = async (id) => {
    await cancelarReserva(id);
    await recargar();
  };

  return { reservas, cargando, error, recargar, crear, cancelar };
}
