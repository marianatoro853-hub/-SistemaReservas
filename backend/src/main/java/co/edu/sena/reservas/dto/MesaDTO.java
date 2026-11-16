package co.edu.sena.reservas.dto;

import lombok.*;

/**
 * DTO para transferir información de mesas al cliente.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MesaDTO {
    private Long id;
    private Integer numero;
    private Integer capacidad;
    private String ubicacion;
}
