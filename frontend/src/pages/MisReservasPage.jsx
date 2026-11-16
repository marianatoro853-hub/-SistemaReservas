/**
 * Pantalla "Mis reservas": indicadores, filtros por estado, tabla y cancelación.
 */
import { useMemo, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Paper, Tab, Tabs, Typography } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { Link as RouterLink } from 'react-router-dom';
import useReservas from '../hooks/useReservas.js';
import ReservaTable from '../components/ReservaTable.jsx';
import EstadisticaCard from '../components/EstadisticaCard.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Notificacion from '../components/Notificacion.jsx';
import { ESTADOS } from '../constants/reservas.js';
import { colores, tarjeta } from '../theme.js';

const FILTROS = ['Todas', ESTADOS.PENDIENTE, ESTADOS.CONFIRMADA, ESTADOS.CANCELADA];

export default function MisReservasPage() {
  const { reservas, cargando, error, recargar, cancelar } = useReservas();
  const [filtro, setFiltro] = useState('Todas');
  const [aCancelar, setACancelar] = useState(null); // reserva pendiente de confirmar
  const [aviso, setAviso] = useState({ mensaje: '', tipo: 'success' });

  // Conteo por estado (se recalcula solo cuando cambia la lista)
  const conteo = useMemo(() => {
    const total = { Todas: reservas.length };
    FILTROS.slice(1).forEach((estado) => { total[estado] = reservas.filter((r) => r.estado === estado).length; });
    return total;
  }, [reservas]);

  const filtradas = filtro === 'Todas' ? reservas : reservas.filter((r) => r.estado === filtro);

  const confirmarCancelacion = async () => {
    const reserva = aCancelar;
    setACancelar(null);
    try {
      await cancelar(reserva.id);
      setAviso({ mensaje: `Reserva n.º ${reserva.id} cancelada.`, tipo: 'success' });
    } catch (e) {
      setAviso({ mensaje: e.message, tipo: 'error' });
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4">Mis reservas</Typography>
          <Typography color="text.secondary">Consulta, filtra y cancela tus reservas del restaurante escuela.</Typography>
        </Box>
        <Button component={RouterLink} to="/reservas/nueva" variant="contained">+ Nueva reserva</Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <EstadisticaCard titulo="Total de reservas" valor={conteo.Todas} color={colores.primario} icono={<EventNoteIcon />} />
        <EstadisticaCard titulo="Pendientes" valor={conteo[ESTADOS.PENDIENTE]} color="#C98A12" icono={<PendingActionsIcon />} />
        <EstadisticaCard titulo="Confirmadas" valor={conteo[ESTADOS.CONFIRMADA]} color="#1E9E6B" icono={<EventAvailableIcon />} />
        <EstadisticaCard titulo="Canceladas" valor={conteo[ESTADOS.CANCELADA]} color="#6B7C7A" icono={<EventBusyIcon />} />
      </Box>

      <Paper elevation={0} sx={{ ...tarjeta, overflow: 'hidden' }}>
        <Tabs value={filtro} onChange={(_, v) => setFiltro(v)} variant="scrollable" aria-label="Filtrar por estado" sx={{ px: 2, borderBottom: `1px solid ${colores.borde}` }}>
          {FILTROS.map((f) => <Tab key={f} value={f} label={`${f} (${conteo[f]})`} sx={{ textTransform: 'none', fontWeight: 600 }} />)}
        </Tabs>

        {cargando && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress aria-label="Cargando reservas" />
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ m: 2 }} action={<Button color="inherit" size="small" onClick={recargar}>Reintentar</Button>}>
            {error}
          </Alert>
        )}
        {!cargando && !error && <ReservaTable key={filtro} reservas={filtradas} onCancelar={setACancelar} />}
      </Paper>

      <ConfirmDialog
        abierto={Boolean(aCancelar)}
        titulo="¿Cancelar la reserva?"
        mensaje={aCancelar ? `Se cancelará la reserva n.º ${aCancelar.id} de ${aCancelar.nombreCliente}. Esta acción no se puede deshacer.` : ''}
        textoConfirmar="Cancelar reserva"
        onConfirmar={confirmarCancelacion}
        onCerrar={() => setACancelar(null)}
      />
      <Notificacion mensaje={aviso.mensaje} tipo={aviso.tipo} onCerrar={() => setAviso({ ...aviso, mensaje: '' })} />
    </>
  );
}
