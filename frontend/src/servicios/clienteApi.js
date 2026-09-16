const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const extraerMensajeError = async (respuesta) => {
  try {
    const texto = await respuesta.text();
    try {
      const datos = JSON.parse(texto);
      return Array.isArray(datos.message) ? datos.message.join('. ') : (datos.message || 'No fue posible completar la solicitud.');
    } catch {
      return texto || `Error del servidor (${respuesta.status})`;
    }
  } catch {
    return `Error del servidor (${respuesta.status})`;
  }
};

export const solicitarApi = async (ruta, { method = 'GET', body, token } = {}) => {
  const encabezados = { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}) };
  if (token) encabezados.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method,
      headers: encabezados,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {})
    });
  } catch {
    if (API_URL.startsWith('http')) {
      try {
        respuesta = await fetch(`/api${ruta}`, {
          method,
          headers: encabezados,
          ...(body !== undefined ? { body: JSON.stringify(body) } : {})
        });
      } catch {
        throw new Error('No se pudo conectar con el servidor. Asegúrate de que el backend esté ejecutándose en el puerto 3000 (npm run start:dev en la carpeta backend).');
      }
    } else {
      throw new Error('No se pudo conectar con el servidor. Asegúrate de que el backend esté ejecutándose en el puerto 3000 (npm run start:dev en la carpeta backend).');
    }
  }

  if (!respuesta.ok) {
    const error = new Error(await extraerMensajeError(respuesta));
    error.status = respuesta.status;
    throw error;
  }
  if (respuesta.status === 204) return null;

  const texto = await respuesta.text();
  return texto ? JSON.parse(texto) : null;
};

export default solicitarApi;
