package co.edu.sena.reservas.exception;

/**
 * Excepción lanzada cuando se violan reglas de negocio relativas a las reservas.
 */
public class ReservaException extends RuntimeException {
    public ReservaException(String message) {
        super(message);
    }
}
