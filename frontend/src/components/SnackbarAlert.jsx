import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function SnackbarAlert({ open, message, severity, onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4500}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity || 'info'}
        variant="filled"
        sx={{ width: '100%', borderRadius: 2, fontWeight: 500 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
