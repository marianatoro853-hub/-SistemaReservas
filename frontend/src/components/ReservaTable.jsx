/**
 * Tabla de reservas con paginación y acción de cancelar.
 * Props:
 *   reservas   -> lista de reservas a mostrar
 *   onCancelar -> recibe la reserva que se quiere cancelar
 */
import { useState } from 'react';
import {
  IconButton, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, Tooltip, Typography,
} from '@mui/material';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EstadoChip from './EstadoChip.jsx';
import { ESTADOS, MESAS, TURNOS } from '../constants/reservas.js';
import { formatearFecha } from '../utils/formato.js';

const nombreTurno = (id) => TURNOS.find((t) => t.id === id)?.nombre ?? '-';
const numeroMesa = (id) => MESAS.find((m) => m.id === id)?.numero ?? '-';
const FILAS_POR_PAGINA = 6;

export default function ReservaTable({ reservas, onCancelar }) {
  const [pagina, setPagina] = useState(0);
  const visibles = reservas.slice(pagina * FILAS_POR_PAGINA, (pagina + 1) * FILAS_POR_PAGINA);

  if (reservas.length === 0) {
    return <Typography color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>No hay reservas en esta categoría.</Typography>;
  }

  return (
    <>
      <TableContainer>
        <Table aria-label="Tabla de reservas">
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 700, color: 'primary.dark', bgcolor: '#EAF4F1', borderBottom: 'none' } }}>
              <TableCell>N.º</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Turno</TableCell>
              <TableCell align="center">Mesa</TableCell>
              <TableCell align="center">Pers.</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibles.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell sx={{ fontWeight: 700 }}>{r.id}</TableCell>
                <TableCell>{r.nombreCliente}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatearFecha(r.fechaReserva)}</TableCell>
                <TableCell>{nombreTurno(r.turnoId)}</TableCell>
                <TableCell align="center">{numeroMesa(r.mesaId)}</TableCell>
                <TableCell align="center">{r.numComensales}</TableCell>
                <TableCell><EstadoChip estado={r.estado} /></TableCell>
                <TableCell align="center">
                  {r.estado !== ESTADOS.CANCELADA && (
                    <Tooltip title="Cancelar reserva">
                      <IconButton color="error" size="small" aria-label={`Cancelar reserva ${r.id}`} onClick={() => onCancelar(r)}>
                        <EventBusyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div" count={reservas.length} page={pagina} rowsPerPage={FILAS_POR_PAGINA}
        rowsPerPageOptions={[FILAS_POR_PAGINA]} onPageChange={(_, p) => setPagina(p)}
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />
    </>
  );
}
