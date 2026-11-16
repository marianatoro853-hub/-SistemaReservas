package co.edu.sena.reservas.service;

import co.edu.sena.reservas.dto.PlatoDTO;
import co.edu.sena.reservas.exception.ResourceNotFoundException;
import co.edu.sena.reservas.model.Plato;
import co.edu.sena.reservas.repository.PlatoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de negocio para la administración de platos de la carta.
 */
@Service
@RequiredArgsConstructor
public class PlatoService {

    private final PlatoRepository platoRepository;

    @Transactional(readOnly = true)
    public List<PlatoDTO> findAll() {
        return platoRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PlatoDTO create(PlatoDTO dto) {
        Plato plato = Plato.builder()
                .nombre(dto.getNombre().trim())
                .categoria(dto.getCategoria().trim())
                .descripcion(dto.getDescripcion() != null ? dto.getDescripcion().trim() : null)
                .precio(dto.getPrecio())
                .disponible(dto.getDisponible() != null ? dto.getDisponible() : true)
                .badge(dto.getBadge() != null ? dto.getBadge().trim() : "Recomendado")
                .imagen(dto.getImagen() != null ? dto.getImagen().trim() : null)
                .build();

        return mapToDTO(platoRepository.save(plato));
    }

    @Transactional
    public PlatoDTO update(Long id, PlatoDTO dto) {
        Plato plato = platoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("El plato con ID " + id + " no existe."));

        plato.setNombre(dto.getNombre().trim());
        plato.setCategoria(dto.getCategoria().trim());
        plato.setDescripcion(dto.getDescripcion() != null ? dto.getDescripcion().trim() : null);
        plato.setPrecio(dto.getPrecio());
        if (dto.getDisponible() != null) {
            plato.setDisponible(dto.getDisponible());
        }
        if (dto.getBadge() != null) {
            plato.setBadge(dto.getBadge().trim());
        }
        if (dto.getImagen() != null) {
            plato.setImagen(dto.getImagen().trim());
        }

        return mapToDTO(platoRepository.save(plato));
    }

    @Transactional
    public void delete(Long id) {
        if (!platoRepository.existsById(id)) {
            throw new ResourceNotFoundException("El plato con ID " + id + " no existe.");
        }
        platoRepository.deleteById(id);
    }

    @Transactional
    public PlatoDTO toggleDisponibilidad(Long id) {
        Plato plato = platoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("El plato con ID " + id + " no existe."));

        plato.setDisponible(!plato.getDisponible());
        return mapToDTO(platoRepository.save(plato));
    }

    public PlatoDTO mapToDTO(Plato plato) {
        if (plato == null) return null;
        return PlatoDTO.builder()
                .id(plato.getId())
                .nombre(plato.getNombre())
                .categoria(plato.getCategoria())
                .descripcion(plato.getDescripcion())
                .precio(plato.getPrecio())
                .disponible(plato.getDisponible())
                .badge(plato.getBadge())
                .imagen(plato.getImagen())
                .build();
    }
}
