import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingSpinner({ message = 'Cargando datos...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
      }}
    >
      <CircularProgress color="primary" size={44} thickness={4} />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  );
}
