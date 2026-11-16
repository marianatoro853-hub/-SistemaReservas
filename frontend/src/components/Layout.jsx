import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
      }}
    >
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1, py: { xs: 3, md: 5 } }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Escuela Gastronómica SENA Risaralda – Sistema de Gestión de Reservas
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Desarrollado con arquitectura SPA por <strong>Mariana Toro</strong> | Análisis y Desarrollo de Software
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
