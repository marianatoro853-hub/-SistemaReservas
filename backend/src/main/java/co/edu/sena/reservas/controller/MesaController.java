package co.edu.sena.reservas.controller;

import co.edu.sena.reservas.dto.MesaDTO;
import co.edu.sena.reservas.service.MesaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controlador REST para el catálogo de mesas.
 */
@RestController
@RequestMapping("/api/mesas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MesaController {

    private final MesaService mesaService;

    @GetMapping
    public ResponseEntity<List<MesaDTO>> listarMesas() {
        return ResponseEntity.ok(mesaService.findAll());
    }
}
