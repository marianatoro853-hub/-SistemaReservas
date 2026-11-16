package co.edu.sena.reservas.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Entidad que representa un plato de la carta gastronómica del restaurante escuela.
 */
@Entity
@Table(name = "platos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Plato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false, length = 50)
    private String categoria; // "Entradas de Autor", "Platos Fuertes", "Repostería & Postres", "Cafetería & Bebidas"

    @Column(length = 600)
    private String descripcion;

    @Column(nullable = false)
    private BigDecimal precio;

    @Column(nullable = false)
    private Boolean disponible;

    @Column(length = 50)
    private String badge;

    @Column(length = 500)
    private String imagen;
}
