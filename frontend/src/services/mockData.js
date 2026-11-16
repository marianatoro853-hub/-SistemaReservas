export const MOCK_TURNOS = [
  { id: 1, nombre: 'Desayuno Gourmet', horaInicio: '07:00:00', horaFin: '10:00:00' },
  { id: 2, nombre: 'Almuerzo Degustación', horaInicio: '12:00:00', horaFin: '15:00:00' },
  { id: 3, nombre: 'Cena Pedagógica', horaInicio: '18:00:00', horaFin: '21:00:00' },
];

export const MOCK_MESAS = [
  { id: 1, numero: 1, capacidad: 2, ubicacion: 'Terraza Panorámica' },
  { id: 2, numero: 2, capacidad: 2, ubicacion: 'Terraza Panorámica' },
  { id: 3, numero: 3, capacidad: 4, ubicacion: 'Salón Principal' },
  { id: 4, numero: 4, capacidad: 4, ubicacion: 'Salón Principal' },
  { id: 5, numero: 5, capacidad: 6, ubicacion: 'Jardín Interior' },
  { id: 6, numero: 6, capacidad: 6, ubicacion: 'Jardín Interior' },
  { id: 7, numero: 7, capacidad: 8, ubicacion: 'Zona Gourmet' },
  { id: 8, numero: 8, capacidad: 10, ubicacion: 'Zona VIP (Mesa Presidencial)' },
];

export const OPCIONES_PLATOS = [
  'Solomillo de Cerdo en Glaseado de Café Especial',
  'Ceviche de Trucha Risaraldense con Maíz Chulpi',
  'Suprema Campesina en Costra de Finas Hierbas',
  'Cazuela de Hongos Ostra y Plátano Asado (Vegano)',
  'Velouté de Ahuyama y Jengibre con Queso Campesino',
];

export const OPCIONES_DIETARIAS = [
  'Estándar (Sin restricciones)',
  'Dieta Vegetariana',
  'Dieta Vegana',
  'Alergia a Mariscos / Pescados',
  'Alergia a Frutos Secos',
  'Intolerancia a la Lactosa',
  'Libre de Gluten (Celíaco)',
];

let mockCuposDiarios = 50; // Caso 1: Cupos base 50, ajustables por el Instructor Líder

let mockReservasStorage = [
  {
    id: 1,
    clienteNombre: 'Mariana Toro Ortiz',
    clienteTelefono: '3001234567',
    clienteEmail: 'mariana.toro@sena.edu.co',
    fecha: new Date().toISOString().split('T')[0],
    turno: MOCK_TURNOS[1],
    mesa: MOCK_MESAS[2],
    comensales: 4,
    tipoConsumo: 'En Sitio',
    preferenciaDietaria: 'Estándar (Sin restricciones)',
    menuSeleccionado: 'Solomillo de Cerdo en Glaseado de Café Especial',
    observaciones: 'Mesa con buena vista para evaluación técnica',
    estado: 'CONFIRMADA',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    clienteNombre: 'Carlos Andrés Gómez',
    clienteTelefono: '3109876543',
    clienteEmail: 'cgomez@gmail.com',
    fecha: new Date().toISOString().split('T')[0],
    turno: MOCK_TURNOS[1],
    mesa: MOCK_MESAS[4],
    comensales: 6,
    tipoConsumo: 'En Sitio',
    preferenciaDietaria: 'Alergia a Mariscos / Pescados',
    menuSeleccionado: 'Suprema Campesina en Costra de Finas Hierbas',
    observaciones: 'Por favor evitar contacto con crustáceos en cocina',
    estado: 'CONFIRMADA',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    clienteNombre: 'Yuri Vargas (Instructora)',
    clienteTelefono: '3157891234',
    clienteEmail: 'yuri.vargas@misena.edu.co',
    fecha: new Date().toISOString().split('T')[0],
    turno: MOCK_TURNOS[2],
    mesa: MOCK_MESAS[7],
    comensales: 10,
    tipoConsumo: 'En Sitio',
    preferenciaDietaria: 'Dieta Vegetariana',
    menuSeleccionado: 'Cazuela de Hongos Ostra y Plátano Asado (Vegano)',
    observaciones: 'Cena pedagógica con comité evaluador',
    estado: 'CONFIRMADA',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    clienteNombre: 'Andrés Felipe Ramos',
    clienteTelefono: '3206549871',
    clienteEmail: 'aramos@gmail.com',
    fecha: new Date().toISOString().split('T')[0],
    turno: MOCK_TURNOS[1],
    mesa: MOCK_MESAS[0],
    comensales: 2,
    tipoConsumo: 'Para Llevar',
    preferenciaDietaria: 'Libre de Gluten (Celíaco)',
    menuSeleccionado: 'Velouté de Ahuyama y Jengibre con Queso Campesino',
    observaciones: 'Empacar en recipientes térmicos ecológicos',
    estado: 'CONFIRMADA',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getCuposDiariosConfig = () => {
  const guardado = localStorage.getItem('sena_cupos_diarios');
  return guardado ? Number(guardado) : mockCuposDiarios;
};

export const setCuposDiariosConfig = (nuevoLimite) => {
  mockCuposDiarios = Number(nuevoLimite);
  localStorage.setItem('sena_cupos_diarios', String(nuevoLimite));
  return mockCuposDiarios;
};

export const mockGetReservas = async (page = 0, size = 10, telefono = '') => {
  let filtradas = [...mockReservasStorage];
  if (telefono && telefono.trim()) {
    filtradas = filtradas.filter((r) => r.clienteTelefono.includes(telefono.trim()));
  }
  const totalElements = filtradas.length;
  const totalPages = Math.ceil(totalElements / size) || 1;
  const content = filtradas.slice(page * size, (page + 1) * size);

  return {
    content,
    totalElements,
    totalPages,
    number: page,
    size,
  };
};

export const mockCrearReserva = async (datos) => {
  const turno = MOCK_TURNOS.find((t) => t.id === Number(datos.turnoId));
  const mesa = MOCK_MESAS.find((m) => m.id === Number(datos.mesaId));

  const nueva = {
    id: mockReservasStorage.length + 1,
    clienteNombre: datos.clienteNombre,
    clienteTelefono: datos.clienteTelefono,
    clienteEmail: datos.clienteEmail || '',
    fecha: datos.fecha,
    turno,
    mesa,
    comensales: Number(datos.comensales),
    tipoConsumo: datos.tipoConsumo || 'En Sitio',
    preferenciaDietaria: datos.preferenciaDietaria || 'Estándar (Sin restricciones)',
    menuSeleccionado: datos.menuSeleccionado || 'Menú de Autor',
    observaciones: datos.observaciones || '',
    estado: 'CONFIRMADA',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockReservasStorage.unshift(nueva);
  return nueva;
};

export const mockCancelarReserva = async (id) => {
  const reserva = mockReservasStorage.find((r) => r.id === Number(id));
  if (!reserva) {
    throw new Error('Reserva no encontrada');
  }
  if (reserva.estado === 'CANCELADA') {
    throw new Error('La reserva ya se encuentra cancelada.');
  }
  reserva.estado = 'CANCELADA';
  reserva.updatedAt = new Date().toISOString();
  return reserva;
};

export const mockCompletarReserva = async (id) => {
  const reserva = mockReservasStorage.find((r) => r.id === Number(id));
  if (!reserva) {
    throw new Error('Reserva no encontrada');
  }
  if (reserva.estado === 'CANCELADA') {
    throw new Error('No se puede dar check-in a una reserva cancelada.');
  }
  reserva.estado = 'COMPLETADA';
  reserva.updatedAt = new Date().toISOString();
  return reserva;
};

export const mockGetMesasOcupadas = async (fecha, turnoId) => {
  return mockReservasStorage
    .filter(
      (r) =>
        r.fecha === fecha &&
        r.turno?.id === Number(turnoId) &&
        r.estado !== 'CANCELADA'
    )
    .map((r) => r.mesa?.id)
    .filter(Boolean);
};
