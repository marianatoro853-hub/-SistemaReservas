import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Tabs,
  Tab,
  Chip,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockIcon from '@mui/icons-material/Block';
import { getPlatosCarta, formatearPrecioCOP } from '../services/menuService';

const CATEGORIAS_CARTA = [
  'Todos',
  'Entradas de Autor',
  'Platos Fuertes',
  'Repostería & Postres',
  'Cafetería & Bebidas',
];

export default function MenuDiario() {
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [platos, setPlatos] = useState(getPlatosCarta);

  useEffect(() => {
    const handleActualizacion = () => {
      setPlatos(getPlatosCarta());
    };

    window.addEventListener('sena_carta_actualizada', handleActualizacion);
    return () => {
      window.removeEventListener('sena_carta_actualizada', handleActualizacion);
    };
  }, []);

  const platosFiltrados = platos.filter((p) => {
    if (categoriaSeleccionada === 'Todos') return true;
    return p.categoria === categoriaSeleccionada;
  });

  const handleReservarPlato = (plato) => {
    localStorage.setItem('sena_plato_preseleccionado', plato.nombre);
    navigate('/reservar');
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      {/* Encabezado */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="overline" sx={{ fontWeight: 800, color: '#39A900', letterSpacing: '0.12em' }}>
          CARTA GASTRONÓMICA OFICIAL • TEMPORADA
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#0B3B36', mb: 1.5, fontSize: { xs: '2rem', md: '2.8rem' } }}>
          Menú Pedagógico de Alta Cocina
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', lineHeight: 1.6 }}>
          Elaborado por aprendices e instructores del Centro de Comercio y Servicios. Cada plato refleja técnicas culinarias internacionales aplicadas a ingredientes del Paisaje Cultural Cafetero.
        </Typography>
      </Box>

      {/* Banner de Servicio Pedagógico */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2.5,
          bgcolor: '#FFFFFF',
          border: '1px solid #E2E8F0',
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
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: 'rgba(11, 59, 54, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0B3B36',
            }}
          >
            <RestaurantMenuIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
              Carta Dinámica y Ajustada en Cocina
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Los precios y la disponibilidad son gestionados en tiempo real por el equipo de cocina pedagógica.
            </Typography>
          </Box>
        </Box>

        <Button
          component={RouterLink}
          to="/reservar"
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            bgcolor: '#0B3B36',
            fontWeight: 700,
            py: 1.2,
            px: 3,
            borderRadius: '8px',
            '&:hover': { bgcolor: '#175E56' },
          }}
        >
          Apartar Mesa en la Escuela
        </Button>
      </Paper>

      {/* Filtro por Categorías */}
      <Box sx={{ borderBottom: 1, borderColor: '#E2E8F0', mb: 4 }}>
        <Tabs
          value={categoriaSeleccionada}
          onChange={(_, valor) => setCategoriaSeleccionada(valor)}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 700,
              fontSize: '0.92rem',
              color: '#64748B',
              py: 1.5,
              '&.Mui-selected': { color: '#0B3B36' },
            },
            '& .MuiTabs-indicator': { backgroundColor: '#0B3B36', height: 3 },
          }}
        >
          {CATEGORIAS_CARTA.map((cat) => (
            <Tab key={cat} label={cat} value={cat} />
          ))}
        </Tabs>
      </Box>

      {/* Grid de Platos Gourmet con Fotografía de Alta Definición */}
      <Grid container spacing={3.5}>
        {platosFiltrados.map((plato) => (
          <Grid item xs={12} sm={6} lg={4} key={plato.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #E2E8F0',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.25s ease-in-out',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)',
                  borderColor: '#CBD5E1',
                  '& .plato-imagen': {
                    transform: 'scale(1.05)',
                  },
                },
              }}
            >
              {/* Imagen con Efecto Hover */}
              <Box sx={{ overflow: 'hidden', position: 'relative', height: 210 }}>
                <CardMedia
                  component="img"
                  height="210"
                  image={plato.imagen}
                  alt={plato.nombre}
                  className="plato-imagen"
                  sx={{
                    transition: 'transform 0.4s ease-in-out',
                    objectFit: 'cover',
                    filter: plato.disponible ? 'none' : 'grayscale(70%)',
                  }}
                />

                {/* Badge flotante */}
                <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                  <Chip
                    label={plato.badge}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(11, 59, 54, 0.92)',
                      color: '#FFFFFF',
                      backdropFilter: 'blur(4px)',
                      fontWeight: 800,
                      fontSize: '0.72rem',
                      borderRadius: '6px',
                    }}
                  />
                </Box>

                {!plato.disponible && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      bgcolor: 'rgba(15, 23, 42, 0.65)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      backdropFilter: 'blur(2px)',
                    }}
                  >
                    <Chip
                      icon={<BlockIcon />}
                      label="Agotado en este servicio"
                      sx={{ bgcolor: '#BE123C', color: '#FFFFFF', fontWeight: 800 }}
                    />
                  </Box>
                )}
              </Box>

              <CardContent sx={{ p: 3, flexGrow: 1 }}>
                <Typography variant="caption" sx={{ color: '#39A900', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {plato.categoria}
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mt: 0.5, lineHeight: 1.25, fontSize: '1.1rem' }}>
                  {plato.nombre}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ my: 1.5, lineHeight: 1.6, minHeight: 64 }}>
                  {plato.descripcion}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                    Tarifa Formativa
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0B3B36' }}>
                    {formatearPrecioCOP(plato.precio)}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  disabled={!plato.disponible}
                  onClick={() => handleReservarPlato(plato)}
                  sx={{
                    borderColor: '#0B3B36',
                    color: '#0B3B36',
                    fontWeight: 700,
                    borderRadius: '8px',
                    '&:hover': {
                      bgcolor: '#0B3B36',
                      color: '#FFFFFF',
                      borderColor: '#0B3B36',
                    },
                  }}
                >
                  {plato.disponible ? 'Elegir para mi Reserva' : 'No disponible hoy'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
