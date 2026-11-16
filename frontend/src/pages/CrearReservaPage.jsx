/**
 * Pantalla "Nueva reserva": resumen en vivo a la izquierda y formulario a la derecha.
 */
import { useState } from 'react';
import { Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReservaForm from '../components/ReservaForm.jsx';
import ResumenReserva from '../components/ResumenReserva.jsx';
import TicketReserva from '../components/TicketReserva.jsx';
import { FORMULARIO_VACIO } from '../constants/reservas.js';
import { crearReserva } from '../services/reservaService.js';
import { tarjeta } from '../theme.js';

export default function CrearReservaPage() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState(FORMULARIO_VACIO);
  const [creada, setCreada] = useState(null); // reserva recién creada

  const cambiar = (campo, valor) => setDatos((anterior) => ({ ...anterior, [campo]: valor }));

  // Guarda la reserva; si falla, el error llega al formulario
  const guardar = async (valores) => {
    setCreada(await crearReserva(valores));
    setDatos(FORMULARIO_VACIO);
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' }, gap: 4, alignItems: 'start' }}>
      <Box sx={{ position: { md: 'sticky' }, top: { md: 100 }, order: { xs: 2, md: 1 } }}>
        <ResumenReserva datos={datos} />
      </Box>
      <Paper elevation={0} sx={{ ...tarjeta, p: { xs: 2.5, sm: 4 }, order: { xs: 1, md: 2 } }}>
        <ReservaForm datos={datos} onCambiar={cambiar} onGuardar={guardar} />
      </Paper>

      <TicketReserva
        reserva={creada}
        onNueva={() => setCreada(null)}
        onVerReservas={() => navigate('/reservas')}
      />
    </Box>
  );
}
