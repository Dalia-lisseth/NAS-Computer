import { CATEGORIAS } from '../datos/categorias';

export const servicioCategorias = {
  obtenerTodas: async () => {
    return Promise.resolve([...CATEGORIAS]);
  },
  obtenerPorSlug: async (slug) => {
    const cat = CATEGORIAS.find(c => c.slug === slug || c.id === slug);
    return Promise.resolve(cat || null);
  }
};

export default servicioCategorias;
