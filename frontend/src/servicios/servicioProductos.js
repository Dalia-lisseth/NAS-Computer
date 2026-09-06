import { PRODUCTOS, PRODUCTOS_DESTACADOS, PRODUCTOS_OFERTAS, PRODUCTOS_MAS_VENDIDOS } from '../datos/productos';

export const servicioProductos = {
  obtenerTodos: async () => {
    return Promise.resolve([...PRODUCTOS]);
  },
  obtenerPorId: async (id) => {
    const producto = PRODUCTOS.find(p => p.id === id || p.slug === id);
    return Promise.resolve(producto || null);
  },
  obtenerDestacados: async () => {
    return Promise.resolve([...PRODUCTOS_DESTACADOS]);
  },
  obtenerOfertas: async () => {
    return Promise.resolve([...PRODUCTOS_OFERTAS]);
  },
  obtenerMasVendidos: async () => {
    return Promise.resolve([...PRODUCTOS_MAS_VENDIDOS]);
  },
  obtenerPorCategoria: async (categoriaSlug) => {
    const filtrados = PRODUCTOS.filter(p => p.categoria.toLowerCase() === categoriaSlug.toLowerCase());
    return Promise.resolve(filtrados);
  },
  buscar: async (termino) => {
    if (!termino) return Promise.resolve([...PRODUCTOS]);
    const q = termino.toLowerCase();
    const resultados = PRODUCTOS.filter(
      p => p.nombre.toLowerCase().includes(q) || p.categoriaNombre.toLowerCase().includes(q)
    );
    return Promise.resolve(resultados);
  }
};

export default servicioProductos;
