const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const CATEGORIAS = [
  {
    name: 'Computadoras',
    slug: 'computadoras',
    icon: 'Monitor',
    description: 'Equipos de escritorio para oficina, hogar y empresas'
  },
  {
    name: 'Laptops',
    slug: 'laptops',
    icon: 'Laptop',
    description: 'Portátiles ultralivianos y de alto rendimiento'
  },
  {
    name: 'Componentes',
    slug: 'componentes',
    icon: 'Cpu',
    description: 'Procesadores, placas madre, fuentes de poder y gabinetes'
  },
  {
    name: 'Gaming',
    slug: 'gaming',
    icon: 'Gamepad2',
    description: 'Equipos y periféricos especializados para videojuegos'
  },
  {
    name: 'Periféricos',
    slug: 'perifericos',
    icon: 'Mouse',
    description: 'Teclados, ratones, mousepads y cámaras'
  },
  {
    name: 'Redes',
    slug: 'redes',
    icon: 'Network',
    description: 'Routers, switches, antenas y cables de red'
  },
  {
    name: 'Accesorios',
    slug: 'accesorios',
    icon: 'ShieldCheck',
    description: 'Hubs, adaptadores, soportes y fundas protectoras'
  },
  {
    name: 'Audio',
    slug: 'audio',
    icon: 'Headphones',
    description: 'Audífonos inalámbricos, micrófonos y parlantes'
  },
  {
    name: 'Impresoras',
    slug: 'impresoras',
    icon: 'Printer',
    description: 'Impresoras láser, multifuncionales y suministros'
  }
];

const PRODUCTOS = [
  {
    slug: 'dell-xps-13',
    name: 'Dell XPS 13',
    categoria: 'laptops',
    price: 1299.00,
    previousPrice: null,
    stock: 12,
    minimumStock: 3,
    rating: 5.0,
    reviewCount: 71,
    badge: null,
    tipoSeccion: 'destacados',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=80',
    description: 'Laptop ultraliviana con pantalla InfinityEdge OLED 4K, procesador Intel Core i7 de 13va generación, 16GB RAM y 512GB SSD NVMe.',
    specifications: {
      'Procesador': 'Intel Core i7-1360P',
      'Memoria RAM': '16GB LPDDR5',
      'Almacenamiento': '512GB SSD M.2 PCIe 4.0',
      'Pantalla': '13.4" UHD+ InfinityEdge táctil'
    }
  },
  {
    slug: 'sony-wh-1000xm5',
    name: 'Sony WH-1000XM5',
    categoria: 'audio',
    price: 349.00,
    previousPrice: null,
    stock: 20,
    minimumStock: 5,
    rating: 5.0,
    reviewCount: 93,
    badge: null,
    tipoSeccion: 'destacados',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80',
    description: 'Auriculares inalámbricos con cancelación de ruido líder en la industria, sonido de alta resolución y 30 horas de autonomía.',
    specifications: {
      'Conectividad': 'Bluetooth 5.2 / LDAC / Jack 3.5mm',
      'Autonomía': 'Hasta 30 horas con ANC',
      'Micrófonos': '8 micrófonos con IA',
      'Carga': 'Carga ultra rápida USB-C'
    }
  },
  {
    slug: 'nvidia-rtx-4070',
    name: 'NVIDIA RTX 4070',
    categoria: 'componentes',
    price: 599.00,
    previousPrice: null,
    stock: 8,
    minimumStock: 2,
    rating: 5.0,
    reviewCount: 38,
    badge: 'NUEVO',
    tipoSeccion: 'destacados',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80',
    description: 'Tarjeta gráfica de alto rendimiento con arquitectura Ada Lovelace, 12GB GDDR6X, DLSS 3 y trazado de rayos de 3ra generación.',
    specifications: {
      'Memoria VRAM': '12GB GDDR6X',
      'Interfaz': 'PCIe 4.0 x16',
      'Salidas': '3x DisplayPort 1.4a, 1x HDMI 2.1a',
      'Tecnologías': 'DLSS 3, Ray Tracing, NVENC AV1'
    }
  },
  {
    slug: 'asus-tuf-gaming-a15',
    name: 'ASUS TUF Gaming A15',
    categoria: 'gaming',
    price: 899.00,
    previousPrice: 1099.00,
    stock: 15,
    minimumStock: 4,
    rating: 5.0,
    reviewCount: 64,
    badge: 'SALE',
    tipoSeccion: 'ofertas',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=80',
    description: 'Portátil gamer resistente con certificación militar, AMD Ryzen 7 7735HS, NVIDIA GeForce RTX 4060, pantalla 144Hz y teclado RGB.',
    specifications: {
      'Procesador': 'AMD Ryzen 7 7735HS',
      'Gráfica': 'NVIDIA GeForce RTX 4060 8GB',
      'Pantalla': '15.6" FHD 144Hz IPS',
      'RAM & SSD': '16GB DDR5 + 512GB NVMe'
    }
  },
  {
    slug: 'monitor-lg-27-144hz',
    name: 'Monitor LG 27" 144Hz',
    categoria: 'computadoras',
    price: 239.00,
    previousPrice: 299.00,
    stock: 10,
    minimumStock: 3,
    rating: 5.0,
    reviewCount: 42,
    badge: 'SALE',
    tipoSeccion: 'ofertas',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80',
    description: 'Monitor gamer UltraGear IPS de 27 pulgadas, resolución QHD 2K, tasa de refresco 144Hz (1ms MBR) compatible con AMD FreeSync Premium y G-Sync.',
    specifications: {
      'Resolución': '2560 x 1440 QHD',
      'Frecuencia': '144Hz (1ms)',
      'Panel': 'IPS con HDR10 y 99% sRGB',
      'Puertos': '2x HDMI, 1x DP, Salida de audio'
    }
  },
  {
    slug: 'ssd-kingston-1tb',
    name: 'SSD Kingston 1TB',
    categoria: 'componentes',
    price: 89.00,
    previousPrice: 119.00,
    stock: 25,
    minimumStock: 5,
    rating: 5.0,
    reviewCount: 81,
    badge: 'SALE',
    tipoSeccion: 'ofertas',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=80',
    description: 'Unidad de estado sólido NVMe M.2 PCIe 4.0 de alta velocidad Kingston Fury Renegade con disipador de grafeno para velocidades de hasta 7300MB/s.',
    specifications: {
      'Capacidad': '1000GB (1TB)',
      'Velocidad de Lectura': 'Hasta 7,300 MB/s',
      'Velocidad de Escritura': 'Hasta 6,000 MB/s',
      'Factor de Forma': 'M.2 2280 PCIe 4.0 NVMe'
    }
  },
  {
    slug: 'hp-pavilion-15',
    name: 'HP Pavilion 15',
    categoria: 'laptops',
    price: 649.00,
    previousPrice: null,
    stock: 18,
    minimumStock: 4,
    rating: 5.0,
    reviewCount: 120,
    badge: null,
    tipoSeccion: 'masVendidos',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80',
    description: 'Laptop versátil para trabajo y productividad con procesador Intel Core i5, audio de alta calidad B&O, pantalla microborde FHD y carga rápida.',
    specifications: {
      'Procesador': 'Intel Core i5-1235U (10 núcleos)',
      'Memoria RAM': '16GB DDR4 3200MHz',
      'Almacenamiento': '512GB SSD PCIe NVMe',
      'Batería': 'Hasta 8.5 horas con HP Fast Charge'
    }
  },
  {
    slug: 'logitech-g502',
    name: 'Logitech G502',
    categoria: 'perifericos',
    price: 59.00,
    previousPrice: null,
    stock: 30,
    minimumStock: 5,
    rating: 5.0,
    reviewCount: 105,
    badge: null,
    tipoSeccion: 'masVendidos',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80',
    description: 'Mouse gamer icónico con sensor HERO 25K de máxima precisión, 11 botones programables, sistema de pesas ajustables e iluminación RGB LIGHTSYNC.',
    specifications: {
      'Sensor': 'HERO 25K (100 - 25,600 DPI)',
      'Botones': '11 botones totalmente programables',
      'Pesas': '5 pesas extraíbles de 3.6g',
      'Switches': 'Mecánicos con resorte metálico'
    }
  },
  {
    slug: 'memoria-corsair-16gb',
    name: 'Memoria Corsair 16GB',
    categoria: 'componentes',
    price: 49.00,
    previousPrice: null,
    stock: 22,
    minimumStock: 5,
    rating: 5.0,
    reviewCount: 88,
    badge: null,
    tipoSeccion: 'masVendidos',
    image: 'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=500&auto=format&fit=crop&q=80',
    description: 'Kit de memoria RAM DDR4 16GB (2x8GB) 3200MHz Corsair Vengeance LPX / RGB PRO con disipador térmico de aluminio anodizado y soporte XMP 2.0.',
    specifications: {
      'Capacidad': '16GB (2 x 8GB)',
      'Velocidad': 'DDR4 3200MHz (PC4-25600)',
      'Latencia': 'CL16',
      'Compatibilidad': 'Intel y AMD Series'
    }
  },
  {
    slug: 'router-tp-link-archer-ax73',
    name: 'Router TP-Link Archer AX73 WiFi 6',
    categoria: 'redes',
    price: 149.00,
    previousPrice: 179.00,
    stock: 14,
    minimumStock: 3,
    rating: 5.0,
    reviewCount: 52,
    badge: 'NUEVO',
    tipoSeccion: 'general',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=80',
    description: 'Router Gigabit WiFi 6 Dual Band AX5400 con 6 antenas de alta ganancia, tecnología OneMesh y cobertura integral para gaming y streaming 8K.',
    specifications: {
      'Velocidad': 'Hasta 5400 Mbps (4804 Mbps en 5GHz + 574 Mbps en 2.4GHz)',
      'Puertos': '1x Gigabit WAN, 4x Gigabit LAN, 1x USB 3.0',
      'Antenas': '6 antenas de alto rendimiento con Beamforming'
    }
  },
  {
    slug: 'hub-usb-c-anker-8-en-1',
    name: 'Hub USB-C Anker 8 en 1 PowerExpand',
    categoria: 'accesorios',
    price: 49.00,
    previousPrice: null,
    stock: 20,
    minimumStock: 4,
    rating: 5.0,
    reviewCount: 67,
    badge: null,
    tipoSeccion: 'general',
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500&auto=format&fit=crop&q=80',
    description: 'Concentrador USB-C multipuerto con entrega de energía de 100W, salida HDMI 4K@60Hz, Ethernet Gigabit, lector de tarjetas SD y puertos USB 3.1.',
    specifications: {
      'Puertos': 'HDMI 4K@60Hz, 100W PD, Gigabit Ethernet, SD/microSD, 2x USB-A 3.0',
      'Material': 'Carcasa de aluminio disipador de calor',
      'Compatibilidad': 'MacBook, Windows, iPad Pro y laptops con USB-C'
    }
  },
  {
    slug: 'epson-ecotank-l3250',
    name: 'Epson EcoTank L3250 Multifuncional',
    categoria: 'impresoras',
    price: 219.00,
    previousPrice: 249.00,
    stock: 9,
    minimumStock: 2,
    rating: 5.0,
    reviewCount: 73,
    badge: 'SALE',
    tipoSeccion: 'general',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&auto=format&fit=crop&q=80',
    description: 'Impresora multifuncional 3 en 1 con sistema original de tanque de tinta EcoTank, conectividad inalámbrica WiFi Direct e impresión desde móvil con Smart Panel.',
    specifications: {
      'Funciones': 'Imprime, copia y escanea',
      'Rendimiento': 'Hasta 4,500 páginas en negro / 7,500 páginas a color',
      'Conectividad': 'WiFi, WiFi Direct, USB de alta velocidad'
    }
  }
];

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password.length < 12) {
    throw new Error('Define ADMIN_EMAIL y una ADMIN_PASSWORD de al menos 12 caracteres antes de crear el administrador.');
  }

  // 1. Administrador
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: Role.ADMIN, isActive: true },
    create: { name: 'Administrador NAS', email, passwordHash, role: Role.ADMIN }
  });
  console.log(`[Seed] Administrador verificado: ${email}`);

  // 2. Categorías
  const mapaCategorias = new Map();
  for (const cat of CATEGORIAS) {
    const registro = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon, description: cat.description },
      create: { name: cat.name, slug: cat.slug, icon: cat.icon, description: cat.description }
    });
    mapaCategorias.set(cat.slug, registro.id);
  }
  console.log(`[Seed] ${CATEGORIAS.length} categorías sincronizadas.`);

  // 3. Productos
  for (const prod of PRODUCTOS) {
    const categoryId = mapaCategorias.get(prod.categoria);
    if (!categoryId) {
      console.warn(`[Seed] Categoría no encontrada para producto: ${prod.name}`);
      continue;
    }

    const specs = {
      ...(prod.specifications || {}),
      _nasTipoSeccion: prod.tipoSeccion || 'general'
    };

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        description: prod.description,
        image: prod.image,
        price: prod.price,
        previousPrice: prod.previousPrice,
        stock: prod.stock,
        minimumStock: prod.minimumStock,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        badge: prod.badge,
        specifications: specs,
        categoryId,
        isActive: true
      },
      create: {
        slug: prod.slug,
        name: prod.name,
        description: prod.description,
        image: prod.image,
        price: prod.price,
        previousPrice: prod.previousPrice,
        stock: prod.stock,
        minimumStock: prod.minimumStock,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        badge: prod.badge,
        specifications: specs,
        categoryId,
        isActive: true
      }
    });
  }
  console.log(`[Seed] ${PRODUCTOS.length} productos sincronizados en PostgreSQL.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
