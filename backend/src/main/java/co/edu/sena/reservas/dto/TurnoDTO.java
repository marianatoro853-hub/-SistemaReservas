package co.edu.sena.reservas.dto;

import lombok.*;

import java.time.LocalTime;

/**
 * DTO para transferir información de turnos al cliente.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TurnoDTO {
    private Long id;
    private String nombre;
    private LocalTime horaInicio;
    private LocalTime horaFin;
}
