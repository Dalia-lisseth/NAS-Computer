import bannerHeroImg from '../assets/imagenes/banner-hero.png';

/**
 * Datos para el carrusel de banners principal
 */
export const BANNERS = [
  {
    id: 'banner-principal',
    titulo: 'POTENCIA TU NEGOCIO CON TECNOLOGÍA NAS',
    tituloResaltado: 'TECNOLOGÍA NAS',
    subtitulo: 'Equipos de alto rendimiento y soluciones tecnológicas para llevar tu negocio al siguiente nivel.',
    beneficios: [
      { icono: 'Truck', texto: 'Envíos rápidos y seguros' },
      { icono: 'ShieldCheck', texto: 'Garantía asegurada', detalle: 'Productos 100% garantizados' },
      { icono: 'Headphones', texto: 'Soporte especializado', detalle: 'Te ayudamos siempre' }
    ],
    imagen: bannerHeroImg,
    enlace: '/catalogo',
    botonTexto: 'Ver Equipos'
  },
  {
    id: 'banner-workstations',
    titulo: 'WORKSTATIONS Y SERVIDORES EMPRESARIALES',
    tituloResaltado: 'SERVIDORES EMPRESARIALES',
    subtitulo: 'Arquitectura diseñada para cargas de trabajo críticas, virtualización, renderizado y big data.',
    beneficios: [
      { icono: 'Truck', texto: 'Entrega e instalación garantizada' },
      { icono: 'ShieldCheck', texto: 'Garantía extendida hasta 3 años' },
      { icono: 'Headphones', texto: 'Mesa de ayuda corporativa 24/7' }
    ],
    imagen: bannerHeroImg,
    enlace: '/mi-seleccion',
    botonTexto: 'Cotizar Solución'
  },
  {
    id: 'banner-gaming',
    titulo: 'COMPONENTES Y ECOSISTEMA GAMING PRO',
    tituloResaltado: 'GAMING PRO',
    subtitulo: 'Arma la setup de tus sueños con las últimas tarjetas gráficas RTX y procesadores de última generación.',
    beneficios: [
      { icono: 'Truck', texto: 'Envíos a todo el país' },
      { icono: 'ShieldCheck', texto: 'Garantía oficial de fábrica' },
      { icono: 'Headphones', texto: 'Asesoría para ensamble sin costo' }
    ],
    imagen: bannerHeroImg,
    enlace: '/catalogo?categoria=gaming',
    botonTexto: 'Ver Componentes'
  }
];

export default BANNERS;
