package co.edu.sena.reservas.exception;

/** Se lanza cuando una operación incumple una regla de negocio (HTTP 409). */
public class ReglaNegocioException extends RuntimeException {

    public ReglaNegocioException(String mensaje) {
        super(mensaje);
    }
}
