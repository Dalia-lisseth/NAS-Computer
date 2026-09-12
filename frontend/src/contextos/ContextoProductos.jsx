import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { BANNERS as BANNERS_DEFAULT } from '../datos/banners';
import { useAutenticacionContext } from './ContextoAutenticacion';
import { servicioCategorias } from '../servicios/servicioCategorias';
import { servicioProductos } from '../servicios/servicioProductos';

const ContextoProductos = createContext(null);

export function ProveedorProductos({ children }) {
  const { accessToken, esAdmin, cerrarSesion } = useAutenticacionContext();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true);
  const [errorCatalogo, setErrorCatalogo] = useState('');
  const solicitudCatalogoRef = useRef(0);

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

  const recargarCatalogo = useCallback(async () => {
    const solicitudActual = ++solicitudCatalogoRef.current;
    setCargandoCatalogo(true);
    try {
      const [categoriasApi, productosApi] = await Promise.all([
        servicioCategorias.obtenerTodas(),
        servicioProductos.obtenerTodos({ token: accessToken, incluirInactivos: Boolean(esAdmin && accessToken) })
      ]);
      if (solicitudActual !== solicitudCatalogoRef.current) return;
      setCategorias(categoriasApi);
      setProductos(productosApi);
      setErrorCatalogo('');
    } catch (error) {
      if (solicitudActual !== solicitudCatalogoRef.current) return;
      console.error('Error al cargar el catálogo:', error);
      if (error.status === 401) cerrarSesion();
      setErrorCatalogo(error.message || 'No fue posible cargar el catálogo.');
    } finally {
      if (solicitudActual === solicitudCatalogoRef.current) setCargandoCatalogo(false);
    }
  }, [accessToken, cerrarSesion, esAdmin]);

  useEffect(() => {
    recargarCatalogo();
    return () => { solicitudCatalogoRef.current += 1; };
  }, [recargarCatalogo]);

  useEffect(() => {
    try {
      localStorage.setItem('nas_banners', JSON.stringify(banners));
    } catch (e) {
      console.error('Error al guardar banners en localStorage:', e);
    }
  }, [banners]);

  const exigirAdmin = () => {
    if (!accessToken || !esAdmin) {
      throw new Error('Inicia sesión como administrador para gestionar el catálogo.');
    }
  };

  const ejecutarComoAdmin = async (operacion) => {
    exigirAdmin();
    try {
      return await operacion();
    } catch (error) {
      if (error.status === 401) cerrarSesion();
      throw error;
    }
  };

  const agregarProducto = async (nuevoProducto) => {
    const creado = await ejecutarComoAdmin(() => servicioProductos.crear(nuevoProducto, categorias, accessToken));
    setProductos((prev) => [creado, ...prev]);
    return creado;
  };

  const actualizarProducto = async (id, datosActualizados) => {
    const actual = productos.find((p) => p.id === id);
    const actualizado = await ejecutarComoAdmin(() => servicioProductos.actualizar(id, datosActualizados, categorias, accessToken, actual));
    setProductos((prev) => prev.map((p) => (p.id === id ? actualizado : p)));
    return actualizado;
  };

  const eliminarProducto = async (id) => {
    await ejecutarComoAdmin(() => servicioProductos.eliminar(id, accessToken));
    setProductos((prev) => prev.filter((p) => p.id !== id && p.slug !== id));
  };

  const actualizarStock = async (id, nuevoStock) => {
    return actualizarProducto(id, { stock: Math.max(0, Number(nuevoStock)) });
  };

  const alternarEstadoOferta = async (id, esOferta, precioOferta = null) => {
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;

    if (esOferta) {
      const precioActual = producto.precio;
      const nuevoPrecioOferta = precioOferta || Math.round(precioActual * 0.85);
      return actualizarProducto(id, {
        badge: 'SALE',
        precioAnterior: precioActual,
        precio: nuevoPrecioOferta,
        tipoSeccion: producto.tipoSeccion === 'general' ? 'ofertas' : producto.tipoSeccion
      });
    }

    return actualizarProducto(id, {
      badge: null,
      precio: producto.precioAnterior || producto.precio,
      precioAnterior: null,
      tipoSeccion: producto.tipoSeccion === 'ofertas' ? 'general' : producto.tipoSeccion
    });
  };

  const agregarCategoria = async (nuevaCat) => {
    const creada = await ejecutarComoAdmin(() => servicioCategorias.crear(nuevaCat, accessToken));
    setCategorias((prev) => [...prev, creada]);
    return creada;
  };

  const actualizarCategoria = async (id, datos) => {
    const actualizada = await ejecutarComoAdmin(() => servicioCategorias.actualizar(id, datos, accessToken));
    setCategorias((prev) => prev.map((c) => (c.id === id ? actualizada : c)));
    setProductos((prev) => prev.map((p) => (
      p.categoriaId === id
        ? { ...p, categoria: actualizada.slug, categoriaSlug: actualizada.slug, categoriaNombre: actualizada.nombre }
        : p
    )));
    return actualizada;
  };

  const eliminarCategoria = async (id) => {
    await ejecutarComoAdmin(() => servicioCategorias.eliminar(id, accessToken));
    const categoriaAEliminar = categorias.find((c) => c.id === id || c.slug === id);
    const slugAEliminar = categoriaAEliminar?.slug || id;
    setCategorias((prev) => prev.filter((c) => c.id !== id && c.slug !== slugAEliminar));
  };

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

    setBanners((prev) => [bannerNuevo, ...prev]);
    return bannerNuevo;
  };

  const actualizarBanner = (id, datos) => {
    setBanners((prev) => prev.map((banner) =>
      banner.id === id ? { ...banner, ...datos } : banner
    ));
  };

  const eliminarBanner = (id) => {
    setBanners((prev) => prev.filter((banner) => banner.id !== id));
  };

  const reordenarBanners = (indiceInicial, indiceFinal) => {
    setBanners((prev) => {
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
    cargandoCatalogo,
    errorCatalogo,
    recargarCatalogo,
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
