# Sistema de Gestión de Reservas – Escuela Gastronómica SENA Risaralda

Módulo **Creación de Reserva** (evidencia GA7-220501096-AA4-EV03).
**Aprendiz:** Mariana Toro

El proyecto tiene dos partes:

| Carpeta     | Tecnología                                              | Puerto |
|-------------|---------------------------------------------------------|--------|
| `backend/`  | Spring Boot 3, Spring Data JPA, Validation, MySQL, Java 21 | 8080   |
| `frontend/` | React 18, Vite, Material UI, React Router, Axios        | 5173   |

## Cómo ejecutarlo

### 1. Backend
1. Inicia **MySQL desde XAMPP** (puerto 3306). La base `reservas_sena` se crea sola.
2. Abre la carpeta `backend` en IntelliJ IDEA (como proyecto Maven) y ejecuta `ReservasSenaApplication`.
   También puedes usar: `mvn spring-boot:run`
3. Al primer arranque se cargan automáticamente los 3 turnos y las 8 mesas.
4. Si tu usuario de MySQL tiene contraseña, cámbiala en `backend/src/main/resources/application.properties`.

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env     # en Windows: copy .env.example .env
npm run dev
```
Abre http://localhost:5173

> Para probar el front-end **sin backend**, pon `VITE_USE_MOCK=true` en el archivo `.env`.

## API REST
| Método | Ruta                              | Descripción                              |
|--------|-----------------------------------|------------------------------------------|
| GET    | `/api/reservas`                   | Lista las reservas                       |
| POST   | `/api/reservas`                   | Crea una reserva                         |
| PUT    | `/api/reservas/{id}/cancelar`     | Cancela una reserva                      |
| GET    | `/api/reservas/mesas-ocupadas`    | Mesas ocupadas (`fecha`, `turnoId`)      |
| GET    | `/api/mesas`, `/api/turnos`       | Catálogos                                |

## Arquitectura
- **Backend por capas:** `model` (entidades) → `repository` → `service` (reglas de negocio) → `controller` (REST), más `dto`, `exception` (errores centralizados) y `config` (CORS y datos iniciales).
- **Frontend por componentes:** `components`, `pages`, `hooks`, `services`, `utils` y `constants`.

## Reglas de negocio
- La fecha no puede ser anterior a hoy y el teléfono debe tener 10 dígitos.
- Los comensales no pueden superar la capacidad de la mesa.
- Una mesa no se puede reservar dos veces en el mismo turno y fecha.
- Una reserva ya cancelada no se puede cancelar de nuevo.

## Estándares de codificación
- Java: paquetes en minúscula, clases en PascalCase, métodos y variables en camelCase, comentarios Javadoc.
- React: un componente por archivo (PascalCase), funciones y variables en camelCase, comentarios en cada archivo.
- Validación en ambos lados (formulario y API) y mensajes de error claros para el usuario.

## Versionamiento
```bash
git init
git add .
git commit -m "feat: módulo Creación de Reserva (backend Spring Boot y frontend React)"
git branch -M main
git remote add origin <URL-del-repositorio>
git push -u origin main
```
