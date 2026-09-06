/**
 * Catálogo de productos de NAS Computer
 * Organizados en Destacados, Ofertas y Más Vendidos
 */

export const PRODUCTOS = [
  // --- PRODUCTOS DESTACADOS ---
  {
    id: 'prod-dest-1',
    slug: 'dell-xps-13',
    nombre: 'Dell XPS 13',
    categoria: 'laptops',
    categoriaNombre: 'Laptops',
    precio: 1299.00,
    precioAnterior: null,
    rating: 5,
    totalReviews: 71,
    badge: null,
    tipoSeccion: 'destacados',
    imagen: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Laptop ultraliviana con pantalla InfinityEdge OLED 4K, procesador Intel Core i7 de 13va generación, 16GB RAM y 512GB SSD NVMe.',
    especificaciones: {
      'Procesador': 'Intel Core i7-1360P',
      'Memoria RAM': '16GB LPDDR5',
      'Almacenamiento': '512GB SSD M.2 PCIe 4.0',
      'Pantalla': '13.4" UHD+ InfinityEdge táctil'
    }
  },
  {
    id: 'prod-dest-2',
    slug: 'sony-wh-1000xm5',
    nombre: 'Sony WH-1000XM5',
    categoria: 'audio',
    categoriaNombre: 'Audio',
    precio: 349.00,
    precioAnterior: null,
    rating: 5,
    totalReviews: 93,
    badge: null,
    tipoSeccion: 'destacados',
    imagen: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Auriculares inalámbricos con cancelación de ruido líder en la industria, sonido de alta resolución y 30 horas de autonomía.',
    especificaciones: {
      'Conectividad': 'Bluetooth 5.2 / LDAC / Jack 3.5mm',
      'Autonomía': 'Hasta 30 horas con ANC',
      'Micrófonos': '8 micrófonos con IA',
      'Carga': 'Carga ultra rápida USB-C'
    }
  },
  {
    id: 'prod-dest-3',
    slug: 'nvidia-rtx-4070',
    nombre: 'NVIDIA RTX 4070',
    categoria: 'componentes',
    categoriaNombre: 'Componentes',
    precio: 599.00,
    precioAnterior: null,
    rating: 5,
    totalReviews: 38,
    badge: 'NUEVO',
    tipoSeccion: 'destacados',
    imagen: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Tarjeta gráfica de alto rendimiento con arquitectura Ada Lovelace, 12GB GDDR6X, DLSS 3 y trazado de rayos de 3ra generación.',
    especificaciones: {
      'Memoria VRAM': '12GB GDDR6X',
      'Interfaz': 'PCIe 4.0 x16',
      'Salidas': '3x DisplayPort 1.4a, 1x HDMI 2.1a',
      'Tecnologías': 'DLSS 3, Ray Tracing, NVENC AV1'
    }
  },

  // --- PRODUCTOS EN OFERTA ---
  {
    id: 'prod-ofer-1',
    slug: 'asus-tuf-gaming-a15',
    nombre: 'ASUS TUF Gaming A15',
    categoria: 'gaming',
    categoriaNombre: 'Gaming',
    precio: 899.00,
    precioAnterior: 1099.00,
    rating: 5,
    totalReviews: 64,
    badge: 'SALE',
    tipoSeccion: 'ofertas',
    imagen: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Portátil gamer resistente con certificación militar, AMD Ryzen 7 7735HS, NVIDIA GeForce RTX 4060, pantalla 144Hz y teclado RGB.',
    especificaciones: {
      'Procesador': 'AMD Ryzen 7 7735HS',
      'Gráfica': 'NVIDIA GeForce RTX 4060 8GB',
      'Pantalla': '15.6" FHD 144Hz IPS',
      'RAM & SSD': '16GB DDR5 + 512GB NVMe'
    }
  },
  {
    id: 'prod-ofer-2',
    slug: 'monitor-lg-27-144hz',
    nombre: 'Monitor LG 27" 144Hz',
    categoria: 'computadoras',
    categoriaNombre: 'Computadoras',
    precio: 239.00,
    precioAnterior: 299.00,
    rating: 5,
    totalReviews: 42,
    badge: 'SALE',
    tipoSeccion: 'ofertas',
    imagen: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Monitor gamer UltraGear IPS de 27 pulgadas, resolución QHD 2K, tasa de refresco 144Hz (1ms MBR) compatible con AMD FreeSync Premium y G-Sync.',
    especificaciones: {
      'Resolución': '2560 x 1440 QHD',
      'Frecuencia': '144Hz (1ms)',
      'Panel': 'IPS con HDR10 y 99% sRGB',
      'Puertos': '2x HDMI, 1x DP, Salida de audio'
    }
  },
  {
    id: 'prod-ofer-3',
    slug: 'ssd-kingston-1tb',
    nombre: 'SSD Kingston 1TB',
    categoria: 'componentes',
    categoriaNombre: 'Componentes',
    precio: 89.00,
    precioAnterior: 119.00,
    rating: 5,
    totalReviews: 81,
    badge: 'SALE',
    tipoSeccion: 'ofertas',
    imagen: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Unidad de estado sólido NVMe M.2 PCIe 4.0 de alta velocidad Kingston Fury Renegade con disipador de grafeno para velocidades de hasta 7300MB/s.',
    especificaciones: {
      'Capacidad': '1000GB (1TB)',
      'Velocidad de Lectura': 'Hasta 7,300 MB/s',
      'Velocidad de Escritura': 'Hasta 6,000 MB/s',
      'Factor de Forma': 'M.2 2280 PCIe 4.0 NVMe'
    }
  },

  // --- MÁS VENDIDOS ---
  {
    id: 'prod-vend-1',
    slug: 'hp-pavilion-15',
    nombre: 'HP Pavilion 15',
    categoria: 'laptops',
    categoriaNombre: 'Laptops',
    precio: 649.00,
    precioAnterior: null,
    rating: 5,
    totalReviews: 120,
    badge: null,
    tipoSeccion: 'masVendidos',
    imagen: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Laptop versátil para trabajo y productividad con procesador Intel Core i5, audio de alta calidad B&O, pantalla microborde FHD y carga rápida.',
    especificaciones: {
      'Procesador': 'Intel Core i5-1235U (10 núcleos)',
      'Memoria RAM': '16GB DDR4 3200MHz',
      'Almacenamiento': '512GB SSD PCIe NVMe',
      'Batería': 'Hasta 8.5 horas con HP Fast Charge'
    }
  },
  {
    id: 'prod-vend-2',
    slug: 'logitech-g502',
    nombre: 'Logitech G502',
    categoria: 'perifericos',
    categoriaNombre: 'Periféricos',
    precio: 59.00,
    precioAnterior: null,
    rating: 5,
    totalReviews: 105,
    badge: null,
    tipoSeccion: 'masVendidos',
    imagen: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Mouse gamer icónico con sensor HERO 25K de máxima precisión, 11 botones programables, sistema de pesas ajustables e iluminación RGB LIGHTSYNC.',
    especificaciones: {
      'Sensor': 'HERO 25K (100 - 25,600 DPI)',
      'Botones': '11 botones totalmente programables',
      'Pesas': '5 pesas extraíbles de 3.6g',
      'Switches': 'Mecánicos con resorte metálico'
    }
  },
  {
    id: 'prod-vend-3',
    slug: 'memoria-corsair-16gb',
    nombre: 'Memoria Corsair 16GB',
    categoria: 'componentes',
    categoriaNombre: 'Componentes',
    precio: 49.00,
    precioAnterior: null,
    rating: 5,
    totalReviews: 88,
    badge: null,
    tipoSeccion: 'masVendidos',
    imagen: 'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Kit de memoria RAM DDR4 16GB (2x8GB) 3200MHz Corsair Vengeance LPX / RGB PRO con disipador térmico de aluminio anodizado y soporte XMP 2.0.',
    especificaciones: {
      'Capacidad': '16GB (2 x 8GB)',
      'Velocidad': 'DDR4 3200MHz (PC4-25600)',
      'Latencia': 'CL16',
      'Compatibilidad': 'Intel y AMD Series'
    }
  },

  // --- PRODUCTOS DE REDES ---
  {
    id: 'prod-red-1',
    slug: 'router-tp-link-archer-ax73',
    nombre: 'Router TP-Link Archer AX73 WiFi 6',
    categoria: 'redes',
    categoriaNombre: 'Redes',
    precio: 149.00,
    precioAnterior: 179.00,
    rating: 5,
    totalReviews: 52,
    badge: 'NUEVO',
    tipoSeccion: 'general',
    imagen: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Router Gigabit WiFi 6 Dual Band AX5400 con 6 antenas de alta ganancia, tecnología OneMesh y cobertura integral para gaming y streaming 8K.',
    especificaciones: {
      'Velocidad': 'Hasta 5400 Mbps (4804 Mbps en 5GHz + 574 Mbps en 2.4GHz)',
      'Puertos': '1x Gigabit WAN, 4x Gigabit LAN, 1x USB 3.0',
      'Antenas': '6 antenas de alto rendimiento con Beamforming'
    }
  },

  // --- PRODUCTOS DE ACCESORIOS ---
  {
    id: 'prod-acc-1',
    slug: 'hub-usb-c-anker-8-en-1',
    nombre: 'Hub USB-C Anker 8 en 1 PowerExpand',
    categoria: 'accesorios',
    categoriaNombre: 'Accesorios',
    precio: 49.00,
    precioAnterior: null,
    rating: 5,
    totalReviews: 67,
    badge: null,
    tipoSeccion: 'general',
    imagen: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Concentrador USB-C multipuerto con entrega de energía de 100W, salida HDMI 4K@60Hz, Ethernet Gigabit, lector de tarjetas SD y puertos USB 3.1.',
    especificaciones: {
      'Puertos': 'HDMI 4K@60Hz, 100W PD, Gigabit Ethernet, SD/microSD, 2x USB-A 3.0',
      'Material': 'Carcasa de aluminio disipador de calor',
      'Compatibilidad': 'MacBook, Windows, iPad Pro y laptops con USB-C'
    }
  },

  // --- PRODUCTOS DE IMPRESORAS ---
  {
    id: 'prod-imp-1',
    slug: 'epson-ecotank-l3250',
    nombre: 'Epson EcoTank L3250 Multifuncional',
    categoria: 'impresoras',
    categoriaNombre: 'Impresoras',
    precio: 219.00,
    precioAnterior: 249.00,
    rating: 5,
    totalReviews: 73,
    badge: 'SALE',
    tipoSeccion: 'general',
    imagen: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Impresora multifuncional 3 en 1 con sistema original de tanque de tinta EcoTank, conectividad inalámbrica WiFi Direct e impresión desde móvil con Smart Panel.',
    especificaciones: {
      'Funciones': 'Imprime, copia y escanea',
      'Rendimiento': 'Hasta 4,500 páginas en negro / 7,500 páginas a color',
      'Conectividad': 'WiFi, WiFi Direct, USB de alta velocidad'
    }
  }
];

export const PRODUCTOS_DESTACADOS = PRODUCTOS.filter(p => p.tipoSeccion === 'destacados');
export const PRODUCTOS_OFERTAS = PRODUCTOS.filter(p => p.tipoSeccion === 'ofertas');
export const PRODUCTOS_MAS_VENDIDOS = PRODUCTOS.filter(p => p.tipoSeccion === 'masVendidos');

export default PRODUCTOS;
