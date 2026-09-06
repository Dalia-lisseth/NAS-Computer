import { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTOS } from '../datos/productos';
import { CATEGORIAS } from '../datos/categorias';
import { BANNERS as BANNERS_DEFAULT } from '../datos/banners';

const ContextoProductos = createContext(null);

const normalizarCategoria = (valor) => {
  if (valor === null || valor === undefined) return '';
  return String(valor)
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');
};

export function ProveedorProductos({ children }) {
  // Estado de Productos con persistencia en localStorage
  const [productos, setProductos] = useState(() => {
    try {
      const guardados = localStorage.getItem('nas_catalogo_productos');
      if (guardados) {
        const parseados = JSON.parse(guardados);
        if (Array.isArray(parseados)) {
          // Respetar estrictamente eliminaciones y purgar cualquier residuo de smartphones
          return parseados.filter(
            (p) => p.id !== 'prod-cel-1' && p.categoria !== 'smartphones' && p.categoriaSlug !== 'smartphones'
          );
        }
      }
    } catch (e) {
      console.error('Error al cargar productos de localStorage:', e);
    }
    // Inicializar agregando información de stock inicial a los productos base
    return PRODUCTOS.map((p, index) => ({
      ...p,
      stock: p.stock !== undefined ? p.stock : (index === 2 ? 3 : index === 5 ? 1 : 12),
      stockMinimo: 4
    }));
  });

  // Estado de Categorías con persistencia en localStorage
  const [categorias, setCategorias] = useState(() => {
    try {
      const guardadas = localStorage.getItem('nas_catalogo_categorias');
      if (guardadas) {
        const parseadas = JSON.parse(guardadas);
        if (Array.isArray(parseadas)) {
          // Purgar cualquier residuo de categoría smartphones
          return parseadas.filter(
            (c) => c.id !== 'smartphones' && c.slug !== 'smartphones'
          );
        }
      }
    } catch (e) {
      console.error('Error al cargar categorías de localStorage:', e);
    }
    return [...CATEGORIAS];
  });

  // Estado global de banners del carrusel con persistencia
  const [banners, setBanners] = useState(() => {
    try {
      const guardados = localStorage.getItem('nas_banners');
      if (guardados) {
        const parseados = JSON.parse(guardados);
        if (Array.isArray(parseados) && parseados.length) {
          return parseados.map((banner) => {
            const esBannerCotizacion =
              banner.id === 'banner-workstations' || banner.botonTexto === 'Cotizar Solución';

            return esBannerCotizacion
              ? { ...banner, enlace: '/mi-seleccion' }
              : banner;
          });
        }
      }
    } catch (e) {
      console.error('Error al cargar banners de localStorage:', e);
    }
    return BANNERS_DEFAULT.map((banner) => ({ ...banner }));
  });

  // Guardar en localStorage ante cualquier cambio
  useEffect(() => {
    try {
      localStorage.setItem('nas_catalogo_productos', JSON.stringify(productos));
    } catch (e) {
      console.error('Error al guardar productos en localStorage:', e);
    }
  }, [productos]);

  useEffect(() => {
    try {
      localStorage.setItem('nas_catalogo_categorias', JSON.stringify(categorias));
    } catch (e) {
      console.error('Error al guardar categorías en localStorage:', e);
    }
  }, [categorias]);

  useEffect(() => {
    try {
      localStorage.setItem('nas_banners', JSON.stringify(banners));
    } catch (e) {
      console.error('Error al guardar banners en localStorage:', e);
    }
  }, [banners]);

  // --- MÉTODOS CRUD PRODUCTOS ---

  const agregarProducto = (nuevoProducto) => {
    const idGenerado = `prod-nas-${Date.now()}`;
    const slugGenerado = nuevoProducto.nombre
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const categoriaRelacionada = categorias.find(
      cat =>
        cat.slug === nuevoProducto.categoria ||
        cat.id === nuevoProducto.categoria ||
        cat.nombre?.toLowerCase() === String(nuevoProducto.categoriaNombre || '').toLowerCase()
    );

    const categoriaSlug = categoriaRelacionada?.slug || nuevoProducto.categoria || 'general';
    const categoriaNombre = categoriaRelacionada?.nombre || nuevoProducto.categoriaNombre || 'General';

    const productoCompleto = {
      id: idGenerado,
      slug: slugGenerado,
      rating: 5,
      totalReviews: 0,
      stock: Number(nuevoProducto.stock) || 0,
      stockMinimo: Number(nuevoProducto.stockMinimo) || 4,
      tipoSeccion: nuevoProducto.tipoSeccion || 'general',
      imagen: nuevoProducto.imagen || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80',
      categoria: categoriaSlug,
      categoriaNombre,
      categoriaId: categoriaRelacionada?.id || categoriaSlug,
      categoriaSlug: categoriaSlug,
      ...nuevoProducto,
      precio: Number(nuevoProducto.precio) || 0,
      precioAnterior: nuevoProducto.precioAnterior ? Number(nuevoProducto.precioAnterior) : null,
    };

    setProductos(prev => [productoCompleto, ...prev]);
    return productoCompleto;
  };

  const actualizarProducto = (id, datosActualizados) => {
    setProductos(prev =>
      prev.map(p => {
        if (p.id === id) {
          const categoriaRelacionada = categorias.find(
            cat =>
              cat.slug === (datosActualizados.categoria || p.categoria) ||
              cat.id === (datosActualizados.categoria || p.categoria) ||
              cat.nombre?.toLowerCase() === String(datosActualizados.categoriaNombre || p.categoriaNombre || '').toLowerCase()
          );

          const categoriaSlug = categoriaRelacionada?.slug || datosActualizados.categoria || p.categoria || 'general';
          const categoriaNombre = categoriaRelacionada?.nombre || datosActualizados.categoriaNombre || p.categoriaNombre || 'General';

          return {
            ...p,
            ...datosActualizados,
            categoria: categoriaSlug,
            categoriaNombre,
            categoriaId: categoriaRelacionada?.id || categoriaSlug,
            categoriaSlug,
            precio: Number(datosActualizados.precio !== undefined ? datosActualizados.precio : p.precio),
            precioAnterior: datosActualizados.precioAnterior ? Number(datosActualizados.precioAnterior) : null,
            stock: Number(datosActualizados.stock !== undefined ? datosActualizados.stock : p.stock)
          };
        }
        return p;
      })
    );
  };

  const eliminarProducto = (id) => {
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  const actualizarStock = (id, nuevoStock) => {
    const valor = Math.max(0, Number(nuevoStock));
    setProductos(prev =>
      prev.map(p => (p.id === id ? { ...p, stock: valor } : p))
    );
  };

  const alternarEstadoOferta = (id, esOferta, precioOferta = null) => {
    setProductos(prev =>
      prev.map(p => {
        if (p.id === id) {
          if (esOferta) {
            const precioActual = p.precio;
            const nuevoPrecioOferta = precioOferta || Math.round(precioActual * 0.85);
            return {
              ...p,
              badge: 'SALE',
              precioAnterior: precioActual,
              precio: nuevoPrecioOferta,
              tipoSeccion: p.tipoSeccion === 'general' ? 'ofertas' : p.tipoSeccion
            };
          }

          const precioBase = p.precioAnterior || p.precio;
          return {
            ...p,
            badge: null,
            precio: precioBase,
            precioAnterior: null,
            tipoSeccion: p.tipoSeccion === 'ofertas' ? 'general' : p.tipoSeccion
          };
        }
        return p;
      })
    );
  };

  // --- MÉTODOS CRUD CATEGORÍAS ---

  const agregarCategoria = (nuevaCat) => {
    const id = nuevaCat.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const categoriaCompleta = {
      id,
      slug: id,
      icono: 'Cpu',
      ...nuevaCat
    };
    setCategorias(prev => [...prev, categoriaCompleta]);
    return categoriaCompleta;
  };

  const actualizarCategoria = (id, datos) => {
    setCategorias(prev =>
      prev.map(c => (c.id === id ? { ...c, ...datos } : c))
    );
  };

  const eliminarCategoria = (id, eliminarProductosAsociados = true) => {
    const categoriaAEliminar = categorias.find(c => c.id === id || c.slug === id);
    const slugAEliminar = categoriaAEliminar?.slug || id;

    setCategorias(prev => prev.filter(c => c.id !== id && c.slug !== slugAEliminar));

    if (eliminarProductosAsociados) {
      setProductos(prev =>
        prev.filter(
          p =>
            p.categoria !== slugAEliminar &&
            p.categoria !== id &&
            p.categoriaId !== id &&
            p.categoriaSlug !== slugAEliminar
        )
      );
    }
  };

  // --- MÉTODOS CRUD BANNERS ---

  const agregarBanner = (nuevoBanner) => {
    const bannerNuevo = {
      id: nuevoBanner.id || `banner-${Date.now()}`,
      activo: nuevoBanner.activo !== false,
      imagen: nuevoBanner.imagen || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
      titulo: nuevoBanner.titulo || 'Nuevo banner',
      tituloResaltado: nuevoBanner.tituloResaltado || 'NAS',
      subtitulo: nuevoBanner.subtitulo || 'Nueva promoción disponible.',
      enlace: nuevoBanner.enlace || '/catalogo',
      botonTexto: nuevoBanner.botonTexto || 'Ver ahora',
      beneficios: Array.isArray(nuevoBanner.beneficios) && nuevoBanner.beneficios.length ? nuevoBanner.beneficios : [
        { texto: 'Envíos rápidos' },
        { texto: 'Garantía NAS' },
        { texto: 'Soporte técnico' }
      ]
    };

    setBanners(prev => [bannerNuevo, ...prev]);
    return bannerNuevo;
  };

  const actualizarBanner = (id, datos) => {
    setBanners(prev => prev.map(banner =>
      banner.id === id ? { ...banner, ...datos } : banner
    ));
  };

  const eliminarBanner = (id) => {
    setBanners(prev => prev.filter(banner => banner.id !== id));
  };

  const reordenarBanners = (indiceInicial, indiceFinal) => {
    setBanners(prev => {
      const copia = [...prev];
      const [item] = copia.splice(indiceInicial, 1);
      if (!item) return prev;
      copia.splice(indiceFinal, 0, item);
      return copia;
    });
  };

  const valor = {
    productos,
    categorias,
    banners,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    actualizarStock,
    alternarEstadoOferta,
    agregarCategoria,
    actualizarCategoria,
    eliminarCategoria,
    agregarBanner,
    actualizarBanner,
    eliminarBanner,
    reordenarBanners,
    setBanners
  };

  return (
    <ContextoProductos.Provider value={valor}>
      {children}
    </ContextoProductos.Provider>
  );
}

export function useProductosContext() {
  const contexto = useContext(ContextoProductos);
  if (!contexto) {
    throw new Error('useProductosContext debe usarse dentro de un ProveedorProductos');
  }
  return contexto;
}

export default ContextoProductos;
