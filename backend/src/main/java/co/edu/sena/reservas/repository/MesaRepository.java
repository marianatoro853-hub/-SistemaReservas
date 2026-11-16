package co.edu.sena.reservas.repository;

import co.edu.sena.reservas.model.Mesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio Spring Data JPA para la entidad Mesa.
 */
@Repository
public interface MesaRepository extends JpaRepository<Mesa, Long> {

    List<Mesa> findAllByOrderByNumeroAsc();
}
