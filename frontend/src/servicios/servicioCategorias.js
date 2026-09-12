import { solicitarApi } from './clienteApi';
import { aDtoCategoria, mapearCategoria } from './mapeoCatalogo';

export const servicioCategorias = {
  obtenerTodas: async () => {
    const categorias = await solicitarApi('/categories');
    return Array.isArray(categorias) ? categorias.map(mapearCategoria) : [];
  },
  obtenerPorSlug: async (slug) => {
    const categorias = await servicioCategorias.obtenerTodas();
    return categorias.find((cat) => cat.slug === slug || cat.id === slug) || null;
  },
  crear: async (datos, token) => {
    const dto = aDtoCategoria(datos);
    if (!dto.name) throw new Error('El nombre de la categoría es obligatorio.');
    return mapearCategoria(await solicitarApi('/categories', { method: 'POST', body: dto, token }));
  },
  actualizar: async (id, datos, token) => {
    const dto = aDtoCategoria(datos);
    return mapearCategoria(await solicitarApi(`/categories/${encodeURIComponent(id)}`, { method: 'PATCH', body: dto, token }));
  },
  eliminar: async (id, token) => {
    await solicitarApi(`/categories/${encodeURIComponent(id)}`, { method: 'DELETE', token });
  }
};

export default servicioCategorias;
