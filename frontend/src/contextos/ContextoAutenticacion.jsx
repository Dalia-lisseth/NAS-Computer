import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { servicioAutenticacion } from '../servicios/servicioAutenticacion';

const ContextoAutenticacion = createContext(null);
const CLAVE_SESION = 'nas_sesion';

const tokenEstaExpirado = (token) => {
  try {
    const parte = token.split('.')[1];
    const payload = JSON.parse(atob(parte.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const leerSesion = () => {
  try {
    const sesion = sessionStorage.getItem(CLAVE_SESION);
    const datos = sesion ? JSON.parse(sesion) : null;
    return datos?.accessToken && !tokenEstaExpirado(datos.accessToken) ? datos : null;
  } catch {
    return null;
  }
};

export function ProveedorAutenticacion({ children }) {
  const [sesion, setSesion] = useState(leerSesion);
  const [modalLoginAbierto, setModalLoginAbierto] = useState(false);
  const [pestanaInicialModal, setPestanaInicialModal] = useState('login');

  useEffect(() => {
    if (sesion) sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    else sessionStorage.removeItem(CLAVE_SESION);
  }, [sesion]);

  const establecerSesion = (nuevaSesion) => {
    setSesion(nuevaSesion);
    setModalLoginAbierto(false);
    return { exito: true, rol: nuevaSesion.usuario.rol, usuario: nuevaSesion.usuario };
  };

  const iniciarSesionUnificado = async (email, password) => {
    if (!email?.trim() || !password) return { exito: false, mensaje: 'Por favor completa todos los campos requeridos.' };
    try {
      return establecerSesion(await servicioAutenticacion.iniciarSesion(email.trim(), password));
    } catch (error) {
      return { exito: false, mensaje: error.message || 'No fue posible iniciar sesión.' };
    }
  };

  const iniciarSesionAdmin = async (email, password) => {
    const resultado = await iniciarSesionUnificado(email, password);
    if (resultado.exito && resultado.rol !== 'admin') {
      setSesion(null);
      return { exito: false, mensaje: 'Esta cuenta no tiene permisos de administrador.' };
    }
    return resultado;
  };

  const registrarCliente = async ({ nombre, email, telefono, password }) => {
    try {
      return establecerSesion(await servicioAutenticacion.registrar({ nombre, email, telefono, password }));
    } catch (error) {
      return { exito: false, mensaje: error.message || 'No fue posible crear la cuenta.' };
    }
  };

  const abrirModalAuth = (pestana = 'login') => { setPestanaInicialModal(pestana); setModalLoginAbierto(true); };
  const cerrarSesion = useCallback(() => setSesion(null), []);
  const usuario = sesion?.usuario || null;

  return <ContextoAutenticacion.Provider value={{ usuario, accessToken: sesion?.accessToken || null, estaAutenticado: Boolean(usuario), esAdmin: usuario?.rol === 'admin', modalLoginAbierto, setModalLoginAbierto, pestanaInicialModal, abrirModalAuth, iniciarSesion: iniciarSesionUnificado, iniciarSesionUnificado, iniciarSesionAdmin, registrarCliente, cerrarSesion }}>{children}</ContextoAutenticacion.Provider>;
}

export function useAutenticacionContext() {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto) throw new Error('useAutenticacionContext debe ser usado dentro de un ProveedorAutenticacion');
  return contexto;
}

export default ContextoAutenticacion;
