package co.edu.sena.reservas.service;

import co.edu.sena.reservas.dto.ReservaRequestDTO;
import co.edu.sena.reservas.dto.ReservaResponseDTO;
import co.edu.sena.reservas.exception.ReservaException;
import co.edu.sena.reservas.exception.ResourceNotFoundException;
import co.edu.sena.reservas.model.EstadoReserva;
import co.edu.sena.reservas.model.Mesa;
import co.edu.sena.reservas.model.Reserva;
import co.edu.sena.reservas.model.Turno;
import co.edu.sena.reservas.repository.MesaRepository;
import co.edu.sena.reservas.repository.ReservaRepository;
import co.edu.sena.reservas.repository.TurnoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de negocio principal para la gestión y validación de reservas.
 */
@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final MesaRepository mesaRepository;
    private final TurnoRepository turnoRepository;
    private final MesaService mesaService;
    private final TurnoService turnoService;

    /**
     * Registra una nueva reserva validando todas las reglas de negocio.
     */
    @Transactional
    public ReservaResponseDTO crearReserva(ReservaRequestDTO dto) {
        // Regla 1: Validar fecha no anterior al día actual
        if (dto.getFecha().isBefore(LocalDate.now())) {
            throw new ReservaException("No se pueden realizar reservas para fechas pasadas.");
        }

        // Regla 2: Validar existencia de la mesa
        Mesa mesa = mesaRepository.findById(dto.getMesaId())
                .orElseThrow(() -> new ResourceNotFoundException("La mesa con ID " + dto.getMesaId() + " no existe."));

        // Regla 3: Validar existencia del turno
        Turno turno = turnoRepository.findById(dto.getTurnoId())
                .orElseThrow(() -> new ResourceNotFoundException("El turno con ID " + dto.getTurnoId() + " no existe."));

        // Regla 4: Validar capacidad de la mesa
        if (dto.getComensales() > mesa.getCapacidad()) {
            throw new ReservaException("El número de comensales (" + dto.getComensales() +
                    ") supera la capacidad máxima de la mesa seleccionada (" + mesa.getCapacidad() + " personas).");
        }

        // Regla 5: Validar que la mesa no esté ya ocupada en la misma fecha y turno
        boolean ocupada = reservaRepository.existsByFechaAndTurnoIdAndMesaIdAndEstadoNot(
                dto.getFecha(),
                dto.getTurnoId(),
                dto.getMesaId(),
                EstadoReserva.CANCELADA
        );

        if (ocupada) {
            throw new ReservaException("La mesa #" + mesa.getNumero() + " ya se encuentra reservada para la fecha y turno seleccionados.");
        }

        // Construir y guardar la reserva con los nuevos datos dietarios y de servicio
        Reserva reserva = Reserva.builder()
                .clienteNombre(dto.getClienteNombre().trim())
                .clienteTelefono(dto.getClienteTelefono().trim())
                .clienteEmail(dto.getClienteEmail() != null ? dto.getClienteEmail().trim() : null)
                .fecha(dto.getFecha())
                .turno(turno)
                .mesa(mesa)
                .comensales(dto.getComensales())
                .tipoConsumo(dto.getTipoConsumo() != null ? dto.getTipoConsumo().trim() : "En Sitio")
                .preferenciaDietaria(dto.getPreferenciaDietaria() != null ? dto.getPreferenciaDietaria().trim() : "Estándar (Sin restricciones)")
                .menuSeleccionado(dto.getMenuSeleccionado() != null ? dto.getMenuSeleccionado().trim() : "Menú de Autor")
                .observaciones(dto.getObservaciones() != null ? dto.getObservaciones().trim() : null)
                .estado(EstadoReserva.CONFIRMADA)
                .build();

        Reserva guardada = reservaRepository.save(reserva);
        return mapToDTO(guardada);
    }

    /**
     * Lista las reservas con paginación, opcionalmente filtradas por número de teléfono.
     */
    @Transactional(readOnly = true)
    public Page<ReservaResponseDTO> listarReservas(Pageable pageable, String clienteTelefono) {
        Page<Reserva> pagina;
        if (clienteTelefono != null && !clienteTelefono.trim().isEmpty()) {
            pagina = reservaRepository.findByClienteTelefonoOrderByFechaDescCreatedAtDesc(clienteTelefono.trim(), pageable);
        } else {
            pagina = reservaRepository.findAllByOrderByFechaDescCreatedAtDesc(pageable);
        }
        return pagina.map(this::mapToDTO);
    }

    /**
     * Cancela una reserva existente (método idempotente y seguro).
     */
    @Transactional
    public ReservaResponseDTO cancelarReserva(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("La reserva con ID " + id + " no fue encontrada."));

        if (reserva.getEstado() == EstadoReserva.CANCELADA) {
            throw new ReservaException("La reserva #" + id + " ya se encuentra cancelada.");
        }

        reserva.setEstado(EstadoReserva.CANCELADA);
        Reserva actualizada = reservaRepository.save(reserva);
        return mapToDTO(actualizada);
    }

    /**
     * Realiza el Check-in de la reserva: marca como asistió / comensales en mesa (COMPLETADA).
     */
    @Transactional
    public ReservaResponseDTO completarReserva(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("La reserva con ID " + id + " no fue encontrada."));

        if (reserva.getEstado() == EstadoReserva.CANCELADA) {
            throw new ReservaException("No se puede completar una reserva que ya fue cancelada.");
        }

        reserva.setEstado(EstadoReserva.COMPLETADA);
        Reserva actualizada = reservaRepository.save(reserva);
        return mapToDTO(actualizada);
    }

    /**
     * Devuelve la lista de IDs de mesas ocupadas para una fecha y turno dados.
     */
    @Transactional(readOnly = true)
    public List<Long> obtenerMesasOcupadas(LocalDate fecha, Long turnoId) {
        return reservaRepository.findByFechaAndTurnoIdAndEstadoNot(fecha, turnoId, EstadoReserva.CANCELADA)
                .stream()
                .map(r -> r.getMesa().getId())
                .distinct()
                .collect(Collectors.toList());
    }

    /**
     * Transforma una entidad Reserva en su correspondiente DTO de respuesta.
     */
    public ReservaResponseDTO mapToDTO(Reserva reserva) {
        if (reserva == null) return null;
        return ReservaResponseDTO.builder()
                .id(reserva.getId())
                .clienteNombre(reserva.getClienteNombre())
                .clienteTelefono(reserva.getClienteTelefono())
                .clienteEmail(reserva.getClienteEmail())
                .fecha(reserva.getFecha())
                .turno(turnoService.mapToDTO(reserva.getTurno()))
                .mesa(mesaService.mapToDTO(reserva.getMesa()))
                .comensales(reserva.getComensales())
                .tipoConsumo(reserva.getTipoConsumo())
                .preferenciaDietaria(reserva.getPreferenciaDietaria())
                .menuSeleccionado(reserva.getMenuSeleccionado())
                .observaciones(reserva.getObservaciones())
                .estado(reserva.getEstado())
                .createdAt(reserva.getCreatedAt())
                .updatedAt(reserva.getUpdatedAt())
                .build();
    }
}
