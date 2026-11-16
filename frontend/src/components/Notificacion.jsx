/**
 * Mensaje emergente (Snackbar + Alert) para informar el resultado de una acción.
 * Props: mensaje (string vacío = oculto), tipo (success | error | info), onCerrar
 */
import { Alert, Snackbar } from '@mui/material';

export default function Notificacion({ mensaje, tipo = 'success', onCerrar }) {
  return (
    <Snackbar
      open={Boolean(mensaje)}
      autoHideDuration={5000}
      onClose={onCerrar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity={tipo} variant="filled" onClose={onCerrar} sx={{ width: '100%' }}>
        {mensaje}
      </Alert>
    </Snackbar>
  );
}
