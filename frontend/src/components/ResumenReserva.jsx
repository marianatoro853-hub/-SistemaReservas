/**
 * Tarjeta con el resumen en vivo de la reserva, con estilo de ticket.
 * Se actualiza mientras el usuario completa el formulario.
 * Props: datos (estado del formulario)
 */
import { Box, Divider, Typography } from '@mui/material';
import { MESAS, TURNOS } from '../constants/reservas.js';
import { formatearFecha } from '../utils/formato.js';
import { colores } from '../theme.js';

function Linea({ etiqueta, valor }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.75 }}>
      <Typography variant="body2" sx={{ opacity: 0.7 }}>{etiqueta}</Typography>
      <Typography variant="body2" fontWeight={700} textAlign="right">{valor || '—'}</Typography>
    </Box>
  );
}

export default function ResumenReserva({ datos }) {
  const turno = TURNOS.find((t) => t.id === Number(datos.turnoId));
  const mesa = MESAS.find((m) => m.id === Number(datos.mesaId));

  return (
    <Box
      sx={{
        position: 'relative', overflow: 'hidden', color: '#fff', borderRadius: 4, p: { xs: 3, md: 4 },
        background: `linear-gradient(160deg, ${colores.profundo} 0%, ${colores.primario} 100%)`,
        boxShadow: '0 20px 44px rgba(14,63,59,0.28)',
        '&::before': { content: '""', position: 'absolute', width: 260, height: 260, borderRadius: '50%', top: -90, right: -80, background: 'rgba(94,197,164,0.28)' },
        '&::after': { content: '""', position: 'absolute', width: 180, height: 180, borderRadius: '50%', bottom: -70, left: -60, background: 'rgba(242,181,68,0.18)' },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.8 }}>Escuela Gastronómica SENA</Typography>
        <Typography variant="h4" sx={{ mb: 1, lineHeight: 1.1 }}>Tu mesa te espera</Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
          Vive la cocina de los futuros chefs. Completa el formulario y confirmaremos por WhatsApp.
        </Typography>

        <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', border: '1px dashed rgba(255,255,255,0.4)', borderRadius: 3, p: 2.5 }}>
          <Typography variant="overline" sx={{ opacity: 0.8 }}>Resumen de tu reserva</Typography>
          <Linea etiqueta="A nombre de" valor={datos.nombreCliente.trim()} />
          <Linea etiqueta="Fecha" valor={datos.fechaReserva ? formatearFecha(datos.fechaReserva) : ''} />
          <Linea etiqueta="Turno" valor={turno ? `${turno.nombre} · ${turno.horaInicio}` : ''} />
          <Linea etiqueta="Mesa" valor={mesa ? `Mesa ${mesa.numero} · ${mesa.ubicacion}` : ''} />
          <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.25)' }} />
          <Linea etiqueta="Comensales" valor={String(datos.numComensales)} />
          <Linea etiqueta="Consumo" valor={datos.tipoConsumo} />
          {datos.preferenciasDietarias.length > 0 && (
            <Linea etiqueta="Dieta" valor={datos.preferenciasDietarias.join(', ')} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
