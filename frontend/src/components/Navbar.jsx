import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SenaLogo from './SenaLogo';

const navItems = [
  { label: 'Inicio', path: '/', icon: <HomeIcon /> },
  { label: 'Reservar Mesa', path: '/reservar', icon: <AddCircleOutlineIcon /> },
  { label: 'Mis Reservas', path: '/mis-reservas', icon: <BookmarkBorderIcon /> },
  { label: 'Menú Gastronómico', path: '/menu', icon: <RestaurantMenuIcon /> },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isAdminRoute = location.pathname === '/admin';

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: '#0B3B36', // Verde Esmeralda Institucional SENA Profundo
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: 74 }}>
            {/* Logo e Identidad SENA Oficial */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.8,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  p: 0.8,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                <SenaLogo width={30} height={30} color="#39A900" />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '1rem', sm: '1.15rem' },
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Escuela Gastronómica
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontSize: '0.68rem',
                  }}
                >
                  SENA Regional Risaralda
                </Typography>
              </Box>
            </Box>

            {/* Enlaces Desktop (SPA sin recargas) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.82)',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                      fontWeight: isActive ? 700 : 500,
                      px: 2,
                      py: 0.9,
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.18)',
                        color: '#FFFFFF',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}

              <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: 'rgba(255,255,255,0.15)' }} />

              {/* Botón exclusivo para Instructor Líder */}
              <Button
                component={RouterLink}
                to="/admin"
                startIcon={<AdminPanelSettingsIcon />}
                variant={isAdminRoute ? 'contained' : 'outlined'}
                sx={{
                  backgroundColor: isAdminRoute ? '#39A900' : 'transparent',
                  color: '#FFFFFF',
                  borderColor: isAdminRoute ? '#39A900' : 'rgba(255, 255, 255, 0.35)',
                  fontWeight: 700,
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: isAdminRoute ? '#277500' : 'rgba(255, 255, 255, 0.1)',
                    borderColor: '#FFFFFF',
                  },
                }}
              >
                Panel Instructor
              </Button>
            </Box>

            {/* Menú Móvil */}
            <IconButton
              color="inherit"
              aria-label="abrir menú"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer Móvil */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { width: 280, bgcolor: '#FFFFFF' } }}
      >
        <Box sx={{ p: 2.5, borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SenaLogo width={28} height={28} color="#39A900" />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0B3B36' }}>
              Escuela Gastronómica
            </Typography>
            <Typography variant="caption" color="text.secondary">
              SENA Risaralda
            </Typography>
          </Box>
        </Box>
        <List sx={{ pt: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(11, 59, 54, 0.08)',
                      color: '#0B3B36',
                      '& .MuiListItemIcon-root': { color: '#0B3B36' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38, color: isActive ? '#0B3B36' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.95rem' }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}

          <Divider sx={{ my: 1.5 }} />

          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/admin"
              onClick={() => setMobileOpen(false)}
              selected={isAdminRoute}
              sx={{
                bgcolor: isAdminRoute ? '#0B3B36' : 'rgba(57, 169, 0, 0.08)',
                color: isAdminRoute ? '#FFFFFF' : '#0B3B36',
                mx: 1,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: isAdminRoute ? '#0B3B36' : 'rgba(57, 169, 0, 0.15)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: isAdminRoute ? '#FFFFFF' : '#39A900' }}>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Panel Instructor"
                secondary="Descarga PDF & Reportes"
                primaryTypographyProps={{ fontWeight: 700, fontSize: '0.95rem' }}
                secondaryTypographyProps={{ fontSize: '0.75rem', color: isAdminRoute ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
