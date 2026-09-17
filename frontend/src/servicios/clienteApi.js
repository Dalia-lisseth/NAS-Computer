const obtenerBaseUrl = () => {
  let url = (import.meta.env.VITE_API_URL || '').trim();
  if (!url) {
    return 'http://localhost:3000/api';
  }
  // Eliminar barras diagonales sobrantes al final
  url = url.replace(/\/+$/, '');
  // Si la URL no tiene /api al final y no es una ruta relativa, agregar /api
  if (!url.endsWith('/api') && !url.includes('/api/')) {
    url = `${url}/api`;
  }
  return url;
};

const API_URL = obtenerBaseUrl();

const extraerMensajeError = async (respuesta) => {
  try {
    const texto = await respuesta.text();
    try {
      const datos = JSON.parse(texto);
      return Array.isArray(datos.message)
        ? datos.message.join('. ')
        : (datos.message || 'No fue posible completar la solicitud.');
    } catch {
      if (respuesta.status === 404) {
        return 'No se encontró la ruta en el servidor (404). Verifica que la URL de Render tenga configurado el prefijo /api.';
      }
      if (respuesta.status === 502 || respuesta.status === 503) {
        return 'El servidor en Render se está despertando (502/503). Espera unos segundos y vuelve a intentar.';
      }
      return texto && texto.length < 250 ? texto : `Error del servidor (${respuesta.status})`;
    }
  } catch {
    return `Error del servidor (${respuesta.status})`;
  }
};

export const solicitarApi = async (ruta, { method = 'GET', body, token } = {}) => {
  const rutaNormalizada = ruta.startsWith('/') ? ruta : `/${ruta}`;
  const urlDestino = `${API_URL}${rutaNormalizada}`;

  const encabezados = {
    Accept: 'application/json',
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {})
  };
  if (token) encabezados.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(urlDestino, {
      method,
      headers: encabezados,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {})
    });
  } catch (error) {
    throw new Error(
      'No se pudo conectar con el servidor backend. Si tu servicio en Render estaba en reposo, puede tardar hasta 1 minuto en encender. Por favor espera unos momentos y reintenta.'
    );
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
