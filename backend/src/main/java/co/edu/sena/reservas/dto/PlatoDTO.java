package co.edu.sena.reservas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;

/**
 * DTO para la transferencia y validación de platos de la carta.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatoDTO {
    private Long id;

    @NotBlank(message = "El nombre del plato es obligatorio")
    private String nombre;

    @NotBlank(message = "La categoría del plato es obligatoria")
    private String categoria;

    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser un valor positivo")
    private BigDecimal precio;

    private Boolean disponible;

    private String badge;

    private String imagen;
}
