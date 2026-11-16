package co.edu.sena.reservas.service;

import co.edu.sena.reservas.dto.MesaDTO;
import co.edu.sena.reservas.model.Mesa;
import co.edu.sena.reservas.repository.MesaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de negocio para la gestión de mesas.
 */
@Service
@RequiredArgsConstructor
public class MesaService {

    private final MesaRepository mesaRepository;

    @Transactional(readOnly = true)
    public List<MesaDTO> findAll() {
        return mesaRepository.findAllByOrderByNumeroAsc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public MesaDTO mapToDTO(Mesa mesa) {
        if (mesa == null) return null;
        return MesaDTO.builder()
                .id(mesa.getId())
                .numero(mesa.getNumero())
                .capacidad(mesa.getCapacidad())
                .ubicacion(mesa.getUbicacion())
                .build();
    }
}
