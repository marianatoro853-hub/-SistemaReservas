import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Paper,
  Stack,
  Divider,
  Chip,
  Rating,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import TableBarIcon from '@mui/icons-material/TableBar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import VerifiedIcon from '@mui/icons-material/Verified';
import { getPlatosCarta, formatearPrecioCOP } from '../services/menuService';

export default function PanelCliente() {
  const [platosDestacados, setPlatosDestacados] = useState([]);
  const [estadoServicio, setEstadoServicio] = useState({
    enServicio: false,
    turnoActual: 'Cocina en Preparación',
    mensaje: 'Próxima apertura a las 12:00 PM',
  });

  useEffect(() => {
    // Cargar 3 platos destacados de la carta dinámica
    const todos = getPlatosCarta();
    setPlatosDestacados(todos.slice(0, 3));

    // Determinar estado de servicio según la hora actual
    const ahora = new Date();
    const hora = ahora.getHours();

    if (hora >= 7 && hora < 10) {
      setEstadoServicio({
        enServicio: true,
        turnoActual: 'Turno Desayuno Gourmet Activo',
        mensaje: 'Servicio en sala hasta las 10:00 AM',
      });
    } else if (hora >= 12 && hora < 15) {
      setEstadoServicio({
        enServicio: true,
        turnoActual: 'Turno Almuerzo de Degustación Activo',
        mensaje: 'Servicio en sala hasta las 3:00 PM',
      });
    } else if (hora >= 18 && hora < 21) {
      setEstadoServicio({
        enServicio: true,
        turnoActual: 'Turno Cena Pedagógica Activo',
        mensaje: 'Servicio en sala hasta las 9:00 PM',
      });
    } else {
      setEstadoServicio({
        enServicio: false,
        turnoActual: 'Mise en Place & Preparación de Cocina',
        mensaje: 'Aceptando reservas para las próximas jornadas',
      });
    }
  }, []);

  return (
    <Box>
      {/* Indicador de Estado Operativo en Vivo */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <Paper
          elevation={0}
          sx={{
            py: 1,
            px: 2.5,
            borderRadius: 5,
            border: '1px solid #E2E8F0',
            bgcolor: estadoServicio.enServicio ? '#DCFCE7' : '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: estadoServicio.enServicio ? '#15803D' : '#D97706',
              boxShadow: estadoServicio.enServicio ? '0 0 0 3px rgba(22, 163, 74, 0.25)' : 'none',
            }}
          />
          <Typography variant="caption" sx={{ fontWeight: 800, color: estadoServicio.enServicio ? '#15803D' : '#0F172A' }}>
            {estadoServicio.turnoActual}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            • {estadoServicio.mensaje}
          </Typography>
        </Paper>
      </Box>

      {/* Hero Principal con Fotografía de Fondo y Elegancia */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 7 },
          mb: 6,
          borderRadius: 3,
          background: `linear-gradient(rgba(11, 59, 54, 0.92), rgba(6, 36, 32, 0.95)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80') center/cover`,
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 36px rgba(11, 59, 54, 0.22)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Box sx={{ maxWidth: 760, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Chip
              label="SENA REGIONAL RISARALDA"
              size="small"
              sx={{ bgcolor: '#39A900', color: '#FFFFFF', fontWeight: 800, fontSize: '0.72rem' }}
            />
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}>
              Centro de Comercio y Servicios • Pereira
            </Typography>
          </Box>

          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.2rem', sm: '3rem', md: '3.6rem' },
              lineHeight: 1.15,
              mb: 2.5,
              letterSpacing: '-0.03em',
            }}
          >
            Donde la técnica se convierte en arte culinario
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.2rem' },
              color: 'rgba(255, 255, 255, 0.88)',
              mb: 4.5,
              lineHeight: 1.6,
              maxWidth: 680,
            }}
          >
            Disfruta de una experiencia gastronómica de alta cocina preparada en vivo por los aprendices de la Tecnología en Cocina. Reserva tu mesa y sé parte de la formación de los futuros chefs de Colombia.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component={RouterLink}
              to="/reservar"
              variant="contained"
              size="large"
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                bgcolor: '#39A900',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1.02rem',
                py: 1.6,
                px: 4,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#277500' },
              }}
            >
              Reservar Mesa Ahora
            </Button>

            <Button
              component={RouterLink}
              to="/menu"
              variant="outlined"
              size="large"
              startIcon={<RestaurantMenuIcon />}
              sx={{
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.4)',
                borderWidth: '1.5px',
                fontWeight: 700,
                fontSize: '1rem',
                py: 1.6,
                px: 3.5,
                borderRadius: '8px',
                '&:hover': {
                  borderColor: '#FFFFFF',
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  borderWidth: '1.5px',
                },
              }}
            >
              Explorar la Carta
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Platos Destacados de la Carta Dinámica */}
      <Box sx={{ mb: 7 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="overline" sx={{ fontWeight: 800, color: '#39A900', letterSpacing: '0.1em' }}>
              PROPUESTA CULINARIA DE TEMPORADA
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0B3B36' }}>
              Especialidades del Restaurante Escuela
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/menu"
            sx={{ fontWeight: 700, color: '#0B3B36' }}
          >
            Ver Carta Completa →
          </Button>
        </Box>

        <Grid container spacing={3.5}>
          {platosDestacados.map((plato) => (
            <Grid item xs={12} md={4} key={plato.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #E2E8F0',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={plato.imagen}
                  alt={plato.nombre}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Chip
                    size="small"
                    label={plato.badge}
                    sx={{ bgcolor: 'rgba(57, 169, 0, 0.12)', color: '#277500', fontWeight: 800, mb: 1, fontSize: '0.7rem' }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', lineHeight: 1.3, mb: 1 }}>
                    {plato.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ minHeight: 48, lineHeight: 1.5 }}>
                    {plato.descripcion}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Tarifa Formativa
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0B3B36' }}>
                      {formatearPrecioCOP(plato.precio)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Experiencia de Sala y Distribución */}
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, mb: 7, border: '1px solid #E2E8F0', borderRadius: 3, bgcolor: '#FFFFFF' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="overline" sx={{ fontWeight: 800, color: '#39A900', letterSpacing: '0.1em' }}>
              DISTRIBUCIÓN Y ESPACIOS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0B3B36', mb: 2 }}>
              Salones y Ambientes para Cada Ocasión
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
              Nuestras instalaciones cuentan con 8 mesas distribuidas estratégicamente para ofrecer confort y la mejor vista a los comensales:
            </Typography>

            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1, color: '#334155' }}>
                <strong>Terraza Panorámica:</strong> Mesas para 2 personas con vista a los jardines andinos.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1, color: '#334155' }}>
                <strong>Salón Principal:</strong> Mesas ejecutivas de 4 puestos para almuerzos de negocios y eventos.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1, color: '#334155' }}>
                <strong>Jardín Interior:</strong> Ambiente fresco para grupos de hasta 6 personas.
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: '#334155' }}>
                <strong>Zona VIP Presidencial:</strong> Mesa imperial para 10 personas para reuniones evaluadoras.
              </Typography>
            </Box>

            <Button
              component={RouterLink}
              to="/reservar"
              variant="contained"
              sx={{ mt: 3.5, bgcolor: '#0B3B36', fontWeight: 700 }}
            >
              Seleccionar Mesa en el Mapa →
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80"
              alt="Ambiente del Restaurante Escuela"
              sx={{
                width: '100%',
                height: 320,
                objectFit: 'cover',
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Testimonios y Calificación */}
      <Box sx={{ mb: 7, textAlign: 'center' }}>
        <Typography variant="overline" sx={{ fontWeight: 800, color: '#39A900', letterSpacing: '0.1em' }}>
          OPINIONES DE NUESTROS VISITANTES
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0B3B36', mb: 1 }}>
          Reconocidos por la Calidad y Técnica
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 4 }}>
          <Rating value={5} readOnly precision={0.5} sx={{ color: '#F59E0B' }} />
          <Typography variant="body2" sx={{ fontWeight: 800, color: '#0F172A' }}>
            4.9 de 5.0 en Experiencias Formativas
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: '100%', border: '1px solid #E2E8F0', textAlign: 'left' }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#334155', mb: 2 }}>
                "Una experiencia gastronómica de primer nivel. El solomillo de cerdo con glaseado de café fue sencillamente memorable. Felicitaciones a los aprendices."
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0B3B36' }}>
                Dra. Patricia Salazar
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Visitante Institucional
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: '100%', border: '1px solid #E2E8F0', textAlign: 'left' }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#334155', mb: 2 }}>
                "El servicio del capitán y los aprendices meseros es impecable. Todo muy ordenado, el ceviche de trucha es una joya regional."
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0B3B36' }}>
                Ing. Fernando Castro
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Comensal Frecuente
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: '100%', border: '1px solid #E2E8F0', textAlign: 'left' }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#334155', mb: 2 }}>
                "Poder reservar por la web y recibir la confirmación inmediata en WhatsApp hace todo facilísimo. Excelente iniciativa tecnológica del SENA."
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0B3B36' }}>
                Carolina Gómez
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Empresaria del Sector Turismo
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Ubicación e Información de Contacto */}
      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: '1px solid #E2E8F0', bgcolor: '#F8FAFC', borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationOnIcon sx={{ color: '#0B3B36' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                Ubicación del Restaurante Escuela
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              SENA Centro de Comercio y Servicios • Regional Risaralda
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
              Carrera 8 # 26-79, Pereira, Risaralda, Colombia.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Servicio pedagógico sujeto a disponibilidad y calendario académico.
            </Typography>
          </Grid>

          <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Button
              variant="outlined"
              startIcon={<LocationOnIcon />}
              onClick={() => window.open('https://maps.google.com/?q=SENA+Risaralda+Pereira', '_blank')}
              sx={{ borderColor: '#CBD5E1', color: '#0F172A', fontWeight: 700, mr: 1, mb: 1 }}
            >
              Ver en Google Maps
            </Button>
            <Button
              component={RouterLink}
              to="/reservar"
              variant="contained"
              sx={{ bgcolor: '#0B3B36', fontWeight: 700, mb: 1 }}
            >
              Apartar Mesa
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
