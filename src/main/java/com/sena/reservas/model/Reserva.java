package com.sena.reservas.model;

import java.io.Serializable;

/**
 * Modelo de datos para una Reserva del restaurante de la
 * Escuela Gastronomica SENA Risaralda.
 *
 * Corresponde a la entidad "Reserva" del diagrama de clases
 * elaborado previamente para el proyecto (relacionada con la
 * clase abstracta Usuario -> Cliente).
 */
public class Reserva implements Serializable {

    private int id;
    private String nombreCliente;
    private String documentoCliente;
    private String telefono;
    private String fecha;       // formato yyyy-MM-dd
    private String hora;        // formato HH:mm
    private int numeroPersonas;
    private String comentarios;
    private String estado;      // Pendiente, Confirmada, Cancelada

    public Reserva() {
    }

    public Reserva(int id, String nombreCliente, String documentoCliente, String telefono,
                    String fecha, String hora, int numeroPersonas, String comentarios, String estado) {
        this.id = id;
        this.nombreCliente = nombreCliente;
        this.documentoCliente = documentoCliente;
        this.telefono = telefono;
        this.fecha = fecha;
        this.hora = hora;
        this.numeroPersonas = numeroPersonas;
        this.comentarios = comentarios;
        this.estado = estado;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public String getDocumentoCliente() {
        return documentoCliente;
    }

    public void setDocumentoCliente(String documentoCliente) {
        this.documentoCliente = documentoCliente;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }

    public int getNumeroPersonas() {
        return numeroPersonas;
    }

    public void setNumeroPersonas(int numeroPersonas) {
        this.numeroPersonas = numeroPersonas;
    }

    public String getComentarios() {
        return comentarios;
    }

    public void setComentarios(String comentarios) {
        this.comentarios = comentarios;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
