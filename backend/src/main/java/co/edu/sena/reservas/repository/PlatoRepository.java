package co.edu.sena.reservas.repository;

import co.edu.sena.reservas.model.Plato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio Spring Data JPA para la entidad Plato.
 */
@Repository
public interface PlatoRepository extends JpaRepository<Plato, Long> {

    List<Plato> findByCategoriaOrderByNombreAsc(String categoria);

    List<Plato> findByDisponibleTrueOrderByCategoriaAscNombreAsc();
}
