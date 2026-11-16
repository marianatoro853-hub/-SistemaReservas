package co.edu.sena.reservas.dto;

import co.edu.sena.reservas.model.Reserva;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Datos de una reserva que la API devuelve al front-end.
 * Se aplana (turnoId, mesaId) para que React lo consuma fácilmente.
 */
public record ReservaResponse(
        Long id,
        String nombreCliente,
        String telefono,
        LocalDate fechaReserva,
        Long turnoId,
        Long mesaId,
        int numComensales,
        String tipoConsumo,
        List<String> preferenciasDietarias,
        String estado,
        LocalDateTime fechaCreacion) {

    /** Convierte la entidad en el objeto de respuesta. */
    public static ReservaResponse desde(Reserva r) {
        return new ReservaResponse(
                r.getId(),
                r.getNombreCliente(),
                r.getTelefono(),
                r.getFechaReserva(),
                r.getTurno().getId(),
                r.getMesa().getId(),
                r.getNumComensales(),
                r.getTipoConsumo(),
                new ArrayList<>(r.getPreferenciasDietarias()),
                r.getEstado().getEtiqueta(),
                r.getFechaCreacion());
    }
}
