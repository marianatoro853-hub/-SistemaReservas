package co.edu.sena.reservas.exception;

/** Se lanza cuando no existe el recurso solicitado (HTTP 404). */
public class RecursoNoEncontradoException extends RuntimeException {

    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
