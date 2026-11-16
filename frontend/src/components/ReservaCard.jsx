import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Stack,
  Tooltip,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import PeopleIcon from '@mui/icons-material/People';
import PhoneIcon from '@mui/icons-material/Phone';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';
import { ESTADOS_RESERVA } from '../constants';
import { generarComprobanteCliente } from '../utils/pdfReportGenerator';
import { generarEnlaceWhatsApp, generarEnlaceGoogleCalendar } from '../utils/integraciones';

export default function ReservaCard({ reserva, onCancelar, disabled = false }) {
  const [openConfirm, setOpenConfirm] = useState(false);

  const estadoInfo = ESTADOS_RESERVA[reserva.estado] || {
    label: reserva.estado,
    color: 'default',
    bgColor: '#E2E8F0',
    textColor: '#475569',
  };

  const handleConfirmarCancelar = () => {
    setOpenConfirm(false);
    if (onCancelar) {
      onCancelar(reserva.id);
    }
  };

  const handleDescargarTicket = () => {
    generarComprobanteCliente(reserva);
  };

  const handleWhatsApp = () => {
    const url = generarEnlaceWhatsApp(reserva);
    window.open(url, '_blank');
  };

  const handleGoogleCalendar = () => {
    const url = generarEnlaceGoogleCalendar(reserva);
    window.open(url, '_blank');
  };

  const tieneRestriccionDietaria =
    reserva.preferenciaDietaria &&
    !reserva.preferenciaDietaria.toLowerCase().includes('estándar') &&
    !reserva.preferenciaDietaria.toLowerCase().includes('sin restricciones');

  return (
    <>
      <Card
        sx={{
          mb: 2.5,
          border: '1px solid #E2E8F0',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
            borderColor: '#CBD5E1',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Cabecera */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 2,
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#39A900', letterSpacing: '0.05em' }}>
                  #SENA-{String(reserva.id).padStart(5, '0')}
                </Typography>
                <Chip
                  size="small"
                  icon={reserva.tipoConsumo === 'Para Llevar' ? <TakeoutDiningIcon /> : <RestaurantMenuIcon />}
                  label={reserva.tipoConsumo || 'En Sitio'}
                  sx={{
                    bgcolor: reserva.tipoConsumo === 'Para Llevar' ? '#FEF3C7' : '#F1F5F9',
                    color: reserva.tipoConsumo === 'Para Llevar' ? '#B45309' : '#0F172A',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                  }}
                />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mt: 0.3 }}>
                {reserva.clienteNombre}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mt: 0.2 }}>
                <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {reserva.clienteTelefono}
                </Typography>
              </Box>
            </Box>

            <Chip
              label={estadoInfo.label}
              size="small"
              sx={{
                bgcolor: estadoInfo.bgColor,
                color: estadoInfo.textColor,
                fontWeight: 700,
                borderRadius: '6px',
                px: 1,
              }}
            />
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Menú y Dieta Especial */}
          <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2, mb: 2, border: '1px solid #E2E8F0' }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600 }}>
              🍽️ MENÚ SELECCIONADO:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0B3B36', mb: 0.5 }}>
              {reserva.menuSeleccionado || 'Menú Pedagógico de Autor'}
            </Typography>

            {tieneRestriccionDietaria && (
              <Box sx={{ mt: 0.8, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <Chip
                  size="small"
                  label={`⚠️ ${reserva.preferenciaDietaria}`}
                  sx={{
                    bgcolor: '#FEE2E2',
                    color: '#BE123C',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Detalles Técnicos */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 1.5,
              my: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonthIcon sx={{ color: '#0B3B36', fontSize: 18 }} />
              <Typography variant="body2">
                <strong>Fecha:</strong> {reserva.fecha}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon sx={{ color: '#0B3B36', fontSize: 18 }} />
              <Typography variant="body2">
                <strong>Turno:</strong> {reserva.turno?.nombre} ({reserva.turno?.horaInicio} - {reserva.turno?.horaFin})
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TableRestaurantIcon sx={{ color: '#0B3B36', fontSize: 18 }} />
              <Typography variant="body2">
                <strong>Mesa #{reserva.mesa?.numero}:</strong> {reserva.mesa?.ubicacion}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon sx={{ color: '#0B3B36', fontSize: 18 }} />
              <Typography variant="body2">
                <strong>Comensales:</strong> {reserva.comensales} personas
              </Typography>
            </Box>
          </Box>

          {/* Observaciones */}
          {reserva.observaciones && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic', mb: 2 }}>
              Observación: "{reserva.observaciones}"
            </Typography>
          )}

          {/* Acciones */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            {/* Integraciones WhatsApp y Google Calendar */}
            <Stack direction="row" spacing={1}>
              <Tooltip title="Enviar comprobante por WhatsApp">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<WhatsAppIcon />}
                  onClick={handleWhatsApp}
                  sx={{ color: '#15803D', borderColor: '#86EFAC', fontWeight: 600 }}
                >
                  WhatsApp
                </Button>
              </Tooltip>

              <Tooltip title="Agendar en Google Calendar">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<CalendarMonthIcon />}
                  onClick={handleGoogleCalendar}
                  sx={{ color: '#0F172A', borderColor: '#CBD5E1', fontWeight: 600 }}
                >
                  Calendar
                </Button>
              </Tooltip>
            </Stack>

            {/* Comprobante PDF y Cancelación */}
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<PictureAsPdfIcon />}
                onClick={handleDescargarTicket}
                sx={{ borderColor: '#CBD5E1', color: '#0B3B36', fontWeight: 700 }}
              >
                Ticket PDF
              </Button>

              {reserva.estado === 'CONFIRMADA' && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<CancelOutlinedIcon />}
                  disabled={disabled}
                  onClick={() => setOpenConfirm(true)}
                  sx={{ fontWeight: 600 }}
                >
                  Cancelar
                </Button>
              )}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Modal de Cancelación */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirmar Cancelación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Deseas cancelar la reserva para la <strong>Mesa #{reserva.mesa?.numero}</strong> el día{' '}
            <strong>{reserva.fecha}</strong> ({reserva.turno?.nombre})? Esta acción liberará el espacio en cocina.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenConfirm(false)} color="inherit">
            Regresar
          </Button>
          <Button onClick={handleConfirmarCancelar} color="error" variant="contained">
            Sí, Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
