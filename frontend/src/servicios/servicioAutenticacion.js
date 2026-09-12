import { solicitarApi } from './clienteApi';

const normalizarUsuario = (usuario) => ({
  ...usuario,
  nombre: usuario.name || usuario.nombre || '',
  telefono: usuario.phone || usuario.telefono || '',
  rol: String(usuario.role || usuario.rol || 'CUSTOMER').toLowerCase()
});

export const servicioAutenticacion = {
  iniciarSesion: async (email, password) => {
    const datos = await solicitarApi('/auth/login', { method: 'POST', body: { email, password } });
    return { usuario: normalizarUsuario(datos.user), accessToken: datos.accessToken };
  },
  registrar: async ({ nombre, email, telefono, password }) => {
    const datos = await solicitarApi('/auth/register', { method: 'POST', body: { name: nombre, email, phone: telefono || undefined, password } });
    return { usuario: normalizarUsuario(datos.user), accessToken: datos.accessToken };
  }
};

export default servicioAutenticacion;
