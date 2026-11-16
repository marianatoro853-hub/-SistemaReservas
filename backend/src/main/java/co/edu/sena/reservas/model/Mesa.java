package co.edu.sena.reservas.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entidad que representa una mesa física en el restaurante escuela.
 */
@Entity
@Table(name = "mesas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer numero;

    @Column(nullable = false)
    private Integer capacidad;

    @Column(length = 100)
    private String ubicacion;
}
