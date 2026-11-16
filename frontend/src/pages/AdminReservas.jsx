import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  Alert,
  Stack,
  InputAdornment,
  Switch,
  FormControlLabel,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import KeyIcon from '@mui/icons-material/Key';
import LogoutIcon from '@mui/icons-material/Logout';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import KitchenIcon from '@mui/icons-material/Kitchen';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import TableBarIcon from '@mui/icons-material/TableBar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SecurityIcon from '@mui/icons-material/Security';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BarChartIcon from '@mui/icons-material/BarChart';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LoadingSpinner from '../components/LoadingSpinner';
import SnackbarAlert from '../components/SnackbarAlert';
import { useSnackbar } from '../hooks/useSnackbar';
import { getReservas, cancelarReserva, completarReserva } from '../services/reservaService';
import { getTurnos } from '../services/turnoService';
import { generarReportePDF } from '../utils/pdfReportGenerator';
import { exportarReservasAExcel } from '../utils/excelExport';
import { getCuposDiariosConfig, setCuposDiariosConfig } from '../services/mockData';
import { ROLES_SENA, getUsuarioSesion, iniciarSesion, cerrarSesion } from '../services/authService';
import {
  getPlatosCarta,
  guardarPlato,
  eliminarPlato,
  toggleDisponibilidadPlato,
  formatearPrecioCOP,
} from '../services/menuService';

export default function AdminReservas() {
  const { snackbar, showSuccess, showError, closeSnackbar } = useSnackbar();

  // Autenticación
  const [usuarioActual, setUsuarioActual] = useState(getUsuarioSesion);
  const [rolSeleccionadoParaLogin, setRolSeleccionadoParaLogin] = useState('INSTRUCTOR_LIDER');
  const [pinIngresado, setPinIngresado] = useState('');
  const [errorLogin, setErrorLogin] = useState('');

  // Sub-pestaña para Instructor Líder ('operativo' o 'carta')
  const [subPestanaAdmin, setSubPestanaAdmin] = useState('operativo');

  // Datos
  const [reservas, setReservas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [platosCarta, setPlatosCarta] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cupos diarios del Instructor Líder
  const [cuposDiarios, setCuposDiarios] = useState(getCuposDiariosConfig());
  const [openModalCupos, setOpenModalCupos] = useState(false);
  const [nuevoLimiteCupos, setNuevoLimiteCupos] = useState(cuposDiarios);

  // Modal para Crear / Editar Plato
  const [openModalPlato, setOpenModalPlato] = useState(false);
  const [platoEnEdicion, setPlatoEnEdicion] = useState(null);
  const [formPlato, setFormPlato] = useState({
    nombre: '',
    categoria: 'Platos Fuertes',
    descripcion: '',
    precio: 25000,
    badge: 'Especialidad',
    imagen: '',
    disponible: true,
  });

  // Filtros
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroTurno, setFiltroTurno] = useState('TODOS');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');

  // Cancelación
  const [reservaACancelar, setReservaACancelar] = useState(null);
  const [cancelando, setCancelando] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const [reservasData, turnosData] = await Promise.all([
        getReservas(0, 100),
        getTurnos(),
      ]);
      setReservas(reservasData.content || []);
      setTurnos(turnosData || []);
      setPlatosCarta(getPlatosCarta());
    } catch (err) {
      showError('Error al sincronizar datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    if (usuarioActual) {
      cargarDatos();
    }
  }, [usuarioActual, cargarDatos]);

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      setErrorLogin('');
      const usuario = iniciarSesion(rolSeleccionadoParaLogin, pinIngresado);
      setUsuarioActual(usuario);
      setPinIngresado('');
      showSuccess(`Bienvenido/a al sistema: ${usuario.nombre}`);
    } catch (err) {
      setErrorLogin(err.message);
    }
  };

  const handleLogout = () => {
    cerrarSesion();
    setUsuarioActual(null);
    showSuccess('Sesión cerrada correctamente.');
  };

  // Filtrado de reservas
  const reservasFiltradas = reservas.filter((r) => {
    if (filtroFecha && r.fecha !== filtroFecha) return false;
    if (filtroTurno !== 'TODOS' && r.turno?.id !== Number(filtroTurno)) return false;
    if (filtroEstado !== 'TODOS' && r.estado !== filtroEstado) return false;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim();
      const matchNombre = r.clienteNombre?.toLowerCase().includes(q);
      const matchTel = r.clienteTelefono?.includes(q);
      const matchMesa = String(r.mesa?.numero).includes(q);
      if (!matchNombre && !matchTel && !matchMesa) return false;
    }
    return true;
  });

  // KPIs
  const total = reservasFiltradas.length;
  const confirmadas = reservasFiltradas.filter((r) => r.estado === 'CONFIRMADA').length;
  const canceladas = reservasFiltradas.filter((r) => r.estado === 'CANCELADA').length;
  const totalComensales = reservasFiltradas
    .filter((r) => r.estado === 'CONFIRMADA')
    .reduce((acc, curr) => acc + (curr.comensales || 0), 0);

  const porcentajeAforo = Math.min(Math.round((totalComensales / cuposDiarios) * 100), 100);

  // Cocina
  const reservasConAlergias = reservasFiltradas.filter(
    (r) =>
      r.preferenciaDietaria &&
      !r.preferenciaDietaria.toLowerCase().includes('estándar') &&
      !r.preferenciaDietaria.toLowerCase().includes('sin restricciones') &&
      r.estado === 'CONFIRMADA'
  );

  const platosAgrupados = reservasFiltradas
    .filter((r) => r.estado === 'CONFIRMADA')
    .reduce((acc, curr) => {
      const plato = curr.menuSeleccionado || 'Menú Pedagógico de Autor';
      acc[plato] = (acc[plato] || 0) + (curr.comensales || 1);
      return acc;
    }, {});

  const handleDescargarPDF = () => {
    generarReportePDF({
      reservas: reservasFiltradas,
      filtros: { fecha: filtroFecha, turno: filtroTurno, estado: filtroEstado },
    });
    showSuccess('Generando documento de impresión / PDF oficial...');
  };

  const handleDescargarExcel = () => {
    exportarReservasAExcel(reservasFiltradas);
    showSuccess('Archivo Excel (.CSV) descargado con éxito.');
  };

  const handleGuardarCupos = () => {
    const lim = Number(nuevoLimiteCupos);
    if (lim > 0) {
      setCuposDiariosConfig(lim);
      setCuposDiarios(lim);
      setOpenModalCupos(false);
      showSuccess(`Límite diario de cupos actualizado a ${lim} platos.`);
    }
  };

  // Gestión de Platos y Precios
  const handleAbrirCrearPlato = () => {
    setPlatoEnEdicion(null);
    setFormPlato({
      nombre: '',
      categoria: 'Platos Fuertes',
      descripcion: '',
      precio: 25000,
      badge: 'Especialidad',
      imagen: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      disponible: true,
    });
    setOpenModalPlato(true);
  };

  const handleAbrirEditarPlato = (plato) => {
    setPlatoEnEdicion(plato);
    setFormPlato({
      nombre: plato.nombre,
      categoria: plato.categoria,
      descripcion: plato.descripcion || '',
      precio: plato.precio,
      badge: plato.badge || 'Recomendado',
      imagen: plato.imagen || '',
      disponible: plato.disponible,
    });
    setOpenModalPlato(true);
  };

  const handleGuardarPlatoSubmit = (e) => {
    e.preventDefault();
    if (!formPlato.nombre.trim()) {
      showError('El nombre del plato es obligatorio.');
      return;
    }
    if (Number(formPlato.precio) <= 0) {
      showError('El precio debe ser mayor a cero.');
      return;
    }

    const payload = {
      ...formPlato,
      id: platoEnEdicion ? platoEnEdicion.id : undefined,
    };

    const actualizados = guardarPlato(payload);
    setPlatosCarta(actualizados);
    setOpenModalPlato(false);
    showSuccess(
      platoEnEdicion
        ? `Plato "${formPlato.nombre}" actualizado correctamente.`
        : `Nuevo plato "${formPlato.nombre}" agregado a la carta.`
    );
  };

  const handleToggleDisponibilidad = (id) => {
    const actualizados = toggleDisponibilidadPlato(id);
    setPlatosCarta(actualizados);
    showSuccess('Estado de disponibilidad en cocina actualizado.');
  };

  const handleEliminarPlato = (id) => {
    if (window.confirm('¿Confirmas la eliminación de este plato de la carta?')) {
      const actualizados = eliminarPlato(id);
      setPlatosCarta(actualizados);
      showSuccess('Plato eliminado de la carta.');
    }
  };

  const handleConfirmarCancelar = async () => {
    if (!reservaACancelar) return;
    try {
      setCancelando(true);
      await cancelarReserva(reservaACancelar.id);
      showSuccess(`Reserva #${reservaACancelar.id} cancelada con éxito.`);
      setReservas((prev) =>
        prev.map((r) => (r.id === reservaACancelar.id ? { ...r, estado: 'CANCELADA' } : r))
      );
    } catch (err) {
      showError('No se pudo cancelar: ' + err.message);
    } finally {
      setCancelando(false);
      setReservaACancelar(null);
    }
  };

  const handleCompletarReserva = async (reservaId) => {
    try {
      await completarReserva(reservaId);
      showSuccess(`Check-In realizado con éxito. Comensal registrado en sala (Reserva #${reservaId}).`);
      setReservas((prev) =>
        prev.map((r) => (r.id === reservaId ? { ...r, estado: 'COMPLETADA' } : r))
      );
    } catch (err) {
      showError('No se pudo registrar el check-in: ' + err.message);
    }
  };

  // PANTALLA LOGIN
  if (!usuarioActual) {
    const rolActualInfo = ROLES_SENA[rolSeleccionadoParaLogin];

    return (
      <Box sx={{ maxWidth: 620, mx: 'auto', mt: 3, mb: 6 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)',
            bgcolor: '#FFFFFF',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                bgcolor: 'rgba(11, 59, 54, 0.08)',
                color: '#0B3B36',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <SecurityIcon fontSize="medium" />
            </Box>
            <Typography variant="overline" sx={{ fontWeight: 800, color: '#39A900', letterSpacing: '0.1em' }}>
              CONTROL DE ACCESO RESTRINGIDO
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0B3B36' }}>
              Portal de Funcionarios SENA
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Ingreso especializado según los 4 roles autorizados de la Escuela Gastronómica.
            </Typography>
          </Box>

          {errorLogin && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {errorLogin}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <FormControl fullWidth sx={{ mb: 2.5 }}>
              <InputLabel>Selecciona tu Rol Operativo</InputLabel>
              <Select
                value={rolSeleccionadoParaLogin}
                label="Selecciona tu Rol Operativo"
                onChange={(e) => {
                  setRolSeleccionadoParaLogin(e.target.value);
                  setErrorLogin('');
                }}
              >
                <MenuItem value="INSTRUCTOR_LIDER">👔 Instructor Líder de Área</MenuItem>
                <MenuItem value="JEFE_COCINA">👨‍🍳 Jefe / Instructor de Cocina</MenuItem>
                <MenuItem value="CAPITAN_RESTAURANTE">🤵 Capitán de Restaurante / Salón</MenuItem>
                <MenuItem value="ENCARGADO_RESERVAS">📋 Encargado de Reservas</MenuItem>
              </Select>
            </FormControl>

            <Paper elevation={0} sx={{ p: 2.5, mb: 3, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0B3B36', mb: 0.5 }}>
                {rolActualInfo.nombre}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
                {rolActualInfo.descripcion}
              </Typography>

              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F172A', display: 'block' }}>
                Permisos asignados:
              </Typography>
              <Box component="ul" sx={{ pl: 2.5, m: 0, mt: 0.5 }}>
                {rolActualInfo.permisos.map((p, idx) => (
                  <Typography key={idx} component="li" variant="caption" color="text.secondary">
                    {p}
                  </Typography>
                ))}
              </Box>
            </Paper>

            <TextField
              fullWidth
              type="password"
              label="Código de Acceso / PIN *"
              value={pinIngresado}
              onChange={(e) => setPinIngresado(e.target.value)}
              placeholder="Ingresa tu PIN de seguridad"
              helperText={
                rolSeleccionadoParaLogin === 'INSTRUCTOR_LIDER'
                  ? 'PIN de prueba: 2026'
                  : 'PIN de prueba: 1234'
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              startIcon={<LockOutlinedIcon />}
              sx={{
                bgcolor: '#0B3B36',
                py: 1.4,
                fontWeight: 700,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#175E56' },
              }}
            >
              Ingresar a mi Consola
            </Button>
          </Box>
        </Paper>

        <SnackbarAlert
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={closeSnackbar}
        />
      </Box>
    );
  }

  // PANTALLA PRINCIPAL CON SESIÓN INICIADA
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Barra de Perfil */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 4,
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: 'rgba(11, 59, 54, 0.08)',
              color: '#0B3B36',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {usuarioActual.id === 'INSTRUCTOR_LIDER' && <SupervisorAccountIcon />}
            {usuarioActual.id === 'JEFE_COCINA' && <KitchenIcon />}
            {usuarioActual.id === 'CAPITAN_RESTAURANTE' && <TableBarIcon />}
            {usuarioActual.id === 'ENCARGADO_RESERVAS' && <AssignmentIcon />}
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                {usuarioActual.nombre}
              </Typography>
              <Chip
                size="small"
                label={usuarioActual.id.replace('_', ' ')}
                sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.68rem' }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              {usuarioActual.email} • Acceso restringido activo
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={cargarDatos}
            sx={{ borderColor: '#CBD5E1', color: '#0F172A' }}
          >
            Sincronizar
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ fontWeight: 700 }}
          >
            Cerrar Sesión
          </Button>
        </Stack>
      </Paper>

      {/* ======================================================== */}
      {/* 1. VISTA EXCLUSIVA: INSTRUCTOR LÍDER                     */}
      {/* ======================================================== */}
      {usuarioActual.id === 'INSTRUCTOR_LIDER' && (
        <Box>
          {/* Sub-navegación entre Operaciones y Gestión de Carta */}
          <Box sx={{ mb: 3, display: 'flex', gap: 1.5, borderBottom: '1px solid #E2E8F0', pb: 2 }}>
            <Button
              variant={subPestanaAdmin === 'operativo' ? 'contained' : 'outlined'}
              onClick={() => setSubPestanaAdmin('operativo')}
              startIcon={<AssignmentIcon />}
              sx={{
                bgcolor: subPestanaAdmin === 'operativo' ? '#0B3B36' : 'transparent',
                fontWeight: 700,
                borderRadius: '8px',
                borderColor: '#CBD5E1',
                color: subPestanaAdmin === 'operativo' ? '#FFFFFF' : '#0F172A',
                '&:hover': { bgcolor: subPestanaAdmin === 'operativo' ? '#175E56' : '#F1F5F9' },
              }}
            >
              Control Operativo & Auditoría
            </Button>

            <Button
              variant={subPestanaAdmin === 'carta' ? 'contained' : 'outlined'}
              onClick={() => setSubPestanaAdmin('carta')}
              startIcon={<RestaurantMenuIcon />}
              sx={{
                bgcolor: subPestanaAdmin === 'carta' ? '#0B3B36' : 'transparent',
                fontWeight: 700,
                borderRadius: '8px',
                borderColor: '#CBD5E1',
                color: subPestanaAdmin === 'carta' ? '#FFFFFF' : '#0F172A',
                '&:hover': { bgcolor: subPestanaAdmin === 'carta' ? '#175E56' : '#F1F5F9' },
              }}
            >
              Gestión de Carta & Precios ({platosCarta.length} platos)
            </Button>
          </Box>

          {/* Sub-pestaña A: Operativo */}
          {subPestanaAdmin === 'operativo' && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0B3B36' }}>
                    Consola Estratégica & Auditoría
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Control de capacidad de cupos y emisión de informes oficiales de ventas (RF-005, RF-006, RF-007).
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="outlined"
                    startIcon={<TableViewIcon />}
                    onClick={handleDescargarExcel}
                    sx={{ borderColor: '#0B3B36', color: '#0B3B36', fontWeight: 700 }}
                  >
                    Descargar Excel (RF-005)
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PictureAsPdfIcon />}
                    onClick={handleDescargarPDF}
                    sx={{ bgcolor: '#0B3B36', fontWeight: 700, '&:hover': { bgcolor: '#175E56' } }}
                  >
                    Planilla PDF Oficial (RF-007)
                  </Button>
                </Stack>
              </Box>

              {/* Control de Cupos Diarios */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 2.5,
                  border: '1px solid #E2E8F0',
                  bgcolor: porcentajeAforo >= 90 ? '#FEF2F2' : '#F8FAFC',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                      Límite de Cupos Diarios (Base: {cuposDiarios} platos)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Modificación de aforo en tiempo real autorizada exclusivamente para el Instructor Líder.
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      setNuevoLimiteCupos(cuposDiarios);
                      setOpenModalCupos(true);
                    }}
                    sx={{ borderColor: '#CBD5E1', color: '#0B3B36', fontWeight: 700 }}
                  >
                    Modificar Cupos
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={porcentajeAforo}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: '#E2E8F0',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: porcentajeAforo >= 90 ? '#BE123C' : porcentajeAforo >= 70 ? '#D97706' : '#15803D',
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, minWidth: 120, textAlign: 'right' }}>
                    {totalComensales} / {cuposDiarios} ({porcentajeAforo}%)
                  </Typography>
                </Box>
              </Paper>

              {/* KPIs */}
              <Grid container spacing={2.5} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ borderLeft: '4px solid #0B3B36' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        TOTAL REGISTRADAS
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#0B3B36', my: 0.5 }}>
                        {total}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Registros en base de datos</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ borderLeft: '4px solid #15803D' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        CONFIRMADAS
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#15803D', my: 0.5 }}>
                        {confirmadas}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Mesas activas</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ borderLeft: '4px solid #BE123C' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        CANCELADAS
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#BE123C', my: 0.5 }}>
                        {canceladas}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Cupos liberados</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ borderLeft: '4px solid #39A900' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        COMENSALES TOTALES
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#39A900', my: 0.5 }}>
                        {totalComensales}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Platos a servir</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Sub-pestaña B: GESTIÓN DE CARTA & PRECIOS (¡Lo que Mariana solicitó!) */}
          {subPestanaAdmin === 'carta' && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0B3B36' }}>
                    Administrador de Carta Gastronómica & Precios
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Crea platos, modifica tarifas en tiempo real y controla la disponibilidad en cocina.
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<AddCircleIcon />}
                  onClick={handleAbrirCrearPlato}
                  sx={{ bgcolor: '#39A900', fontWeight: 700, '&:hover': { bgcolor: '#277500' } }}
                >
                  Agregar Nuevo Plato
                </Button>
              </Box>

              {/* Grid de Platos en la Carta */}
              <Grid container spacing={3}>
                {platosCarta.map((plato) => (
                  <Grid item xs={12} md={6} lg={4} key={plato.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid #E2E8F0',
                        opacity: plato.disponible ? 1 : 0.65,
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="160"
                        image={plato.imagen}
                        alt={plato.nombre}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Chip
                            size="small"
                            label={plato.categoria}
                            sx={{ bgcolor: 'rgba(11, 59, 54, 0.08)', color: '#0B3B36', fontWeight: 700, fontSize: '0.7rem' }}
                          />
                          <Chip
                            size="small"
                            label={plato.disponible ? 'En Menú' : 'Agotado'}
                            sx={{
                              bgcolor: plato.disponible ? '#DCFCE7' : '#FEE2E2',
                              color: plato.disponible ? '#15803D' : '#BE123C',
                              fontWeight: 800,
                              fontSize: '0.68rem',
                            }}
                          />
                        </Box>

                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', mt: 1 }}>
                          {plato.nombre}
                        </Typography>

                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', my: 1, minHeight: 36, lineHeight: 1.4 }}>
                          {plato.descripcion}
                        </Typography>

                        <Divider sx={{ my: 1.5 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Tarifa Formativa:
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0B3B36' }}>
                            {formatearPrecioCOP(plato.precio)}
                          </Typography>
                        </Box>
                      </CardContent>

                      <Box sx={{ p: 1.5, px: 2.5, bgcolor: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              size="small"
                              checked={plato.disponible}
                              onChange={() => handleToggleDisponibilidad(plato.id)}
                              color="primary"
                            />
                          }
                          label={<Typography variant="caption" sx={{ fontWeight: 600 }}>{plato.disponible ? 'Disponible' : 'Agotado'}</Typography>}
                        />

                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Editar plato y precio">
                            <IconButton size="small" onClick={() => handleAbrirEditarPlato(plato)} sx={{ color: '#0B3B36' }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Eliminar de la carta">
                            <IconButton size="small" color="error" onClick={() => handleEliminarPlato(plato.id)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      )}

      {/* ======================================================== */}
      {/* 2. VISTA EXCLUSIVA: JEFE DE COCINA                      */}
      {/* ======================================================== */}
      {usuarioActual.id === 'JEFE_COCINA' && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0B3B36' }}>
              👨‍🍳 Despacho de Cocina: Comensales y Seguridad Dietaria
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Planificación del mise en place diario y control de alergias severas (RF-001, RF-002).
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#BE123C', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningAmberIcon fontSize="small" /> Alertas Dietarias Críticas ({reservasConAlergias.length})
                </Typography>

                {reservasConAlergias.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No se registran comensales con alergias en este corte.
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
                    {reservasConAlergias.map((r) => (
                      <Box key={r.id} sx={{ p: 1.5, bgcolor: '#FEF2F2', borderRadius: 2, borderLeft: '3px solid #BE123C' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#991B1B' }}>
                          Mesa #{r.mesa?.numero} ({r.clienteNombre}) – {r.comensales} personas
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#B91C1C' }}>
                          Restricción: {r.preferenciaDietaria}
                        </Typography>
                        {r.observaciones && (
                          <Typography variant="caption" sx={{ color: '#7F1D1D', display: 'block', mt: 0.5 }}>
                            Nota: "{r.observaciones}"
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0B3B36', mb: 2 }}>
                  Consolidado de Preparación de Platos
                </Typography>
                <Stack spacing={1.5}>
                  {Object.entries(platosAgrupados).map(([plato, cantidad], idx) => (
                    <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                        {plato}
                      </Typography>
                      <Chip size="small" label={`${cantidad} porciones`} sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800 }} />
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* ======================================================== */}
      {/* 3. VISTA EXCLUSIVA: CAPITÁN DE RESTAURANTE              */}
      {/* ======================================================== */}
      {usuarioActual.id === 'CAPITAN_RESTAURANTE' && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0B3B36' }}>
              🤵 Planificación de Montaje de Sala y Asignación de Meseros
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Distribución de vajilla, montaje de mantelería y cálculo de brigada por turno (RF-003, RF-004).
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {turnos.map((t) => {
              const reservasTurno = reservasFiltradas.filter((r) => r.turno?.id === t.id && r.estado === 'CONFIRMADA');
              const comensalesTurno = reservasTurno.reduce((acc, c) => acc + (c.comensales || 0), 0);
              const meserosSugeridos = Math.max(1, Math.ceil(comensalesTurno / 10));

              return (
                <Grid item xs={12} md={4} key={t.id}>
                  <Card sx={{ border: '1px solid #E2E8F0', height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#39A900', textTransform: 'uppercase' }}>
                        {t.horaInicio} - {t.horaFin}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', my: 0.5 }}>
                        {t.nombre}
                      </Typography>
                      <Divider sx={{ my: 1.5 }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Mesas a Montar:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{reservasTurno.length} mesas</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Comensales Previstos:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{comensalesTurno} personas</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#0B3B36' }}>Brigada de Aprendices:</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#0B3B36' }}>{meserosSugeridos} meseros</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {/* ======================================================== */}
      {/* 4. TABLA GENERAL DE AUDITORÍA (Instructor & Encargado)   */}
      {/* ======================================================== */}
      {(usuarioActual.id === 'INSTRUCTOR_LIDER' && subPestanaAdmin === 'operativo' || usuarioActual.id === 'ENCARGADO_RESERVAS') && (
        <Box>
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #E2E8F0' }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: '#0F172A', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <FilterAltIcon fontSize="small" sx={{ color: '#0B3B36' }} /> Filtros de Auditoría
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Buscar Cliente / Teléfono"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Ej: Mariana o 300..."
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Filtrar por Fecha"
                  type="date"
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Turno</InputLabel>
                  <Select
                    value={filtroTurno}
                    label="Turno"
                    onChange={(e) => setFiltroTurno(e.target.value)}
                  >
                    <MenuItem value="TODOS">Todos los turnos</MenuItem>
                    {turnos.map((t) => (
                      <MenuItem key={t.id} value={t.id}>
                        {t.nombre} ({t.horaInicio} - {t.horaFin})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filtroEstado}
                    label="Estado"
                    onChange={(e) => setFiltroEstado(e.target.value)}
                  >
                    <MenuItem value="TODOS">Todos los estados</MenuItem>
                    <MenuItem value="CONFIRMADA">Solo Confirmadas</MenuItem>
                    <MenuItem value="CANCELADA">Solo Canceladas</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {loading ? (
            <LoadingSpinner message="Consultando base de datos de reservas..." />
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', mb: 4 }}>
              <Table sx={{ minWidth: 850 }} size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}># ID</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>Cliente & Contacto</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>Fecha & Turno</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>Mesa</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>Modalidad</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>Dieta / Menú</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0F172A', textAlign: 'center' }}>Cupo</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0F172A', textAlign: 'right' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservasFiltradas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} sx={{ textAlign: 'center', py: 5, color: '#64748B' }}>
                        No se encontraron reservas con los criterios seleccionados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    reservasFiltradas.map((r) => (
                      <TableRow key={r.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ fontWeight: 700, color: '#0B3B36' }}>#{r.id}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {r.clienteNombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {r.clienteTelefono}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {r.fecha}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {r.turno?.nombre}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            Mesa #{r.mesa?.numero}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {r.mesa?.ubicacion}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={r.tipoConsumo || 'En Sitio'}
                            sx={{
                              bgcolor: r.tipoConsumo === 'Para Llevar' ? '#FEF3C7' : '#F1F5F9',
                              color: r.tipoConsumo === 'Para Llevar' ? '#B45309' : '#0F172A',
                              fontWeight: 700,
                              fontSize: '0.7rem',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                            {r.menuSeleccionado || 'Menú del Día'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#BE123C', fontWeight: 600, display: 'block' }}>
                            {r.preferenciaDietaria}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 700 }}>
                          {r.comensales}
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={r.estado}
                            sx={{
                              bgcolor: r.estado === 'CONFIRMADA' ? '#DCFCE7' : '#FEE2E2',
                              color: r.estado === 'CONFIRMADA' ? '#15803D' : '#BE123C',
                              fontWeight: 700,
                              fontSize: '0.72rem',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          {r.estado === 'CONFIRMADA' && (
                            <Tooltip title="Cancelar reserva de comensal">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => setReservaACancelar(r)}
                              >
                                <CancelOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* Modal Crear / Editar Plato de la Carta */}
      <Dialog open={openModalPlato} onClose={() => setOpenModalPlato(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#0B3B36' }}>
          {platoEnEdicion ? 'Editar Plato & Tarifa' : 'Agregar Nuevo Plato a la Carta'}
        </DialogTitle>
        <Box component="form" onSubmit={handleGuardarPlatoSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre del Plato *"
                  value={formPlato.nombre}
                  onChange={(e) => setFormPlato({ ...formPlato, nombre: e.target.value })}
                  placeholder="Ej: Lomo al Trapo con Reducción de Café"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={formPlato.categoria}
                    label="Categoría"
                    onChange={(e) => setFormPlato({ ...formPlato, categoria: e.target.value })}
                  >
                    <MenuItem value="Entradas de Autor">Entradas de Autor</MenuItem>
                    <MenuItem value="Platos Fuertes">Platos Fuertes</MenuItem>
                    <MenuItem value="Repostería & Postres">Repostería & Postres</MenuItem>
                    <MenuItem value="Cafetería & Bebidas">Cafetería & Bebidas</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Precio en Pesos (COP) *"
                  value={formPlato.precio}
                  onChange={(e) => setFormPlato({ ...formPlato, precio: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Descripción Gourmet & Ingredientes *"
                  value={formPlato.descripcion}
                  onChange={(e) => setFormPlato({ ...formPlato, descripcion: e.target.value })}
                  placeholder="Describe la preparación, técnica culinaria y productos de origen..."
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Etiqueta / Badge"
                  value={formPlato.badge}
                  onChange={(e) => setFormPlato({ ...formPlato, badge: e.target.value })}
                  placeholder="Ej: Plato Insignia, Especial, Vegano"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formPlato.disponible}
                      onChange={(e) => setFormPlato({ ...formPlato, disponible: e.target.checked })}
                      color="primary"
                    />
                  }
                  label={formPlato.disponible ? 'Disponible en Cocina' : 'Agotado'}
                  sx={{ mt: 1 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL de Fotografía Gastronómica (HD)"
                  value={formPlato.imagen}
                  onChange={(e) => setFormPlato({ ...formPlato, imagen: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  helperText="Puedes pegar el enlace de cualquier foto de comida en alta resolución"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenModalPlato(false)} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#0B3B36', fontWeight: 700 }}>
              {platoEnEdicion ? 'Actualizar Plato' : 'Guardar en Carta'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Modal Ajuste de Cupos Diarios */}
      <Dialog open={openModalCupos} onClose={() => setOpenModalCupos(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Ajustar Límite de Cupos Diarios</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Como Instructor Líder, puedes modificar la capacidad máxima de platos a ofertar en la jornada pedagógica (Base: 50 cupos).
          </DialogContentText>
          <TextField
            fullWidth
            label="Número Máximo de Cupos Diarios"
            type="number"
            value={nuevoLimiteCupos}
            onChange={(e) => setNuevoLimiteCupos(e.target.value)}
            inputProps={{ min: 10, max: 200 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModalCupos(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleGuardarCupos} variant="contained" sx={{ bgcolor: '#0B3B36' }}>
            Guardar Límite
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo Cancelación */}
      <Dialog open={Boolean(reservaACancelar)} onClose={() => setReservaACancelar(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Cancelar Reserva Administrativamente</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de cancelar la reserva #{reservaACancelar?.id} a nombre de{' '}
            <strong>{reservaACancelar?.clienteNombre}</strong>? La mesa quedará liberada para nuevos comensales.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReservaACancelar(null)} color="inherit">
            Volver
          </Button>
          <Button
            onClick={handleConfirmarCancelar}
            color="error"
            variant="contained"
            disabled={cancelando}
          >
            {cancelando ? 'Cancelando...' : 'Confirmar Cancelación'}
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
