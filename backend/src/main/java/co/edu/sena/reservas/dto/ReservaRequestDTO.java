package co.edu.sena.reservas.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

/**
 * DTO para la petición de creación de una reserva.
 * Incluye preferencias dietarias, tipo de consumo y menú.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservaRequestDTO {

    @NotBlank(message = "El nombre del cliente es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String clienteNombre;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^[0-9]{10}$", message = "El teléfono debe tener exactamente 10 dígitos numéricos")
    private String clienteTelefono;

    @Email(message = "El correo electrónico no tiene un formato válido")
    private String clienteEmail;

    @NotNull(message = "La fecha de reserva es obligatoria")
    @FutureOrPresent(message = "La fecha de reserva no puede ser anterior al día de hoy")
    private LocalDate fecha;

    @NotNull(message = "Debe seleccionar un turno")
    private Long turnoId;

    @NotNull(message = "Debe seleccionar una mesa")
    private Long mesaId;

    @NotNull(message = "El número de comensales es obligatorio")
    @Min(value = 1, message = "Debe reservar para al menos 1 comensal")
    @Max(value = 20, message = "El número máximo permitido por reserva es de 20 comensales")
    private Integer comensales;

    private String tipoConsumo; // "En Sitio" o "Para Llevar"

    private String preferenciaDietaria; // Alergias, vegetariana, etc.

    private String menuSeleccionado; // Nombre del plato de la carta

    @Size(max = 500, message = "Las observaciones no pueden superar los 500 caracteres")
    private String observaciones;
}
