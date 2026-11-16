/**
 * Etiqueta de color que muestra el estado de una reserva.
 * Props: estado (string) -> Pendiente | Confirmada | Cancelada
 */
import { Chip } from '@mui/material';
import { ESTADOS } from '../constants/reservas.js';

const ESTILOS = {
  [ESTADOS.PENDIENTE]: { bgcolor: '#FCEBC4', color: '#7A4E0B' },
  [ESTADOS.CONFIRMADA]: { bgcolor: '#D4F1E5', color: '#0E5A43' },
  [ESTADOS.CANCELADA]: { bgcolor: '#ECEFEF', color: '#5C6B69' },
};

export default function EstadoChip({ estado }) {
  return <Chip size="small" label={estado} sx={{ fontWeight: 700, ...ESTILOS[estado] }} />;
}
