/**
 * Servicio de Control de Acceso y Perfiles (RBAC)
 * Escuela Gastronómica SENA Risaralda
 * 
 * Gestiona el acceso restringido y especializado para los 4 roles definidos:
 * 1. Instructor Líder
 * 2. Jefe de Cocina
 * 3. Capitán de Restaurante
 * 4. Encargado de Reservas
 */

export const ROLES_SENA = {
  INSTRUCTOR_LIDER: {
    id: 'INSTRUCTOR_LIDER',
    nombre: 'Instructor Líder de Área',
    email: 'yuri.vargas@misena.edu.co',
    pin: '2026',
    permisos: [
      'Ajustar cupos diarios (base 50)',
      'Generar informes y métricas semanales/mensuales',
      'Exportar reportes oficiales a PDF y Excel',
      'Auditoría global de la operación',
    ],
    descripcion: 'Control estratégico, gestión de aforo máximo y reportes ejecutivos.',
  },
  JEFE_COCINA: {
    id: 'JEFE_COCINA',
    nombre: 'Jefe / Instructor de Cocina',
    email: 'cocina.escuela@sena.edu.co',
    pin: '1234',
    permisos: [
      'Consultar comensales y horarios del día',
      'Ver alertas críticas de alergias y dietas especiales',
      'Consolidado de platos de la carta para producción',
    ],
    descripcion: 'Planificación de mise en place, producción de platos y seguridad alimentaria.',
  },
  CAPITAN_RESTAURANTE: {
    id: 'CAPITAN_RESTAURANTE',
    nombre: 'Capitán de Meseros / Restaurante',
    email: 'capitan.servicio@sena.edu.co',
    pin: '1234',
    permisos: [
      'Visualizar aforo de mesas por turno (mañana/tarde/noche)',
      'Planificación de montaje de mesas de salón',
      'Asignación y distribución de aprendices meseros',
    ],
    descripcion: 'Operación de sala, servicio al comensal y montaje de mesas.',
  },
  ENCARGADO_RESERVAS: {
    id: 'ENCARGADO_RESERVAS',
    nombre: 'Encargado de Reservas',
    email: 'recepcion.reservas@sena.edu.co',
    pin: '1234',
    permisos: [
      'Gestión diaria de reservas',
      'Búsqueda y consulta de clientes',
      'Cancelación y modificación de reservas',
    ],
    descripcion: 'Atención al comensal, recepción y control de asistencia.',
  },
};

export const getUsuarioSesion = () => {
  const guardado = localStorage.getItem('sena_sesion_rol');
  if (guardado && ROLES_SENA[guardado]) {
    return ROLES_SENA[guardado];
  }
  return null;
};

export const iniciarSesion = (rolId, pinIngresado) => {
  const rol = ROLES_SENA[rolId];
  if (!rol) {
    throw new Error('Perfil de usuario no reconocido.');
  }
  if (rol.pin !== pinIngresado.trim()) {
    throw new Error('Contraseña o PIN incorrecto para este rol.');
  }
  localStorage.setItem('sena_sesion_rol', rolId);
  return rol;
};

export const cerrarSesion = () => {
  localStorage.removeItem('sena_sesion_rol');
};
