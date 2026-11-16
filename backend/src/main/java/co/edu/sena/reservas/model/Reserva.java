package co.edu.sena.reservas.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidad principal de Reserva de mesa en la Escuela Gastronómica SENA.
 * Incluye datos dietarios, tipo de consumo y menú seleccionado.
 */
@Entity
@Table(name = "reservas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cliente_nombre", nullable = false, length = 100)
    private String clienteNombre;

    @Column(name = "cliente_telefono", nullable = false, length = 15)
    private String clienteTelefono;

    @Column(name = "cliente_email", length = 100)
    private String clienteEmail;

    @Column(nullable = false)
    private LocalDate fecha;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "turno_id", nullable = false)
    private Turno turno;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mesa_id", nullable = false)
    private Mesa mesa;

    @Column(nullable = false)
    private Integer comensales;

    @Column(name = "tipo_consumo", length = 30)
    private String tipoConsumo; // "En Sitio" o "Para Llevar"

    @Column(name = "preferencia_dietaria", length = 100)
    private String preferenciaDietaria; // Alergias, vegetariano, etc.

    @Column(name = "menu_seleccionado", length = 150)
    private String menuSeleccionado;

    @Column(length = 500)
    private String observaciones;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoReserva estado;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = EstadoReserva.CONFIRMADA;
        }
        if (this.tipoConsumo == null) {
            this.tipoConsumo = "En Sitio";
        }
        if (this.preferenciaDietaria == null) {
            this.preferenciaDietaria = "Estándar (Sin restricciones)";
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
