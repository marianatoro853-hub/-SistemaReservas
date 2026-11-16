package co.edu.sena.reservas.controller;

import co.edu.sena.reservas.dto.TurnoDTO;
import co.edu.sena.reservas.service.TurnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controlador REST para el catálogo de turnos de servicio.
 */
@RestController
@RequestMapping("/api/turnos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TurnoController {

    private final TurnoService turnoService;

    @GetMapping
    public ResponseEntity<List<TurnoDTO>> listarTurnos() {
        return ResponseEntity.ok(turnoService.findAll());
    }
}
