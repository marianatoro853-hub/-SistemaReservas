package co.edu.sena.reservas.dto;

import co.edu.sena.reservas.model.EstadoReserva;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO para la respuesta con datos detallados de una reserva.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservaResponseDTO {
    private Long id;
    private String clienteNombre;
    private String clienteTelefono;
    private String clienteEmail;
    private LocalDate fecha;
    private TurnoDTO turno;
    private MesaDTO mesa;
    private Integer comensales;
    private String tipoConsumo;
    private String preferenciaDietaria;
    private String menuSeleccionado;
    private String observaciones;
    private EstadoReserva estado;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
