<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Crear Reserva - SENA GR</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/estilos.css">
</head>
<body>
    <div class="contenedor">
        <h1>Sistema de Gestion de Reservas</h1>
        <h2>Crear nueva reserva</h2>

        <c:if test="${not empty error}">
            <div class="mensaje-error">${error}</div>
        </c:if>

        <!-- Formulario HTML enviado por metodo POST al ReservaServlet -->
        <form action="${pageContext.request.contextPath}/reservas" method="post">
            <label for="nombreCliente">Nombre del cliente:</label>
            <input type="text" id="nombreCliente" name="nombreCliente" required>

            <label for="documentoCliente">Documento:</label>
            <input type="text" id="documentoCliente" name="documentoCliente" required>

            <label for="telefono">Telefono:</label>
            <input type="text" id="telefono" name="telefono" required>

            <label for="fecha">Fecha:</label>
            <input type="date" id="fecha" name="fecha" required>

            <label for="hora">Hora:</label>
            <input type="time" id="hora" name="hora" required>

            <label for="numeroPersonas">Numero de personas:</label>
            <input type="number" id="numeroPersonas" name="numeroPersonas" min="1" required>

            <label for="comentarios">Comentarios:</label>
            <textarea id="comentarios" name="comentarios" rows="3"></textarea>

            <button type="submit">Registrar reserva</button>
        </form>

        <h2>Reservas registradas</h2>
        <!-- El listado se obtiene con metodo GET al cargar esta pagina -->
        <c:choose>
            <c:when test="${empty listaReservas}">
                <p>Aun no hay reservas registradas.</p>
            </c:when>
            <c:otherwise>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Personas</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach var="r" items="${listaReservas}">
                            <tr>
                                <td>${r.id}</td>
                                <td>${r.nombreCliente}</td>
                                <td>${r.fecha}</td>
                                <td>${r.hora}</td>
                                <td>${r.numeroPersonas}</td>
                                <td>${r.estado}</td>
                            </tr>
                        </c:forEach>
                    </tbody>
                </table>
            </c:otherwise>
        </c:choose>
    </div>
</body>
</html>
