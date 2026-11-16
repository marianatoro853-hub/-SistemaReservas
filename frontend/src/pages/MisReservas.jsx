import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  InputAdornment,
  Pagination,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ReservaCard from '../components/ReservaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SnackbarAlert from '../components/SnackbarAlert';
import { useSnackbar } from '../hooks/useSnackbar';
import { getReservas, cancelarReserva } from '../services/reservaService';

export default function MisReservas() {
  const { snackbar, showSuccess, showError, closeSnackbar } = useSnackbar();

  const [telefonoFiltro, setTelefonoFiltro] = useState(
    () => localStorage.getItem('sena_reserva_telefono') || ''
  );
  const [telefonoBusqueda, setTelefonoBusqueda] = useState(
    () => localStorage.getItem('sena_reserva_telefono') || ''
  );

  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelandoId, setCancelandoId] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalElementos, setTotalElementos] = useState(0);

  const cargarReservas = useCallback(
    async (pageIndex, telefono) => {
      try {
        setLoading(true);
        const data = await getReservas(pageIndex, 10, telefono);
        setReservas(data.content || []);
        setTotalPaginas(data.totalPages || 1);
        setTotalElementos(data.totalElements || 0);
      } catch (err) {
        showError('No se pudieron consultar las reservas: ' + err.message);
      } finally {
        setLoading(false);
      }
    },
    [showError]
  );

  useEffect(() => {
    cargarReservas(pagina - 1, telefonoBusqueda);
  }, [pagina, telefonoBusqueda, cargarReservas]);

  const handleBuscar = (e) => {
    e.preventDefault();
    const telLimpio = telefonoFiltro.trim();
    setTelefonoBusqueda(telLimpio);
    setPagina(1);
    if (telLimpio) {
      localStorage.setItem('sena_reserva_telefono', telLimpio);
    }
  };

  const handleCancelar = async (id) => {
    try {
      setCancelandoId(id);
      await cancelarReserva(id);
      showSuccess(`La reserva #${id} ha sido cancelada correctamente.`);

      setReservas((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: 'CANCELADA' } : r))
      );
    } catch (err) {
      showError('Error al cancelar la reserva: ' + err.message);
    } finally {
      setCancelandoId(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 880, mx: 'auto' }}>
      {/* Cabecera */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ fontWeight: 700, color: '#39A900', letterSpacing: '0.1em' }}>
            GESTIÓN DE RESERVACIONES
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0B3B36', mb: 0.5 }}>
            Mis Reservas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Verifica el estado de tu asignación, descarga tu comprobante en PDF o cancela de ser necesario.
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/reservar"
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            backgroundColor: '#0B3B36',
            borderRadius: '8px',
            fontWeight: 700,
            '&:hover': { backgroundColor: '#175E56' },
          }}
        >
          Nueva Reserva
        </Button>
      </Box>

      {/* Buscador de Teléfono */}
      <Paper
        elevation={0}
        component="form"
        onSubmit={handleBuscar}
        sx={{
          p: 2.5,
          mb: 3.5,
          borderRadius: 2.5,
          border: '1px solid #E2E8F0',
          display: 'flex',
          gap: 1.5,
          alignItems: 'center',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Ingresa tu celular (10 dígitos) para consultar tus reservas"
          value={telefonoFiltro}
          onChange={(e) => setTelefonoFiltro(e.target.value)}
          inputProps={{ maxLength: 10 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#0B3B36',
            minWidth: 120,
            fontWeight: 700,
            '&:hover': { backgroundColor: '#175E56' },
          }}
        >
          Filtrar
        </Button>

        {telefonoBusqueda && (
          <Button
            variant="outlined"
            onClick={() => {
              setTelefonoFiltro('');
              setTelefonoBusqueda('');
              localStorage.removeItem('sena_reserva_telefono');
            }}
            sx={{ minWidth: 100, borderColor: '#CBD5E1', color: '#0F172A' }}
          >
            Limpiar
          </Button>
        )}
      </Paper>

      {/* Alerta de Filtro Activo */}
      {telefonoBusqueda && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          Mostrando reservas asociadas al celular: <strong>{telefonoBusqueda}</strong> ({totalElementos} encontrada{totalElementos !== 1 ? 's' : ''})
        </Alert>
      )}

      {/* Listado */}
      {loading ? (
        <LoadingSpinner message="Consultando reservas registradas..." />
      ) : reservas.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px dashed #CBD5E1',
            bgcolor: '#F8FAFC',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 1 }}>
            No se encontraron reservas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 450, mx: 'auto' }}>
            {telefonoBusqueda
              ? 'No hay registros asociados al número ingresado. Verifica los dígitos o agenda una nueva visita.'
              : 'Aún no has registrado ninguna reserva en el sistema de la Escuela Gastronómica.'}
          </Typography>
          <Button
            component={RouterLink}
            to="/reservar"
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              backgroundColor: '#0B3B36',
              fontWeight: 700,
              '&:hover': { backgroundColor: '#175E56' },
            }}
          >
            Agendar una Reserva
          </Button>
        </Paper>
      ) : (
        <Box>
          {reservas.map((r) => (
            <ReservaCard
              key={r.id}
              reserva={r}
              onCancelar={handleCancelar}
              disabled={cancelandoId === r.id}
            />
          ))}

          {totalPaginas > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPaginas}
                page={pagina}
                onChange={(_, nuevaPagina) => setPagina(nuevaPagina)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </Box>
      )}

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
    </Box>
  );
}
