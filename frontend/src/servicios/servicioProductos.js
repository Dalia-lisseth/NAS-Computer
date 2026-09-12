import { solicitarApi } from './clienteApi';
import { aDtoProducto, mapearProducto } from './mapeoCatalogo';

export const servicioProductos = {
  obtenerTodos: async ({ token, incluirInactivos = false } = {}) => {
    const ruta = incluirInactivos && token ? '/products/admin' : '/products';
    const productos = await solicitarApi(ruta, { token: incluirInactivos ? token : undefined });
    return Array.isArray(productos) ? productos.map(mapearProducto) : [];
  },
  obtenerPorId: async (id) => {
    const producto = await solicitarApi(`/products/${encodeURIComponent(id)}`);
    return producto ? mapearProducto(producto) : null;
  },
  crear: async (datos, categorias, token) => {
    const dto = aDtoProducto({
      ...datos,
      tipoSeccion: datos.tipoSeccion || 'general',
      especificaciones: datos.especificaciones || {},
      fechaFinOferta: datos.fechaFinOferta || null
    }, categorias);
    if (!dto.name || dto.price === undefined || !dto.categoryId) {
      throw new Error('Completa nombre, precio y categoría para crear el producto.');
    }
    if (dto.previousPrice == null) delete dto.previousPrice;
    if (!dto.badge) delete dto.badge;
    return mapearProducto(await solicitarApi('/products', { method: 'POST', body: dto, token }));
  },
  actualizar: async (id, datos, categorias, token, productoActual) => {
    const dto = aDtoProducto(datos, categorias, productoActual);
    return mapearProducto(await solicitarApi(`/products/${encodeURIComponent(id)}`, { method: 'PATCH', body: dto, token }));
  },
  eliminar: async (id, token) => {
    await solicitarApi(`/products/${encodeURIComponent(id)}`, { method: 'DELETE', token });
  }
};

export default servicioProductos;
