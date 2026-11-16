package co.edu.sena.reservas.config;

import co.edu.sena.reservas.model.Mesa;
import co.edu.sena.reservas.model.Turno;
import co.edu.sena.reservas.repository.MesaRepository;
import co.edu.sena.reservas.repository.TurnoRepository;
import java.time.LocalTime;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Carga los turnos y las mesas iniciales la primera vez que arranca la aplicación.
 * El orden de inserción define los ids (1, 2, 3...) que usa el front-end.
 */
@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner cargarDatosIniciales(TurnoRepository turnos, MesaRepository mesas) {
        return args -> {
            if (turnos.count() == 0) {
                turnos.saveAll(List.of(
                        new Turno("Desayuno", LocalTime.of(7, 0), LocalTime.of(9, 0)),
                        new Turno("Almuerzo", LocalTime.of(12, 0), LocalTime.of(14, 0)),
                        new Turno("Cena", LocalTime.of(18, 0), LocalTime.of(20, 0))));
            }
            if (mesas.count() == 0) {
                mesas.saveAll(List.of(
                        new Mesa(1, 2, "Salón principal"),
                        new Mesa(2, 2, "Salón principal"),
                        new Mesa(3, 4, "Salón principal"),
                        new Mesa(4, 4, "Terraza"),
                        new Mesa(5, 4, "Terraza"),
                        new Mesa(6, 6, "Salón principal"),
                        new Mesa(7, 6, "Terraza"),
                        new Mesa(8, 8, "Salón de eventos")));
            }
        };
    }
}
