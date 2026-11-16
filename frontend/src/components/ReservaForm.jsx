/**
 * Formulario de creación de reservas (componente central del módulo).
 * El estado de los datos vive en la página (para poder mostrar el resumen);
 * aquí se manejan la validación, las mesas ocupadas y el envío.
 *
 * Props:
 *   datos      -> valores actuales del formulario
 *   onCambiar  -> (campo, valor) actualiza un campo
 *   onGuardar  -> async (datos) guarda la reserva; puede lanzar un error
 */
import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Chip, CircularProgress, InputAdornment, TextField,
  ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';
import TurnoSelector from './TurnoSelector.jsx';
import MesaSelector from './MesaSelector.jsx';
import ComensalesStepper from './ComensalesStepper.jsx';
import { MAX_COMENSALES, PREFERENCIAS_DIETARIAS, TIPOS_CONSUMO } from '../constants/reservas.js';
import { listarMesasOcupadas } from '../services/reservaService.js';
import { hoyISO, validarReserva } from '../utils/validaciones.js';
import { colores } from '../theme.js';

// Encabezado numerado de cada bloque del formulario
function Seccion({ numero, titulo, children }) {
  return (
    <Box component="section" sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box sx={{ width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 700, color: '#fff', bgcolor: colores.primario }}>
          {numero}
        </Box>
        <Typography variant="h6">{titulo}</Typography>
      </Box>
      {children}
    </Box>
  );
}

export default function ReservaForm({ datos, onCambiar, onGuardar }) {
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [errorServidor, setErrorServidor] = useState('');
  const [ocupadas, setOcupadas] = useState([]);

  const fechaYTurno = Boolean(datos.fechaReserva && datos.turnoId);

  // Cada vez que cambian la fecha o el turno, consulta qué mesas están ocupadas
  useEffect(() => {
    if (!fechaYTurno) {
      setOcupadas([]);
      return undefined;
    }
    let vigente = true; // evita actualizar el estado si la respuesta llega tarde
    listarMesasOcupadas(datos.fechaReserva, datos.turnoId)
      .then((ids) => vigente && setOcupadas(ids))
      .catch(() => vigente && setOcupadas([]));
    return () => { vigente = false; };
  }, [datos.fechaReserva, datos.turnoId, fechaYTurno]);

  // Si la mesa elegida quedó ocupada o muy pequeña, se desmarca
  useEffect(() => {
    if (datos.mesaId && ocupadas.includes(Number(datos.mesaId))) onCambiar('mesaId', '');
  }, [ocupadas]); // eslint-disable-line react-hooks/exhaustive-deps

  // Actualiza un campo y borra su error al corregirlo
  const cambiar = (campo, valor) => {
    onCambiar(campo, valor);
    if (errores[campo]) setErrores((e) => ({ ...e, [campo]: undefined }));
  };

  const alternarPreferencia = (pref) => {
    const actuales = datos.preferenciasDietarias;
    cambiar('preferenciasDietarias', actuales.includes(pref) ? actuales.filter((p) => p !== pref) : [...actuales, pref]);
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setErrorServidor('');

    const nuevosErrores = validarReserva(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setGuardando(true);
    try {
      await onGuardar({
        ...datos,
        nombreCliente: datos.nombreCliente.trim(),
        turnoId: Number(datos.turnoId),
        mesaId: Number(datos.mesaId),
        numComensales: Number(datos.numComensales),
      });
    } catch (e) {
      setErrorServidor(e.message); // por ejemplo: mesa ya reservada
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Box component="form" onSubmit={enviar} noValidate>
      {errorServidor && <Alert severity="error" sx={{ mb: 3 }}>{errorServidor}</Alert>}

      <Seccion numero={1} titulo="Tus datos">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '3fr 2fr' }, gap: 2 }}>
          <TextField
            label="Nombre completo" required value={datos.nombreCliente}
            onChange={(e) => cambiar('nombreCliente', e.target.value)}
            error={Boolean(errores.nombreCliente)} helperText={errores.nombreCliente}
            InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon color="primary" /></InputAdornment> }}
          />
          <TextField
            label="Teléfono" required value={datos.telefono}
            inputProps={{ inputMode: 'numeric', maxLength: 10 }}
            onChange={(e) => cambiar('telefono', e.target.value.replace(/\D/g, ''))}
            error={Boolean(errores.telefono)} helperText={errores.telefono || 'Recibirás la confirmación'}
            InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon color="primary" /></InputAdornment> }}
          />
        </Box>
      </Seccion>

      <Seccion numero={2} titulo="¿Cuándo vienes?">
        <TextField
          label="Fecha de la reserva" type="date" required value={datos.fechaReserva} sx={{ mb: 2, minWidth: 240 }}
          InputLabelProps={{ shrink: true }} inputProps={{ min: hoyISO() }}
          onChange={(e) => cambiar('fechaReserva', e.target.value)}
          error={Boolean(errores.fechaReserva)} helperText={errores.fechaReserva}
        />
        <TurnoSelector value={datos.turnoId} onChange={(id) => cambiar('turnoId', id)} error={errores.turnoId} />
      </Seccion>

      <Seccion numero={3} titulo="¿Cuántos son?">
        <ComensalesStepper
          value={datos.numComensales} max={MAX_COMENSALES}
          onChange={(n) => cambiar('numComensales', n)} error={errores.numComensales}
        />
      </Seccion>

      <Seccion numero={4} titulo="Elige tu mesa">
        <MesaSelector
          value={datos.mesaId} onChange={(id) => cambiar('mesaId', id)} ocupadas={ocupadas}
          comensales={datos.numComensales} habilitado={fechaYTurno} error={errores.mesaId}
        />
      </Seccion>

      <Seccion numero={5} titulo="Detalles del servicio">
        <ToggleButtonGroup
          exclusive value={datos.tipoConsumo} aria-label="Tipo de consumo" color="primary" sx={{ mb: 2.5 }}
          onChange={(_, valor) => valor && cambiar('tipoConsumo', valor)}
        >
          <ToggleButton value={TIPOS_CONSUMO[0]} sx={{ px: 2.5, gap: 1, textTransform: 'none' }}>
            <RestaurantIcon fontSize="small" /> {TIPOS_CONSUMO[0]}
          </ToggleButton>
          <ToggleButton value={TIPOS_CONSUMO[1]} sx={{ px: 2.5, gap: 1, textTransform: 'none' }}>
            <TakeoutDiningIcon fontSize="small" /> {TIPOS_CONSUMO[1]}
          </ToggleButton>
        </ToggleButtonGroup>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Preferencias dietarias (opcional)</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {PREFERENCIAS_DIETARIAS.map((pref) => {
            const activa = datos.preferenciasDietarias.includes(pref);
            return (
              <Chip
                key={pref} label={pref} clickable onClick={() => alternarPreferencia(pref)}
                color={activa ? 'primary' : 'default'} variant={activa ? 'filled' : 'outlined'}
                aria-pressed={activa}
              />
            );
          })}
        </Box>
      </Seccion>

      <Button
        type="submit" variant="contained" size="large" fullWidth disabled={guardando}
        startIcon={guardando ? <CircularProgress size={18} color="inherit" /> : null}
        sx={{ py: 1.5, fontSize: '1rem', background: `linear-gradient(90deg, ${colores.primario}, ${colores.medio})` }}
      >
        {guardando ? 'Guardando…' : 'Confirmar reserva'}
      </Button>
    </Box>
  );
}
