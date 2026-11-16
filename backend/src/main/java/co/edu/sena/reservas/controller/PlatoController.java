package co.edu.sena.reservas.controller;

import co.edu.sena.reservas.dto.PlatoDTO;
import co.edu.sena.reservas.service.PlatoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión de la carta gastronómica y precios del restaurante escuela.
 */
@RestController
@RequestMapping("/api/platos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PlatoController {

    private final PlatoService platoService;

    @GetMapping
    public ResponseEntity<List<PlatoDTO>> listarPlatos() {
        return ResponseEntity.ok(platoService.findAll());
    }

    @PostMapping
    public ResponseEntity<PlatoDTO> crearPlato(@Valid @RequestBody PlatoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(platoService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlatoDTO> actualizarPlato(@PathVariable Long id, @Valid @RequestBody PlatoDTO dto) {
        return ResponseEntity.ok(platoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPlato(@PathVariable Long id) {
        platoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/disponibilidad")
    public ResponseEntity<PlatoDTO> cambiarDisponibilidad(@PathVariable Long id) {
        return ResponseEntity.ok(platoService.toggleDisponibilidad(id));
    }
}
