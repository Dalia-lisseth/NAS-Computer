export const servicioUsuarios = {
  obtenerPerfil: async () => {
    try {
      const guardado = localStorage.getItem('nas_usuario');
      return Promise.resolve(guardado ? JSON.parse(guardado) : null);
    } catch {
      return Promise.resolve(null);
    }
  },
  actualizarPerfil: async (datos) => {
    try {
      localStorage.setItem('nas_usuario', JSON.stringify(datos));
      return Promise.resolve(datos);
    } catch (e) {
      return Promise.reject(e);
    }
  }
};

export default servicioUsuarios;
