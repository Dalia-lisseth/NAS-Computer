export const servicioSolicitudes = {
  crearSolicitudCotizacion: async (datos) => {
    const solicitud = {
      id: `COT-${Date.now().toString().slice(-6)}`,
      fecha: new Date().toISOString(),
      estado: 'Pendiente',
      ...datos
    };
    try {
      const previas = JSON.parse(localStorage.getItem('nas_solicitudes') || '[]');
      localStorage.setItem('nas_solicitudes', JSON.stringify([solicitud, ...previas]));
    } catch (e) {
      console.error(e);
    }
    return Promise.resolve(solicitud);
  },
  obtenerSolicitudes: async () => {
    try {
      const solicitudes = JSON.parse(localStorage.getItem('nas_solicitudes') || '[]');
      return Promise.resolve(solicitudes);
    } catch {
      return Promise.resolve([]);
    }
  },
  crearSolicitudWhatsApp: async ({ usuario, items, total }) => {
    return servicioSolicitudes.crearSolicitudCotizacion({
      usuarioId: usuario.id,
      cliente: {
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        telefono: usuario.telefono || ''
      },
      items,
      total,
      canal: 'whatsapp',
      estado: 'Enviada por WhatsApp'
    });
  },
  obtenerPorUsuario: async ({ id, email } = {}) => {
    const solicitudes = await servicioSolicitudes.obtenerSolicitudes();
    const emailNormalizado = String(email || '').trim().toLowerCase();

    return solicitudes.filter((solicitud) => {
      if (id && solicitud.usuarioId) {
        return solicitud.usuarioId === id;
      }

      // Compatibilidad con solicitudes guardadas antes de asociarlas a una cuenta.
      return !solicitud.usuarioId &&
        String(solicitud.cliente?.email || '').trim().toLowerCase() === emailNormalizado;
    });
  }
};

export default servicioSolicitudes;
