package co.edu.sena.reservas.repository;

import co.edu.sena.reservas.model.EstadoReserva;
import co.edu.sena.reservas.model.Reserva;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repositorio Spring Data JPA para la entidad Reserva.
 */
@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    /**
     * Busca las reservas activas (no canceladas) para una fecha y turno dados.
     */
    List<Reserva> findByFechaAndTurnoIdAndEstadoNot(LocalDate fecha, Long turnoId, EstadoReserva estado);

    /**
     * Verifica si una mesa ya está ocupada en una fecha y turno determinados por una reserva activa.
     */
    boolean existsByFechaAndTurnoIdAndMesaIdAndEstadoNot(LocalDate fecha, Long turnoId, Long mesaId, EstadoReserva estado);

    /**
     * Obtiene las reservas filtradas por teléfono del cliente con paginación ordenada.
     */
    Page<Reserva> findByClienteTelefonoOrderByFechaDescCreatedAtDesc(String clienteTelefono, Pageable pageable);

    /**
     * Obtiene todas las reservas con paginación ordenada de forma descendente.
     */
    Page<Reserva> findAllByOrderByFechaDescCreatedAtDesc(Pageable pageable);
}
