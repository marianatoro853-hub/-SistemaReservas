package com.sena.reservas.servlet;

import com.sena.reservas.model.Reserva;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Modulo: Creacion de Reserva.
 *
 * GET  /reservas  -> muestra el formulario de creacion y el listado
 *                    de reservas ya registradas.
 * POST /reservas  -> valida y procesa los datos del formulario,
 *                    crea la Reserva y muestra la confirmacion.
 *
 * Evidencia GA7-220501096-AA2-EV02.
 */
@WebServlet(name = "ReservaServlet", urlPatterns = {"/reservas"})
public class ReservaServlet extends HttpServlet {

    // Simula la capa de persistencia (en el proyecto real esto se conecta
    // a la Base de Datos definida en el diagrama de despliegue).
    private static final List<Reserva> reservas = new ArrayList<>();
    private static final AtomicInteger contadorId = new AtomicInteger(1);

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setAttribute("listaReservas", reservas);
        request.getRequestDispatcher("/WEB-INF/views/reserva-form.jsp")
               .forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");

        String nombreCliente = request.getParameter("nombreCliente");
        String documentoCliente = request.getParameter("documentoCliente");
        String telefono = request.getParameter("telefono");
        String fecha = request.getParameter("fecha");
        String hora = request.getParameter("hora");
        String numeroPersonasParam = request.getParameter("numeroPersonas");
        String comentarios = request.getParameter("comentarios");

        String error = validar(nombreCliente, documentoCliente, telefono, fecha, hora, numeroPersonasParam);

        if (error != null) {
            request.setAttribute("error", error);
            request.setAttribute("listaReservas", reservas);
            request.getRequestDispatcher("/WEB-INF/views/reserva-form.jsp")
                   .forward(request, response);
            return;
        }

        int numeroPersonas = Integer.parseInt(numeroPersonasParam);

        Reserva reserva = new Reserva(
                contadorId.getAndIncrement(),
                nombreCliente,
                documentoCliente,
                telefono,
                fecha,
                hora,
                numeroPersonas,
                comentarios,
                "Pendiente"
        );

        reservas.add(reserva);

        request.setAttribute("reserva", reserva);
        request.getRequestDispatcher("/WEB-INF/views/reserva-confirmacion.jsp")
               .forward(request, response);
    }

    /**
     * Validacion basica de los datos del formulario.
     * Retorna un mensaje de error, o null si todo es valido.
     */
    private String validar(String nombreCliente, String documentoCliente, String telefono,
                            String fecha, String hora, String numeroPersonasParam) {

        if (nombreCliente == null || nombreCliente.trim().isEmpty()) {
            return "El nombre del cliente es obligatorio.";
        }
        if (documentoCliente == null || documentoCliente.trim().isEmpty()) {
            return "El documento del cliente es obligatorio.";
        }
        if (telefono == null || telefono.trim().isEmpty()) {
            return "El telefono es obligatorio.";
        }
        if (fecha == null || fecha.trim().isEmpty()) {
            return "La fecha de la reserva es obligatoria.";
        }
        if (hora == null || hora.trim().isEmpty()) {
            return "La hora de la reserva es obligatoria.";
        }
        if (numeroPersonasParam == null || numeroPersonasParam.trim().isEmpty()) {
            return "El numero de personas es obligatorio.";
        }
        try {
            int numeroPersonas = Integer.parseInt(numeroPersonasParam);
            if (numeroPersonas <= 0) {
                return "El numero de personas debe ser mayor a cero.";
            }
        } catch (NumberFormatException e) {
            return "El numero de personas debe ser un valor numerico.";
        }
        return null;
    }
}
