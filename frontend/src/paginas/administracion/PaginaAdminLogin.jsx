import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Store, AlertCircle } from 'lucide-react';
import logoNas from '../../assets/logo/logo-nas.png';
import { useAutenticacionContext } from '../../contextos/ContextoAutenticacion';

export function PaginaAdminLogin({ onLoginExitoso, onIrATienda }) {
  const { iniciarSesionAdmin } = useAutenticacionContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const res = await iniciarSesionAdmin(email, password);
    setCargando(false);
    if (res.exito) {
      if (onLoginExitoso) onLoginExitoso();
    } else {
      setError(res.mensaje || 'Credenciales inválidas');
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card anim-fade-in">
        <div className="admin-login-brand">
          <img src={logoNas} alt="NAS Computer" className="admin-login-logo" />
          <span className="admin-portal-tag">
            <ShieldCheck size={14} /> PORTAL ADMINISTRATIVO
          </span>
        </div>

        <h1 className="admin-login-titulo">Acceso Restringido</h1>
        <p className="admin-login-sub">Introduce tus credenciales autorizadas para gestionar el catálogo, inventario y solicitudes.</p>

        {error && (
          <div className="admin-login-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="campo-grupo">
            <label className="campo-label"><Mail size={14} /> Usuario / Email Administrativo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="campo-input"
              placeholder="admin@nascomputer.com"
            />
          </div>

          <div className="campo-grupo">
            <label className="campo-label"><Lock size={14} /> Contraseña de Seguridad</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="campo-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="btn-entrar-admin"
          >
            <span>{cargando ? 'Verificando...' : 'Ingresar al Panel'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="admin-login-footer">
          <button
            type="button"
            className="btn-volver-tienda"
            onClick={onIrATienda}
          >
            <Store size={15} />
            <span>Volver a la Tienda Pública</span>
          </button>
        </div>
      </div>

      <style>{`
        .admin-login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #04070f;
          padding: 1.5rem;
          background-image: 
            radial-gradient(circle at 50% 20%, rgba(0, 180, 216, 0.12) 0%, transparent 60%),
            radial-gradient(circle at 80% 80%, rgba(0, 119, 182, 0.08) 0%, transparent 50%);
        }

        .admin-login-card {
          width: 100%;
          max-width: 440px;
          background: #080f20;
          border: 1px solid #1c3057;
          border-radius: var(--radio-xl);
          padding: 2.5rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 180, 216, 0.2);
          display: flex;
          flex-direction: column;
        }

        .admin-login-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .admin-login-logo {
          height: 48px;
          object-fit: contain;
        }

        .admin-portal-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          font-weight: 800;
          color: #00d2ff;
          background: rgba(0, 180, 216, 0.12);
          border: 1px solid rgba(0, 210, 255, 0.3);
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          letter-spacing: 0.08em;
        }

        .admin-login-titulo {
          font-size: 1.45rem;
          font-weight: 800;
          color: #ffffff;
          text-align: center;
        }

        .admin-login-sub {
          font-size: 0.82rem;
          color: #8497b0;
          text-align: center;
          margin-top: 0.3rem;
          margin-bottom: 1.5rem;
        }

        .admin-login-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          font-size: 0.8rem;
          margin-bottom: 1rem;
        }

        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .btn-entrar-admin {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%);
          color: #ffffff;
          padding: 0.8rem;
          border-radius: var(--radio-md);
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: all 0.2s ease;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.4);
        }

        .btn-entrar-admin:hover:not(:disabled) {
          background: linear-gradient(135deg, #00d2ff 0%, #0096c7 100%);
          box-shadow: 0 0 25px rgba(0, 210, 255, 0.6);
        }

        .admin-login-footer {
          margin-top: 1.5rem;
          display: flex;
          justify-content: center;
        }

        .btn-volver-tienda {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.82rem;
          color: #64748b;
          cursor: pointer;
          transition: color 0.2s;
        }

        .btn-volver-tienda:hover {
          color: #10b981;
        }
      `}</style>
    </div>
  );
}

export default PaginaAdminLogin;
