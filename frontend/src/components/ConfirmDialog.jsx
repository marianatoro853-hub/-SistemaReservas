/**
 * Ventana de confirmación reutilizable (por ejemplo, para cancelar una reserva).
 * Props: abierto, titulo, mensaje, textoConfirmar, onConfirmar, onCerrar
 */
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function ConfirmDialog({ abierto, titulo, mensaje, textoConfirmar = 'Confirmar', onConfirmar, onCerrar }) {
  return (
    <Dialog open={abierto} onClose={onCerrar} aria-labelledby="titulo-confirmacion">
      <DialogTitle id="titulo-confirmacion">{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText>{mensaje}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCerrar}>Volver</Button>
        <Button onClick={onConfirmar} color="error" variant="contained">
          {textoConfirmar}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
