package co.edu.sena.reservas.service;

import co.edu.sena.reservas.dto.TurnoDTO;
import co.edu.sena.reservas.model.Turno;
import co.edu.sena.reservas.repository.TurnoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de negocio para la gestión de turnos.
 */
@Service
@RequiredArgsConstructor
public class TurnoService {

    private final TurnoRepository turnoRepository;

    @Transactional(readOnly = true)
    public List<TurnoDTO> findAll() {
        return turnoRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TurnoDTO mapToDTO(Turno turno) {
        if (turno == null) return null;
        return TurnoDTO.builder()
                .id(turno.getId())
                .nombre(turno.getNombre())
                .horaInicio(turno.getHoraInicio())
                .horaFin(turno.getHoraFin())
                .build();
    }
}
