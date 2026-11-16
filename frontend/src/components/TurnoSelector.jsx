/**
 * Selector visual de turno (desayuno, almuerzo o cena) con tarjetas.
 * Props: value (id del turno), onChange(id), error (mensaje)
 */
import { Box, ButtonBase, FormHelperText, Typography } from '@mui/material';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import { TURNOS } from '../constants/reservas.js';
import { colores } from '../theme.js';

const ICONOS = { 1: <FreeBreakfastIcon />, 2: <LunchDiningIcon />, 3: <DinnerDiningIcon /> };

export default function TurnoSelector({ value, onChange, error }) {
  return (
    <Box>
      <Box role="radiogroup" aria-label="Turno" sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
        {TURNOS.map((t) => {
          const activo = Number(value) === t.id;
          return (
            <ButtonBase
              key={t.id} role="radio" aria-checked={activo} onClick={() => onChange(t.id)}
              sx={{
                flexDirection: 'column', gap: 0.5, p: 1.5, borderRadius: 3, textAlign: 'center',
                border: `2px solid ${activo ? colores.primario : colores.borde}`,
                bgcolor: activo ? colores.primario : '#fff', color: activo ? '#fff' : 'text.primary',
                transition: 'all .15s', '&:hover': { borderColor: colores.medio },
              }}
            >
              {ICONOS[t.id]}
              <Typography fontWeight={700}>{t.nombre}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>{t.horaInicio} – {t.horaFin}</Typography>
            </ButtonBase>
          );
        })}
      </Box>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </Box>
  );
}
