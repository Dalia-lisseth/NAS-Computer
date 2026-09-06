const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const extraerMensajeError = async (respuesta) => {
  try {
    const datos = await respuesta.json();
    return Array.isArray(datos.message) ? datos.message.join('. ') : (datos.message || 'No fue posible completar la solicitud.');
  } catch {
    return 'No fue posible conectar con el servidor.';
  }
};

const solicitar = async (ruta, opciones = {}) => {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, { headers: { 'Content-Type': 'application/json', ...(opciones.headers || {}) }, ...opciones });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté iniciado.');
  }
  if (!respuesta.ok) throw new Error(await extraerMensajeError(respuesta));
  return respuesta.json();
};

const normalizarUsuario = (usuario) => ({
  ...usuario,
  nombre: usuario.name || usuario.nombre || '',
  telefono: usuario.phone || usuario.telefono || '',
  rol: String(usuario.role || usuario.rol || 'CUSTOMER').toLowerCase()
});

export const servicioAutenticacion = {
  iniciarSesion: async (email, password) => {
    const datos = await solicitar('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    return { usuario: normalizarUsuario(datos.user), accessToken: datos.accessToken };
  },
  registrar: async ({ nombre, email, telefono, password }) => {
    const datos = await solicitar('/auth/register', { method: 'POST', body: JSON.stringify({ name: nombre, email, phone: telefono || undefined, password }) });
    return { usuario: normalizarUsuario(datos.user), accessToken: datos.accessToken };
  }
};

export default servicioAutenticacion;
