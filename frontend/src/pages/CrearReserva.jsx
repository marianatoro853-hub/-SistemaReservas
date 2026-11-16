import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
  Divider,
  Alert,
  Chip,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Tooltip,
} from '@mui/material';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';
import LockIcon from '@mui/icons-material/Lock';
import DeckIcon from '@mui/icons-material/Deck';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ParkIcon from '@mui/icons-material/Park';
import StarIcon from '@mui/icons-material/Star';
import LoadingSpinner from '../components/LoadingSpinner';
import SnackbarAlert from '../components/SnackbarAlert';
import { useSnackbar } from '../hooks/useSnackbar';
import { getTurnos } from '../services/turnoService';
import { getMesas } from '../services/mesaService';
import { crearReserva, getMesasOcupadas } from '../services/reservaService';
import { OPCIONES_DIETARIAS, getCuposDiariosConfig } from '../services/mockData';
import { getPlatosCarta, formatearPrecioCOP } from '../services/menuService';
import { generarEnlaceWhatsApp, generarEnlaceGoogleCalendar } from '../utils/integraciones';

export default function CrearReserva() {
  const navigate = useNavigate();
  const { snackbar, showSuccess, showError, closeSnackbar } = useSnackbar();

  const [turnos, setTurnos] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [platosDisponibles, setPlatosDisponibles] = useState([]);
  const [mesasOcupadasIds, setMesasOcupadasIds] = useState([]);
  const [loadingCatalogos, setLoadingCatalogos] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Modal de Confirmación e Integraciones
  const [reservaCreadaExitosa, setReservaCreadaExitosa] = useState(null);

  const hoyStr = new Date().toISOString().split('T')[0];
  const platoPreseleccionado = localStorage.getItem('sena_plato_preseleccionado') || '';

  const [formData, setFormData] = useState({
    clienteNombre: '',
    clienteTelefono: localStorage.getItem('sena_reserva_telefono') || '',
    clienteEmail: '',
    fecha: hoyStr,
    turnoId: '',
    mesaId: '',
    comensales: 2,
    tipoConsumo: 'En Sitio',
    preferenciaDietaria: OPCIONES_DIETARIAS[0],
    menuSeleccionado: platoPreseleccionado || '',
    observaciones: '',
    aceptaDatos: true,
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        setLoadingCatalogos(true);
        const [turnosData, mesasData] = await Promise.all([getTurnos(), getMesas()]);
        const platosData = getPlatosCarta().filter((p) => p.disponible);
        setTurnos(turnosData);
        setMesas(mesasData);
        setPlatosDisponibles(platosData);

        setFormData((prev) => ({
          ...prev,
          turnoId: prev.turnoId || (turnosData.length > 0 ? turnosData[0].id : ''),
          menuSeleccionado: prev.menuSeleccionado || (platosData.length > 0 ? platosData[0].nombre : 'Menú de Autor'),
        }));
      } catch (err) {
        showError('Error al sincronizar catálogos: ' + err.message);
      } finally {
        setLoadingCatalogos(false);
      }
    };

    cargarCatalogos();
  }, [showError]);

  useEffect(() => {
    if (formData.fecha && formData.turnoId) {
      const verificarOcupadas = async () => {
        try {
          const ocupadas = await getMesasOcupadas(formData.fecha, formData.turnoId);
          setMesasOcupadasIds(ocupadas);

          if (formData.mesaId && ocupadas.includes(Number(formData.mesaId))) {
            setFormData((prev) => ({ ...prev, mesaId: '' }));
          }
        } catch (err) {
          console.error('Error al consultar ocupación de mesas:', err);
        }
      };
      verificarOcupadas();
    }
  }, [formData.fecha, formData.turnoId, formData.mesaId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSeleccionarMesa = (m) => {
    const estaOcupada = mesasOcupadasIds.includes(m.id);
    if (!estaOcupada) {
      setFormData((prev) => ({
        ...prev,
        mesaId: m.id,
        comensales: Math.min(prev.comensales, m.capacidad),
      }));
      setErrores((prev) => ({ ...prev, mesaId: null, comensales: null }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.clienteNombre.trim() || formData.clienteNombre.trim().length < 2) {
      nuevosErrores.clienteNombre = 'El nombre completo es requerido (mínimo 2 caracteres).';
    }

    const telRegex = /^[0-9]{10}$/;
    if (!formData.clienteTelefono.trim()) {
      nuevosErrores.clienteTelefono = 'El número celular es obligatorio.';
    } else if (!telRegex.test(formData.clienteTelefono.trim())) {
      nuevosErrores.clienteTelefono = 'Debe contener exactamente 10 dígitos numéricos (ej: 3001234567).';
    }

    if (formData.clienteEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clienteEmail)) {
      nuevosErrores.clienteEmail = 'Formato de correo electrónico no válido.';
    }

    if (!formData.fecha) {
      nuevosErrores.fecha = 'Selecciona una fecha.';
    } else if (formData.fecha < hoyStr) {
      nuevosErrores.fecha = 'No se permiten fechas anteriores al día de hoy.';
    }

    if (!formData.turnoId) {
      nuevosErrores.turnoId = 'Selecciona un turno de atención.';
    }

    if (!formData.mesaId) {
      nuevosErrores.mesaId = 'Selecciona una mesa disponible en el croquis.';
    }

    const mesaSeleccionada = mesas.find((m) => m.id === Number(formData.mesaId));
    if (mesaSeleccionada && Number(formData.comensales) > mesaSeleccionada.capacidad) {
      nuevosErrores.comensales = `La mesa #${mesaSeleccionada.numero} tiene capacidad máxima para ${mesaSeleccionada.capacidad} personas.`;
    }

    if (Number(formData.comensales) < 1) {
      nuevosErrores.comensales = 'Mínimo 1 comensal.';
    }

    if (!formData.aceptaDatos) {
      nuevosErrores.aceptaDatos = 'Debe autorizar el tratamiento de datos para procesar la reserva.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      showError('Por favor verifica los campos resaltados.');
      return;
    }

    try {
      setEnviando(true);
      const nueva = await crearReserva({
        clienteNombre: formData.clienteNombre.trim(),
        clienteTelefono: formData.clienteTelefono.trim(),
        clienteEmail: formData.clienteEmail.trim() || null,
        fecha: formData.fecha,
        turnoId: Number(formData.turnoId),
        mesaId: Number(formData.mesaId),
        comensales: Number(formData.comensales),
        tipoConsumo: formData.tipoConsumo,
        preferenciaDietaria: formData.preferenciaDietaria,
        menuSeleccionado: formData.menuSeleccionado,
        observaciones: formData.observaciones.trim() || null,
      });

      localStorage.setItem('sena_reserva_telefono', formData.clienteTelefono.trim());
      localStorage.removeItem('sena_plato_preseleccionado');
      showSuccess('¡Reserva confirmada con éxito!');
      setReservaCreadaExitosa(nueva);
    } catch (err) {
      showError(err.message || 'Error al procesar la reserva');
    } finally {
      setEnviando(false);
    }
  };

  if (loadingCatalogos) {
    return <LoadingSpinner message="Consultando plano de mesas y turnos..." />;
  }

  const mesaActual = mesas.find((m) => m.id === Number(formData.mesaId));
  const turnoActual = turnos.find((t) => t.id === Number(formData.turnoId));

  // Zonas del plano
  const mesasTerraza = mesas.filter((m) => m.ubicacion?.includes('Terraza'));
  const mesasSalon = mesas.filter((m) => m.ubicacion?.includes('Salón'));
  const mesasJardin = mesas.filter((m) => m.ubicacion?.includes('Jardín'));
  const mesasVIP = mesas.filter((m) => m.ubicacion?.includes('VIP') || m.ubicacion?.includes('Gourmet'));

  const renderMesaItem = (m, forma = 'cuadrada') => {
    const estaOcupada = mesasOcupadasIds.includes(m.id);
    const estaSeleccionada = Number(formData.mesaId) === m.id;
    const esRedonda = forma === 'redonda';

    return (
      <Box
        key={m.id}
        onClick={() => handleSeleccionarMesa(m)}
        sx={{
          cursor: estaOcupada ? 'not-allowed' : 'pointer',
          p: 1.5,
          borderRadius: esRedonda ? '50%' : 2.5,
          width: esRedonda ? 100 : '100%',
          height: esRedonda ? 100 : 'auto',
          minHeight: esRedonda ? 100 : 90,
          border: estaSeleccionada ? '3px solid #0B3B36' : estaOcupada ? '1px dashed #CBD5E1' : '1px solid #CBD5E1',
          bgcolor: estaSeleccionada
            ? '#DCFCE7'
            : estaOcupada
            ? '#F1F5F9'
            : '#FFFFFF',
          boxShadow: estaSeleccionada ? '0 0 0 4px rgba(11, 59, 54, 0.2)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          opacity: estaOcupada ? 0.5 : 1,
          mx: 'auto',
          '&:hover': {
            transform: estaOcupada ? 'none' : 'scale(1.04)',
            borderColor: estaOcupada ? '#CBD5E1' : '#0B3B36',
          },
        }}
      >
        {estaOcupada ? (
          <LockIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
        ) : (
          <TableRestaurantIcon sx={{ fontSize: 20, color: estaSeleccionada ? '#0B3B36' : '#39A900' }} />
        )}

        <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A', mt: 0.3 }}>
          Mesa #{m.numero}
        </Typography>

        <Typography variant="caption" sx={{ fontSize: '0.68rem', color: estaOcupada ? '#BE123C' : '#64748B', fontWeight: 700 }}>
          {estaOcupada ? 'Ocupada' : `Máx ${m.capacidad}p`}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto' }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="overline" sx={{ fontWeight: 800, color: '#39A900', letterSpacing: '0.12em' }}>
          MÓDULO DE RESERVACIÓN EN TIEMPO REAL
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0B3B36', mb: 1 }}>
          Agendar Mesa y Menú Pedagógico
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Registro de comensales, plano de sala 2D y confirmación inmediata con Código QR.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
        }}
      >
        {/* Sección 1: Modalidad de Consumo */}
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 1.5 }}>
          1. Modalidad del Servicio
        </Typography>

        <RadioGroup
          row
          name="tipoConsumo"
          value={formData.tipoConsumo}
          onChange={handleChange}
          sx={{ mb: 3 }}
        >
          <FormControlLabel
            value="En Sitio"
            control={<Radio color="primary" />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <RestaurantIcon fontSize="small" sx={{ color: '#0B3B36' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Consumir en el Restaurante Escuela
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="Para Llevar"
            control={<Radio color="primary" />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <TakeoutDiningIcon fontSize="small" sx={{ color: '#0B3B36' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Preparación Para Llevar (Takeout)
                </Typography>
              </Box>
            }
          />
        </RadioGroup>

        <Divider sx={{ my: 3 }} />

        {/* Sección 2: Datos del Titular */}
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 2 }}>
          2. Datos de Contacto del Comensal
        </Typography>

        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre Completo *"
              name="clienteNombre"
              value={formData.clienteNombre}
              onChange={handleChange}
              error={Boolean(errores.clienteNombre)}
              helperText={errores.clienteNombre}
              placeholder="Ej: Mariana Toro Ortiz"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Número Celular (10 dígitos) *"
              name="clienteTelefono"
              value={formData.clienteTelefono}
              onChange={handleChange}
              error={Boolean(errores.clienteTelefono)}
              helperText={errores.clienteTelefono || 'Canal para envío del comprobante por WhatsApp'}
              placeholder="Ej: 3001234567"
              inputProps={{ maxLength: 10 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Correo Electrónico (Opcional)"
              name="clienteEmail"
              type="email"
              value={formData.clienteEmail}
              onChange={handleChange}
              error={Boolean(errores.clienteEmail)}
              helperText={errores.clienteEmail}
              placeholder="mariana.toro@correo.com"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Sección 3: Fecha, Turno y Menú Dinámico */}
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 2 }}>
          3. Programación y Elección Gastronómica
        </Typography>

        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de Atención *"
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              error={Boolean(errores.fecha)}
              helperText={errores.fecha}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: hoyStr }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" error={Boolean(errores.turnoId)}>
              <InputLabel id="turno-label">Turno de Atención *</InputLabel>
              <Select
                labelId="turno-label"
                name="turnoId"
                value={formData.turnoId}
                label="Turno de Atención *"
                onChange={handleChange}
              >
                {turnos.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.nombre} ({t.horaInicio} - {t.horaFin})
                  </MenuItem>
                ))}
              </Select>
              {errores.turnoId && <FormHelperText>{errores.turnoId}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Plato de la Carta (Actualizado en Cocina)</InputLabel>
              <Select
                name="menuSeleccionado"
                value={formData.menuSeleccionado}
                label="Plato de la Carta (Actualizado en Cocina)"
                onChange={handleChange}
              >
                {platosDisponibles.map((p) => (
                  <MenuItem key={p.id} value={p.nombre}>
                    {p.nombre} ({formatearPrecioCOP(p.precio)})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Preferencia Dietaria / Alergias</InputLabel>
              <Select
                name="preferenciaDietaria"
                value={formData.preferenciaDietaria}
                label="Preferencia Dietaria / Alergias"
                onChange={handleChange}
              >
                {OPCIONES_DIETARIAS.map((dieta, idx) => (
                  <MenuItem key={idx} value={dieta}>
                    {dieta}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Sección 4: PLANO / CROQUIS 2D DE LA SALA (VISUAL FLOOR PLAN) */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0B3B36' }}>
                4. Croquis de Sala 2D (Selecciona tu Mesa en el Plano)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Haz clic sobre la mesa deseada en el mapa arquitectónico para reservarla.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip size="small" label="Libre" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800 }} />
              <Chip size="small" label="Seleccionada" sx={{ bgcolor: '#0B3B36', color: '#FFFFFF', fontWeight: 800 }} />
              <Chip size="small" label="Ocupada" sx={{ bgcolor: '#F1F5F9', color: '#94A3B8', fontWeight: 800 }} />
            </Box>
          </Box>

          {errores.mesaId && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {errores.mesaId}
            </Alert>
          )}

          {/* Plano Arquitectónico Estilizado */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '2px solid #0B3B36',
              borderRadius: 3,
              bgcolor: '#F8FAF9',
              position: 'relative',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 2.5, pb: 1, borderBottom: '1px dashed #CBD5E1' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#0B3B36', letterSpacing: '0.1em' }}>
                PLANO DISTRIBUTIVO – RESTAURANTE ESCUELA SENA
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* ZONA 1: TERRAZA PANORÁMICA */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, border: '1px solid #CBD5E1', borderRadius: 2, bgcolor: '#FFFFFF', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <DeckIcon fontSize="small" sx={{ color: '#0B3B36' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                      Terraza Panorámica (Bistró 2p)
                    </Typography>
                  </Box>
                  <Grid container spacing={2} justifyContent="center">
                    {mesasTerraza.map((m) => (
                      <Grid item xs={6} key={m.id}>
                        {renderMesaItem(m, 'redonda')}
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>

              {/* ZONA 2: SALÓN PRINCIPAL */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, border: '1px solid #CBD5E1', borderRadius: 2, bgcolor: '#FFFFFF', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <MeetingRoomIcon fontSize="small" sx={{ color: '#0B3B36' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                      Salón Principal (Ejecutivo 4p)
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {mesasSalon.map((m) => (
                      <Grid item xs={6} key={m.id}>
                        {renderMesaItem(m, 'cuadrada')}
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>

              {/* ZONA 3: JARDÍN INTERIOR */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, border: '1px solid #CBD5E1', borderRadius: 2, bgcolor: '#FFFFFF', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ParkIcon fontSize="small" sx={{ color: '#39A900' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                      Jardín Interior (Grupal 6p)
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {mesasJardin.map((m) => (
                      <Grid item xs={6} key={m.id}>
                        {renderMesaItem(m, 'cuadrada')}
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>

              {/* ZONA 4: ZONA VIP PRESIDENCIAL */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, border: '1px solid #CBD5E1', borderRadius: 2, bgcolor: '#FFFFFF', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <StarIcon fontSize="small" sx={{ color: '#D97706' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                      Zona VIP & Gourmet (Imperial 8-10p)
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {mesasVIP.map((m) => (
                      <Grid item xs={6} key={m.id}>
                        {renderMesaItem(m, 'cuadrada')}
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Sección 5: Comensales, Observaciones y GDPR */}
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 2 }}>
          5. Aforo & Notas Especiales
        </Typography>

        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Número de Comensales *"
              type="number"
              name="comensales"
              value={formData.comensales}
              onChange={handleChange}
              error={Boolean(errores.comensales)}
              helperText={
                errores.comensales ||
                (mesaActual ? `Límite mesa #${mesaActual.numero}: ${mesaActual.capacidad}` : 'Seleccione mesa en el plano')
              }
              inputProps={{ min: 1, max: mesaActual ? mesaActual.capacidad : 20 }}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Requerimientos Especiales (Opcional)"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              multiline
              rows={2}
              placeholder="Detalle alergias severas, requerimientos de accesibilidad o motivo de la visita..."
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="aceptaDatos"
                  checked={formData.aceptaDatos}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label={
                <Typography variant="caption" color="text.secondary">
                  Autorizo el tratamiento de mis datos personales para fines exclusivos de la gestión pedagógica y confirmación de la reserva en la Escuela Gastronómica SENA (Cumplimiento GDPR / Ley 1581 de 2012).
                </Typography>
              }
            />
            {errores.aceptaDatos && (
              <Typography variant="caption" color="error" display="block">
                {errores.aceptaDatos}
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* Resumen */}
        {mesaActual && turnoActual && (
          <Box sx={{ mt: 3, p: 2.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B3B36', textTransform: 'uppercase' }}>
              Resumen Preliminar de la Reserva
            </Typography>
            <Typography variant="body2" sx={{ color: '#334155', mt: 0.5 }}>
              Mesa #{mesaActual.numero} ({mesaActual.ubicacion}) para <strong>{formData.comensales} personas</strong> ({formData.tipoConsumo}). Menú: <em>"{formData.menuSeleccionado}"</em>. Dieta: <strong>{formData.preferenciaDietaria}</strong>.
            </Typography>
          </Box>
        )}

        {/* Botón de Envío */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={enviando}
            startIcon={enviando ? null : <CheckCircleIcon />}
            sx={{
              backgroundColor: '#0B3B36',
              py: 1.4,
              px: 5,
              fontSize: '1.02rem',
              fontWeight: 700,
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#175E56',
              },
            }}
          >
            {enviando ? 'Confirmando Reserva...' : 'Confirmar Reserva en Tiempo Real'}
          </Button>
        </Box>
      </Paper>

      {/* Modal de Confirmación Exitosa e Integraciones WhatsApp + Google Calendar */}
      <Dialog
        open={Boolean(reservaCreadaExitosa)}
        onClose={() => {
          setReservaCreadaExitosa(null);
          navigate('/mis-reservas');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0B3B36', textAlign: 'center', pt: 3 }}>
          🎉 ¡Reserva Confirmada Exitosamente!
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="body1" sx={{ color: '#0F172A', mb: 2 }}>
            Tu reserva ha sido registrada en el sistema bajo el código:
          </Typography>

          <Box
            sx={{
              display: 'inline-block',
              p: 1.5,
              px: 3,
              bgcolor: '#F8FAFC',
              border: '2px dashed #0B3B36',
              borderRadius: 2,
              fontWeight: 800,
              fontSize: '1.25rem',
              color: '#0B3B36',
              mb: 3,
            }}
          >
            #SENA-{String(reservaCreadaExitosa?.id || 1).padStart(5, '0')}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Elige a continuación cómo deseas recibir o sincronizar tu reserva:
          </Typography>

          <Stack spacing={2} sx={{ maxWidth: 360, mx: 'auto' }}>
            <Button
              variant="contained"
              startIcon={<WhatsAppIcon />}
              onClick={() => {
                const url = generarEnlaceWhatsApp(reservaCreadaExitosa);
                window.open(url, '_blank');
              }}
              sx={{
                bgcolor: '#25D366',
                color: '#FFFFFF',
                fontWeight: 700,
                '&:hover': { bgcolor: '#1EBE5D' },
              }}
            >
              Enviar Comprobante a WhatsApp
            </Button>

            <Button
              variant="outlined"
              startIcon={<CalendarMonthIcon />}
              onClick={() => {
                const url = generarEnlaceGoogleCalendar(reservaCreadaExitosa);
                window.open(url, '_blank');
              }}
              sx={{
                borderColor: '#0B3B36',
                color: '#0B3B36',
                fontWeight: 700,
              }}
            >
              Añadir a Google Calendar
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button
            variant="text"
            onClick={() => {
              setReservaCreadaExitosa(null);
              navigate('/mis-reservas');
            }}
            sx={{ color: '#64748B', fontWeight: 600 }}
          >
            Ir a Mis Reservas →
          </Button>
        </DialogActions>
      </Dialog>

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
    </Box>
  );
}
