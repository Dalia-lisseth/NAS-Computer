import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  UserPlus,
  LogIn,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAutenticacionContext } from '../../contextos/ContextoAutenticacion';

export function ModalLogin({ onRedireccionarAdmin }) {
  const {
    modalLoginAbierto,
    setModalLoginAbierto,
    pestanaInicialModal,
    iniciarSesionUnificado,
    registrarCliente
  } = useAutenticacionContext();

  const [pestana, setPestana] = useState('login'); // 'login' | 'registro'
  const [error, setError] = useState('');
  const [exitoMsg, setExitoMsg] = useState('');
  const [cargando, setCargando] = useState(false);

  // Formulario Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Formulario Registro Cliente
  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regTelefono, setRegTelefono] = useState('');
  const [regPassword, setRegPassword] = useState('');

  useEffect(() => {
    if (pestanaInicialModal) {
      setPestana(pestanaInicialModal);
    }
    setError('');
    setExitoMsg('');
  }, [pestanaInicialModal, modalLoginAbierto]);

  if (!modalLoginAbierto) return null;

  const manejarSubmitLogin = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const res = await iniciarSesionUnificado(loginEmail, loginPassword);
    setCargando(false);

    if (res.exito) {
      if (res.rol === 'admin') {
        setExitoMsg('¡Credenciales de Administrador verificadas! Redirigiendo al Panel...');
        setTimeout(() => {
          if (onRedireccionarAdmin) onRedireccionarAdmin();
        }, 600);
      } else {
        setExitoMsg(`¡Bienvenido de nuevo, ${res.usuario.nombre}!`);
      }
    } else {
      setError(res.mensaje || 'Error al iniciar sesión');
    }
  };

  const manejarSubmitRegistro = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const res = await registrarCliente({
      nombre: regNombre,
      email: regEmail,
      telefono: regTelefono,
      password: regPassword
    });
    setCargando(false);

    if (res.exito) setExitoMsg('¡Cuenta de cliente creada exitosamente!');
    else setError(res.mensaje || 'Error al registrar cliente');
  };

  return (
    <div className="modal-nas-overlay" onClick={() => setModalLoginAbierto(false)}>
      <div className="modal-auth-unificado-card anim-fade-in" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-nas-cerrar"
          onClick={() => setModalLoginAbierto(false)}
          aria-label="Cerrar ventana"
        >
          <X size={20} />
        </button>

        {/* Pestañas de Navegación */}
        <div className="auth-pestanas-nav">
          <button
            type="button"
            className={`auth-pestana-btn ${pestana === 'login' ? 'activa' : ''}`}
            onClick={() => { setPestana('login'); setError(''); setExitoMsg(''); }}
          >
            <LogIn size={16} />
            <span>Iniciar Sesión</span>
          </button>

          <button
            type="button"
            className={`auth-pestana-btn ${pestana === 'registro' ? 'activa' : ''}`}
            onClick={() => { setPestana('registro'); setError(''); setExitoMsg(''); }}
          >
            <UserPlus size={16} />
            <span>Registrarse</span>
          </button>
        </div>

        {/* Mensajes de Alerta */}
        {error && (
          <div className="auth-alerta error anim-fade-in">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {exitoMsg && (
          <div className="auth-alerta exito anim-fade-in">
            <CheckCircle2 size={16} />
            <span>{exitoMsg}</span>
          </div>
        )}

        {/* FORMULARIO 1: INICIAR SESIÓN UNIFICADO */}
        {pestana === 'login' ? (
          <form onSubmit={manejarSubmitLogin} className="auth-formulario-body">
            <div className="auth-intro-txt">
              <h3>Bienvenido a NAS Computer</h3>
              <p>Ingresa tus datos. El sistema detectará automáticamente tu perfil (Cliente o Administrador).</p>
            </div>

            <div className="campo-grupo">
              <label className="campo-label"><Mail size={14} /> Correo Electrónico o Usuario *</label>
              <input
                type="text"
                required
                placeholder="tu@correo.com o admin@nascomputer.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="campo-input"
              />
            </div>

            <div className="campo-grupo">
              <label className="campo-label"><Lock size={14} /> Contraseña *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="campo-input"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="btn-auth-submit"
            >
              <span>{cargando ? 'Accediendo...' : 'Ingresar'}</span>
              <ArrowRight size={16} />
            </button>

            <div className="auth-alternativa-txt">
              <span>¿No tienes una cuenta aún?</span>
              <button
                type="button"
                className="enlace-cambio-pestana"
                onClick={() => { setPestana('registro'); setError(''); }}
              >
                Crear cuenta de cliente
              </button>
            </div>
          </form>
        ) : (
          /* FORMULARIO 2: REGISTRO DE CLIENTES */
          <form onSubmit={manejarSubmitRegistro} className="auth-formulario-body">
            <div className="auth-intro-txt">
              <h3>Registro de Cliente</h3>
              <p>Crea tu cuenta para guardar cotizaciones personalizadas y recibir atención preferencial.</p>
            </div>

            <div className="campo-grupo">
              <label className="campo-label"><User size={14} /> Nombre Completo *</label>
              <input
                type="text"
                required
                placeholder="Ej: Daniel Romero"
                value={regNombre}
                onChange={(e) => setRegNombre(e.target.value)}
                className="campo-input"
              />
            </div>

            <div className="campo-grupo">
              <label className="campo-label"><Mail size={14} /> Correo Electrónico *</label>
              <input
                type="email"
                required
                placeholder="daniel@empresa.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="campo-input"
              />
            </div>

            <div className="campo-grupo">
              <label className="campo-label"><Phone size={14} /> Teléfono / WhatsApp</label>
              <input
                type="tel"
                placeholder="+593 96 046 6181"
                value={regTelefono}
                onChange={(e) => setRegTelefono(e.target.value)}
                className="campo-input"
              />
            </div>

            <div className="campo-grupo">
              <label className="campo-label"><Lock size={14} /> Contraseña *</label>
              <input
                type="password"
                required
                minLength={12}
                placeholder="Mínimo 12 caracteres; mayúscula, minúscula y número"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="campo-input"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="btn-auth-submit"
            >
              <span>{cargando ? 'Creando cuenta...' : 'Crear Cuenta'}</span>
              <ArrowRight size={16} />
            </button>

            <div className="auth-alternativa-txt">
              <span>¿Ya tienes cuenta?</span>
              <button
                type="button"
                className="enlace-cambio-pestana"
                onClick={() => { setPestana('login'); setError(''); }}
              >
                Iniciar sesión
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .modal-nas-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: rgba(2, 6, 18, 0.75);
          backdrop-filter: blur(3px);
        }

        .modal-auth-unificado-card {
          position: relative;
          background: #091022;
          border: 1px solid #1c3057;
          border-radius: var(--radio-xl);
          padding: 2.2rem;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 180, 216, 0.25);
        }

        .auth-pestanas-nav {
          display: flex;
          background: #060b17;
          border: 1px solid #162645;
          border-radius: var(--radio-md);
          padding: 0.25rem;
          margin-bottom: 1.5rem;
          gap: 0.25rem;
        }

        .auth-pestana-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem;
          border-radius: 6px;
          color: #8497b0;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .auth-pestana-btn:hover {
          color: #ffffff;
        }

        .auth-pestana-btn.activa {
          background: #0f1c38;
          color: #00d2ff;
          border: 1px solid rgba(0, 210, 255, 0.3);
          box-shadow: 0 0 10px rgba(0, 180, 216, 0.2);
        }

        .auth-intro-txt {
          margin-bottom: 1.25rem;
        }

        .auth-intro-txt h3 {
          font-size: 1.25rem;
          color: #ffffff;
          font-weight: 700;
        }

        .auth-intro-txt p {
          font-size: 0.8rem;
          color: #8497b0;
          margin-top: 0.2rem;
          line-height: 1.4;
        }

        .campo-grupo {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .campo-label {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: #dfecff;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .campo-input {
          width: 100%;
          background: rgba(8, 18, 31, 0.9);
          border: 1px solid rgba(120, 147, 188, 0.35);
          border-radius: 12px;
          color: #f8fbff;
          padding: 0.8rem 0.9rem;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .campo-input::placeholder {
          color: #7d8ea5;
        }

        .campo-input:focus {
          border-color: rgba(0, 210, 255, 0.8);
          box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.12);
        }

        .auth-formulario-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .btn-auth-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%);
          color: #ffffff;
          padding: 0.8rem;
          border-radius: var(--radio-md);
          font-weight: 700;
          font-size: 0.92rem;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: all 0.2s ease;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.35);
        }

        .btn-auth-submit:hover:not(:disabled) {
          background: linear-gradient(135deg, #00d2ff 0%, #0096c7 100%);
          box-shadow: 0 0 25px rgba(0, 210, 255, 0.6);
        }

        .auth-alternativa-txt {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: #64748b;
          margin-top: 0.5rem;
        }

        .enlace-cambio-pestana {
          color: #00d2ff;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
        }

        .enlace-cambio-pestana:hover {
          color: #38bdf8;
        }

        .auth-alerta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          font-size: 0.8rem;
          margin-bottom: 1rem;
        }

        .auth-alerta.error {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
        }

        .auth-alerta.exito {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #86efac;
        }
      `}</style>
    </div>
  );
}

export default ModalLogin;
