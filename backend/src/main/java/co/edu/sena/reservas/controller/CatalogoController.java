package co.edu.sena.reservas.controller;

import co.edu.sena.reservas.model.Mesa;
import co.edu.sena.reservas.model.Turno;
import co.edu.sena.reservas.repository.MesaRepository;
import co.edu.sena.reservas.repository.TurnoRepository;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Catálogos de solo lectura: mesas y turnos disponibles.
 *   GET /api/mesas
 *   GET /api/turnos
 */
@RestController
@RequestMapping("/api")
public class CatalogoController {

    private final MesaRepository mesas;
    private final TurnoRepository turnos;

    public CatalogoController(MesaRepository mesas, TurnoRepository turnos) {
        this.mesas = mesas;
        this.turnos = turnos;
    }

    @GetMapping("/mesas")
    public List<Mesa> mesas() {
        return mesas.findAllByOrderByNumeroAsc();
    }

    @GetMapping("/turnos")
    public List<Turno> turnos() {
        return turnos.findAllByOrderByHoraInicioAsc();
    }
}
