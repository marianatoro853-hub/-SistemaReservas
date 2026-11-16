/**
 * Servicio de Gestión Dinámica de la Carta Gastronómica
 * Escuela Gastronómica SENA Risaralda
 * 
 * Permite al Instructor Líder y Jefe de Cocina:
 * - Crear, editar y eliminar platos.
 * - Modificar precios en tiempo real.
 * - Activar o pausar la disponibilidad ("En Menú" o "Agotado en Cocina").
 * - Asignar fotografía gastronómica de alta definición.
 */

export const PLATOS_INICIALES = [
  {
    id: 1,
    nombre: 'Solomillo de Cerdo en Glaseado de Café Especial',
    categoria: 'Platos Fuertes',
    descripcion: 'Medallón sellado a fuego vivo con reducción demi-glace infusionada en café variedad Geisha y uchuvas silvestres, acompañado de mousseline de yuca al cilantro.',
    precio: 32000,
    disponible: true,
    badge: 'Recomendado del Chef',
    imagen: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    nombre: 'Ceviche de Trucha Risaraldense con Maíz Chulpi',
    categoria: 'Entradas de Autor',
    descripcion: 'Trucha fresca de cuenca alta marinada en cítricos regionales, maíz chulpi crocante, mousse de aguacate hass y chips de plátano verde.',
    precio: 18000,
    disponible: true,
    badge: 'Plato Insignia',
    imagen: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    nombre: 'Suprema Campesina en Costra de Finas Hierbas',
    categoria: 'Platos Fuertes',
    descripcion: 'Pechuga de ave de pastoreo con hierbas del huerto botánico SENA, risotto de quinua perlada y salteado de vegetales de estación a la mantequilla.',
    precio: 28000,
    disponible: true,
    badge: 'Técnica Clásica',
    imagen: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    nombre: 'Cazuela de Hongos Ostra y Plátano Asado',
    categoria: 'Platos Fuertes',
    descripcion: 'Setas cultivadas en la región estofadas en leche de coco artesanal, ají dulce aromatizado y nido crujiente de plátano maduro.',
    precio: 26000,
    disponible: true,
    badge: 'Plant Based / Vegano',
    imagen: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    nombre: 'Velouté de Ahuyama y Jengibre con Queso Campesino',
    categoria: 'Entradas de Autor',
    descripcion: 'Sopa aterciopelada de calabaza asada, reducción de miel de panela orgánica, semillas tostadas y quenelle de queso campesino fresco.',
    precio: 14000,
    disponible: true,
    badge: 'Cocina de Origen',
    imagen: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    nombre: 'Mousse de Maracuyá y Cacao Fino de Aroma',
    categoria: 'Repostería & Postres',
    descripcion: 'Espuma ligera de fruta de la pasión con crumble crocante de cacao risaraldense al 70% y reducción de frutos del bosque.',
    precio: 12000,
    disponible: true,
    badge: 'Cacao Risaralda',
    imagen: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 7,
    nombre: 'Cheesecake Horneado de Arequipe de Café',
    categoria: 'Repostería & Postres',
    descripcion: 'Tarta tradicional de queso crema con infusión de café arábico sobre base de galleta de mantequilla de campo y caramelo suave.',
    precio: 13000,
    disponible: true,
    badge: 'Artesanal',
    imagen: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    nombre: 'Café de Especialidad Filtrado en Mesa',
    categoria: 'Cafetería & Bebidas',
    descripcion: 'Extracción en métodos artesanales (Chemex / V60) con microlotes cultivados y tostados por aprendices del SENA Centro Agropecuario.',
    precio: 7000,
    disponible: true,
    badge: 'Origen SENA',
    imagen: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 9,
    nombre: 'Limonada de Coco y Menta Fresca',
    categoria: 'Cafetería & Bebidas',
    descripcion: 'Bebida cítrica cremosa elaborada al momento con leche de coco natural y hojas de menta maceradas.',
    precio: 8500,
    disponible: true,
    badge: 'Refrescante',
    imagen: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  },
];

const STORAGE_KEY = 'sena_carta_gastronomica';

export const getPlatosCarta = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error al cargar carta de platos:', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(PLATOS_INICIALES));
  return PLATOS_INICIALES;
};

export const guardarPlato = (platoData) => {
  const platos = getPlatosCarta();
  let platosActualizados;

  if (platoData.id) {
    // Editar plato existente
    platosActualizados = platos.map((p) =>
      p.id === Number(platoData.id) ? { ...p, ...platoData, precio: Number(platoData.precio) } : p
    );
  } else {
    // Crear nuevo plato
    const nuevo = {
      ...platoData,
      id: Date.now(),
      precio: Number(platoData.precio),
      disponible: platoData.disponible !== undefined ? platoData.disponible : true,
      badge: platoData.badge || 'Nuevo Plato',
      imagen: platoData.imagen || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    };
    platosActualizados = [nuevo, ...platos];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(platosActualizados));
  window.dispatchEvent(new Event('sena_carta_actualizada'));
  return platosActualizados;
};

export const toggleDisponibilidadPlato = (id) => {
  const platos = getPlatosCarta();
  const platosActualizados = platos.map((p) =>
    p.id === Number(id) ? { ...p, disponible: !p.disponible } : p
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(platosActualizados));
  window.dispatchEvent(new Event('sena_carta_actualizada'));
  return platosActualizados;
};

export const eliminarPlato = (id) => {
  const platos = getPlatosCarta();
  const platosActualizados = platos.filter((p) => p.id !== Number(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(platosActualizados));
  window.dispatchEvent(new Event('sena_carta_actualizada'));
  return platosActualizados;
};

export const formatearPrecioCOP = (precio) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(precio);
};
