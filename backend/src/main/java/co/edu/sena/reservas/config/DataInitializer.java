package co.edu.sena.reservas.config;

import co.edu.sena.reservas.model.Mesa;
import co.edu.sena.reservas.model.Plato;
import co.edu.sena.reservas.model.Turno;
import co.edu.sena.reservas.repository.MesaRepository;
import co.edu.sena.reservas.repository.PlatoRepository;
import co.edu.sena.reservas.repository.TurnoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

/**
 * Inicializador automático de datos semilla para el entorno de la Escuela Gastronómica.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final TurnoRepository turnoRepository;
    private final MesaRepository mesaRepository;
    private final PlatoRepository platoRepository;

    @Override
    public void run(String... args) {
        inicializarTurnos();
        inicializarMesas();
        inicializarPlatos();
    }

    private void inicializarTurnos() {
        if (turnoRepository.count() == 0) {
            log.info("Inicializando turnos de atención del restaurante escuela...");
            List<Turno> turnos = Arrays.asList(
                    Turno.builder().nombre("Desayuno Gourmet").horaInicio(LocalTime.of(7, 0)).horaFin(LocalTime.of(10, 0)).build(),
                    Turno.builder().nombre("Almuerzo Degustación").horaInicio(LocalTime.of(12, 0)).horaFin(LocalTime.of(15, 0)).build(),
                    Turno.builder().nombre("Cena Pedagógica").horaInicio(LocalTime.of(18, 0)).horaFin(LocalTime.of(21, 0)).build()
            );
            turnoRepository.saveAll(turnos);
            log.info("Se han registrado {} turnos con éxito.", turnos.size());
        }
    }

    private void inicializarMesas() {
        if (mesaRepository.count() == 0) {
            log.info("Inicializando mesas físicas del restaurante escuela...");
            List<Mesa> mesas = Arrays.asList(
                    Mesa.builder().numero(1).capacidad(2).ubicacion("Terraza Panorámica").build(),
                    Mesa.builder().numero(2).capacidad(2).ubicacion("Terraza Panorámica").build(),
                    Mesa.builder().numero(3).capacidad(4).ubicacion("Salón Principal").build(),
                    Mesa.builder().numero(4).capacidad(4).ubicacion("Salón Principal").build(),
                    Mesa.builder().numero(5).capacidad(6).ubicacion("Jardín Interior").build(),
                    Mesa.builder().numero(6).capacidad(6).ubicacion("Jardín Interior").build(),
                    Mesa.builder().numero(7).capacidad(8).ubicacion("Zona Gourmet").build(),
                    Mesa.builder().numero(8).capacidad(10).ubicacion("Zona VIP (Mesa Presidencial)").build()
            );
            mesaRepository.saveAll(mesas);
            log.info("Se han registrado {} mesas con éxito.", mesas.size());
        }
    }

    private void inicializarPlatos() {
        if (platoRepository.count() == 0) {
            log.info("Inicializando carta gastronómica de platos de autor...");
            List<Plato> platos = Arrays.asList(
                    Plato.builder()
                            .nombre("Solomillo de Cerdo en Glaseado de Café Especial")
                            .categoria("Platos Fuertes")
                            .descripcion("Medallón sellado a fuego vivo con reducción demi-glace de café Geisha y uchuvas silvestres, con mousseline de yuca al cilantro.")
                            .precio(new BigDecimal("32000"))
                            .disponible(true)
                            .badge("Recomendado del Chef")
                            .imagen("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80")
                            .build(),
                    Plato.builder()
                            .nombre("Ceviche de Trucha Risaraldense con Maíz Chulpi")
                            .categoria("Entradas de Autor")
                            .descripcion("Trucha fresca marinada en cítricos regionales, maíz chulpi crocante, mousse de aguacate hass y chips de plátano verde.")
                            .precio(new BigDecimal("18000"))
                            .disponible(true)
                            .badge("Plato Insignia")
                            .imagen("https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80")
                            .build(),
                    Plato.builder()
                            .nombre("Suprema Campesina en Costra de Finas Hierbas")
                            .categoria("Platos Fuertes")
                            .descripcion("Pechuga de ave de pastoreo con hierbas del huerto SENA, risotto de quinua perlada y vegetales de estación.")
                            .precio(new BigDecimal("28000"))
                            .disponible(true)
                            .badge("Técnica Clásica")
                            .imagen("https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80")
                            .build()
            );
            platoRepository.saveAll(platos);
            log.info("Se han registrado {} platos base en la carta.", platos.size());
        }
    }
}
