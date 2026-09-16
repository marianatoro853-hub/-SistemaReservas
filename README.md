# Sistema de Gestion de Reservas - SENA GR

Modulo codificado: **Creacion de Reserva** (Servlets + JSP + formulario HTML).
Evidencia GA7-220501096-AA2-EV02.

## Contenido del modulo

- `Reserva.java`: clase modelo (basada en el diagrama de clases del proyecto).
- `ReservaServlet.java`: servlet con `doGet` (muestra formulario y listado)
  y `doPost` (procesa y registra la reserva).
- `reserva-form.jsp`: formulario HTML + listado de reservas (JSP con JSTL).
- `reserva-confirmacion.jsp`: vista de confirmacion tras el registro.
- `estilos.css`: estilos con la paleta institucional del proyecto.

## Opcion A: Ejecutar en NetBeans (con Apache Tomcat configurado)

1. Abrir NetBeans -> File -> Open Project -> seleccionar esta carpeta
   (`reservas-sena`). NetBeans reconoce el `pom.xml` como proyecto Maven.
2. Click derecho sobre el proyecto -> Properties -> Run -> verificar que el
   servidor sea Apache Tomcat (o agregar uno en Tools -> Servers).
3. Click derecho -> Run.
4. Se abre el navegador en: `http://localhost:8080/reservas-sena/`

## Opcion B: Ejecutar sin depender de NetBeans/Apache instalado

Si tu Apache/Tomcat local no esta funcionando, este proyecto trae un
Tomcat embebido via Maven, asi que puedes correrlo desde la terminal:

```
mvn tomcat7:run
```

Y abrir en el navegador: `http://localhost:8080/reservas-sena/`

(Requiere tener Maven instalado; NetBeans normalmente ya trae Maven
integrado, asi que tambien puedes correr este comando desde la terminal
integrada de NetBeans: Window -> IDE Tools -> Terminal).

## Control de versiones

El proyecto fue inicializado con git (`git init`) y cuenta con commits
que documentan el avance de la codificacion del modulo.
