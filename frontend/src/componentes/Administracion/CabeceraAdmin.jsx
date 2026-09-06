import React from 'react';
import { User, Bell, ExternalLink } from 'lucide-react';
import { useAutenticacionContext } from '../../contextos/ContextoAutenticacion';

export function CabeceraAdmin({ titulo = 'Dashboard', onIrATienda }) {
  const { usuario } = useAutenticacionContext();

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-titulo-area">
        <h1 className="admin-topbar-titulo">{titulo}</h1>
      </div>

      <div className="admin-topbar-acciones">
        <button
          type="button"
          className="btn-accion-tabla"
          onClick={onIrATienda}
          title="Abrir vista de cliente"
        >
          <ExternalLink size={16} />
        </button>

        <div className="admin-usuario-perfil">
          <div className="admin-avatar">
            {usuario?.nombre?.charAt(0) || 'A'}
          </div>
          <span className="admin-usuario-nombre">
            {usuario?.nombre || 'Administrador'}
          </span>
        </div>
      </div>
    </header>
  );
}

export default CabeceraAdmin;
