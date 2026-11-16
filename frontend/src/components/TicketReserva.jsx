/**
 * Ventana que confirma una reserva recién creada, con estilo de ticket.
 * Props: reserva (objeto devuelto por la API o null), onNueva, onVerReservas
 */
import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EstadoChip from './EstadoChip.jsx';
import { MESAS, TURNOS } from '../constants/reservas.js';
import { formatearFecha } from '../utils/formato.js';
import { colores } from '../theme.js';

export default function TicketReserva({ reserva, onNueva, onVerReservas }) {
  if (!reserva) return null;
  const turno = TURNOS.find((t) => t.id === reserva.turnoId);
  const mesa = MESAS.find((m) => m.id === reserva.mesaId);

  return (
    <Dialog open onClose={onNueva} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <Box sx={{ textAlign: 'center', pt: 4, pb: 2, color: '#fff', background: `linear-gradient(160deg, ${colores.profundo}, ${colores.primario})` }}>
        <CheckCircleIcon sx={{ fontSize: 52, color: colores.menta }} />
        <Typography variant="h5">¡Reserva creada!</Typography>
        <Typography variant="h3" sx={{ color: colores.ambar }}>N.º {reserva.id}</Typography>
      </Box>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 1 }}>
          <Typography><b>{reserva.nombreCliente}</b></Typography>
          <Typography color="text.secondary">{formatearFecha(reserva.fechaReserva)} · {turno?.nombre} {turno?.horaInicio}</Typography>
          <Typography color="text.secondary">Mesa {mesa?.numero} ({mesa?.ubicacion}) · {reserva.numComensales} comensales</Typography>
          <Box><EstadoChip estado={reserva.estado} /></Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onNueva}>Otra reserva</Button>
        <Button variant="contained" onClick={onVerReservas}>Ver mis reservas</Button>
      </DialogActions>
    </Dialog>
  );
}
