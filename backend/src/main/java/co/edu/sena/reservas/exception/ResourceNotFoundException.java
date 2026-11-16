package co.edu.sena.reservas.exception;

/**
 * Excepción lanzada cuando no se encuentra un recurso solicitado (404).
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
