/**
 * Control para aumentar o disminuir el número de comensales.
 * Props: value, onChange(nuevoValor), min, max, error
 */
import { Box, FormHelperText, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { colores } from '../theme.js';

export default function ComensalesStepper({ value, onChange, min = 1, max = 8, error }) {
  const numero = Number(value);
  return (
    <Box>
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2, border: `1px solid ${colores.borde}`, borderRadius: 99, p: 0.5 }}>
        <IconButton aria-label="Quitar un comensal" disabled={numero <= min} onClick={() => onChange(numero - 1)}
          sx={{ bgcolor: '#E8F3F0' }}>
          <RemoveIcon />
        </IconButton>
        <Typography variant="h6" component="span" aria-live="polite" sx={{ minWidth: 28, textAlign: 'center' }}>
          {numero}
        </Typography>
        <IconButton aria-label="Agregar un comensal" disabled={numero >= max} onClick={() => onChange(numero + 1)}
          sx={{ bgcolor: colores.primario, color: '#fff', '&:hover': { bgcolor: colores.profundo }, '&.Mui-disabled': { bgcolor: '#E8F3F0', color: '#9bb' } }}>
          <AddIcon />
        </IconButton>
      </Box>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </Box>
  );
}
