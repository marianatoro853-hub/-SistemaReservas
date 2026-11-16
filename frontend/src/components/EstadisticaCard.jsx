/**
 * Tarjeta con un indicador numérico (total, pendientes, etc.).
 * Props: titulo, valor, icono, color (hex del acento)
 */
import { Box, Paper, Typography } from '@mui/material';
import { tarjeta } from '../theme.js';

export default function EstadisticaCard({ titulo, valor, icono, color }) {
  return (
    <Paper elevation={0} sx={{ ...tarjeta, p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'grid', placeItems: 'center', color, bgcolor: `${color}22` }}>
        {icono}
      </Box>
      <Box>
        <Typography variant="h4" component="div" sx={{ lineHeight: 1 }}>{valor}</Typography>
        <Typography variant="body2" color="text.secondary">{titulo}</Typography>
      </Box>
    </Paper>
  );
}
