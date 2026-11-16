import React from 'react';
import { Box } from '@mui/material';

/**
 * Componente con el símbolo oficial vectorial del SENA (Servicio Nacional de Aprendizaje).
 * Renderizado en SVG para máxima nitidez y profesionalismo.
 */
export default function SenaLogo({ width = 36, height = 36, color = '#39A900' }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 100 100"
      sx={{ width, height, display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Círculo superior (cabeza del aprendiz) */}
      <circle cx="50" cy="18" r="10" fill={color} />
      
      {/* Cuerpo y dinámica de los brazos y caminos */}
      <path
        d="M 50,33 
           L 44,46 
           L 26,46 
           L 38,55 
           L 32,75 
           L 50,62 
           L 68,75 
           L 62,55 
           L 74,46 
           L 56,46 
           Z"
        fill={color}
      />
      {/* Base estilizada de soporte */}
      <rect x="22" y="80" width="56" height="6" rx="3" fill={color} />
      <rect x="30" y="89" width="40" height="4" rx="2" fill={color} />
    </Box>
  );
}
