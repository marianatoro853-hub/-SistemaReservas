package co.edu.sena.reservas.repository;

import co.edu.sena.reservas.model.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio Spring Data JPA para la entidad Turno.
 */
@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {
}
