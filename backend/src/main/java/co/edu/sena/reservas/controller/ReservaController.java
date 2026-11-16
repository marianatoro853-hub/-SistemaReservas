package co.edu.sena.reservas.controller;

import co.edu.sena.reservas.dto.ReservaRequestDTO;
import co.edu.sena.reservas.dto.ReservaResponseDTO;
import co.edu.sena.reservas.service.ReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Controlador REST principal para la gestión del ciclo de vida de Reservas.
 */
@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

    /**
     * Consulta reservas paginadas, con filtro opcional por teléfono de cliente.
     */
    @GetMapping
    public ResponseEntity<Page<ReservaResponseDTO>> listarReservas(
            @PageableDefault(size = 10) Pageable pageable,
            @RequestParam(required = false) String clienteTelefono
    ) {
        return ResponseEntity.ok(reservaService.listarReservas(pageable, clienteTelefono));
    }

    /**
     * Registra una nueva reserva con validación Bean Validation.
     */
    @PostMapping
    public ResponseEntity<ReservaResponseDTO> crearReserva(@Valid @RequestBody ReservaRequestDTO dto) {
        ReservaResponseDTO creada = reservaService.crearReserva(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    /**
     * Cancela una reserva existente mediante PATCH (recomendación semántica).
     */
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<ReservaResponseDTO> cancelarReservaPatch(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.cancelarReserva(id));
    }

    /**
     * Realiza el Check-in: comensales llegaron a la mesa (Estado COMPLETADA).
     */
    @PatchMapping("/{id}/completar")
    public ResponseEntity<ReservaResponseDTO> completarReserva(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.completarReserva(id));
    }

    /**
     * Compatibilidad hacia atrás: Cancela una reserva mediante PUT.
     */
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<ReservaResponseDTO> cancelarReservaPut(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.cancelarReserva(id));
    }

    /**
     * Devuelve los identificadores de mesas ocupadas para una fecha y turno dados.
     */
    @GetMapping("/mesas-ocupadas")
    public ResponseEntity<List<Long>> obtenerMesasOcupadas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam Long turnoId
    ) {
        return ResponseEntity.ok(reservaService.obtenerMesasOcupadas(fecha, turnoId));
    }
}
