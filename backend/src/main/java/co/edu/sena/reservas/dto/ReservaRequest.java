package co.edu.sena.reservas.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

/**
 * Datos que envía el front-end para crear una reserva.
 * Las anotaciones validan la información antes de llegar a la lógica de negocio.
 */
public record ReservaRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 3, max = 120, message = "El nombre debe tener entre 3 y 120 caracteres")
        String nombreCliente,

        @NotBlank(message = "El teléfono es obligatorio")
        @Pattern(regexp = "\\d{10}", message = "El teléfono debe tener 10 dígitos")
        String telefono,

        @NotNull(message = "La fecha es obligatoria")
        @FutureOrPresent(message = "La fecha no puede ser anterior a hoy")
        LocalDate fechaReserva,

        @NotNull(message = "El turno es obligatorio")
        Long turnoId,

        @NotNull(message = "La mesa es obligatoria")
        Long mesaId,

        @NotNull(message = "El número de comensales es obligatorio")
        @Min(value = 1, message = "Debe haber al menos 1 comensal")
        @Max(value = 12, message = "El máximo es 12 comensales")
        Integer numComensales,

        @NotBlank(message = "El tipo de consumo es obligatorio")
        String tipoConsumo,

        List<String> preferenciasDietarias) {
}
