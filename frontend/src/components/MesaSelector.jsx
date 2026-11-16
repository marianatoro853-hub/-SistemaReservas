/**
 * Mapa de mesas: cada mesa es un botón que muestra su capacidad y ubicación.
 * Se deshabilitan las mesas ocupadas en la fecha y el turno elegidos y
 * las que no tienen capacidad para los comensales indicados.
 *
 * Props: value, onChange(id), ocupadas (ids), comensales, habilitado, error
 */
import { Box, ButtonBase, FormHelperText, Typography } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import { MESAS } from '../constants/reservas.js';
import { colores } from '../theme.js';

export default function MesaSelector({ value, onChange, ocupadas, comensales, habilitado, error }) {
  return (
    <Box>
      {!habilitado && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Elige primero la fecha y el turno para ver las mesas libres.
        </Typography>
      )}
      <Box
        role="radiogroup" aria-label="Mesa"
        sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 1.5, opacity: habilitado ? 1 : 0.5 }}
      >
        {MESAS.map((m) => {
          const ocupada = ocupadas.includes(m.id);
          const pequena = m.capacidad < Number(comensales);
          const bloqueada = !habilitado || ocupada || pequena;
          const activa = Number(value) === m.id;
          return (
            <ButtonBase
              key={m.id} role="radio" aria-checked={activa} disabled={bloqueada} onClick={() => onChange(m.id)}
              sx={{
                flexDirection: 'column', alignItems: 'flex-start', gap: 0.25, p: 1.5, borderRadius: 3, textAlign: 'left',
                border: `2px solid ${activa ? colores.primario : colores.borde}`,
                bgcolor: activa ? colores.primario : ocupada ? '#F1F3F3' : '#fff',
                color: activa ? '#fff' : 'text.primary', transition: 'all .15s',
                '&:hover': { borderColor: colores.medio },
                '&.Mui-disabled': { opacity: 0.55, cursor: 'not-allowed' },
              }}
            >
              <Typography fontWeight={700}>Mesa {m.numero}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <GroupIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">{m.capacidad} personas</Typography>
              </Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {ocupada ? 'Ocupada' : pequena && habilitado ? 'Muy pequeña' : m.ubicacion}
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </Box>
  );
}
