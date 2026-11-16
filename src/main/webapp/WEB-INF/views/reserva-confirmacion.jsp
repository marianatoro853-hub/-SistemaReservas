<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reserva confirmada - SENA GR</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/estilos.css">
</head>
<body>
    <div class="contenedor">
        <h1>Sistema de Gestion de Reservas</h1>
        <div class="mensaje-exito">
            <h2>Reserva registrada con exito</h2>
        </div>

        <table class="detalle">
            <tr><th>ID</th><td>${reserva.id}</td></tr>
            <tr><th>Cliente</th><td>${reserva.nombreCliente}</td></tr>
            <tr><th>Documento</th><td>${reserva.documentoCliente}</td></tr>
            <tr><th>Telefono</th><td>${reserva.telefono}</td></tr>
            <tr><th>Fecha</th><td>${reserva.fecha}</td></tr>
            <tr><th>Hora</th><td>${reserva.hora}</td></tr>
            <tr><th>Numero de personas</th><td>${reserva.numeroPersonas}</td></tr>
            <tr><th>Comentarios</th><td>${reserva.comentarios}</td></tr>
            <tr><th>Estado</th><td>${reserva.estado}</td></tr>
        </table>

        <!-- Enlace que dispara un GET de vuelta al servlet -->
        <a href="${pageContext.request.contextPath}/reservas" class="boton">Volver al listado</a>
    </div>
</body>
</html>
