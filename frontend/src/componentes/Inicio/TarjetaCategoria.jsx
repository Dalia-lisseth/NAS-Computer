import React from 'react';
import {
  Monitor,
  Laptop,
  Cpu,
  Gamepad2,
  Mouse,
  Network,
  Lock,
  Headphones,
  Printer,
  Smartphone
} from 'lucide-react';

const MAPA_ICONOS = {
  Monitor: Monitor,
  Laptop: Laptop,
  Cpu: Cpu,
  Gamepad2: Gamepad2,
  Mouse: Mouse,
  Network: Network,
  Lock: Lock,
  ShieldCheck: Lock,
  Headphones: Headphones,
  Printer: Printer,
  Smartphone: Smartphone
};

export function TarjetaCategoria({ categoria, seleccionada = false, alSeleccionar }) {
  if (!categoria) return null;

  const IconoComponente = MAPA_ICONOS[categoria.icono] || Monitor;

  return (
    <div
      className={`tarjeta-categoria-item ${seleccionada ? 'seleccionada' : ''}`}
      onClick={() => alSeleccionar && alSeleccionar(categoria)}
    >
      <div className="categoria-icono-wrapper">
        <IconoComponente size={22} strokeWidth={1.8} />
      </div>
      <span className="categoria-nombre-texto">{categoria.nombre}</span>

      <style>{`
        .tarjeta-categoria-item {
          background: #080f1d;
          border: 1px solid #14223d;
          border-radius: 12px;
          padding: 0.9rem 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: center;
          user-select: none;
        }

        .tarjeta-categoria-item:hover {
          background: #0e172e;
          border-color: rgba(0, 180, 216, 0.6);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5), 0 0 12px rgba(0, 180, 216, 0.3);
          transform: translateY(-2px);
        }

        .tarjeta-categoria-item.seleccionada {
          background: #0f1c38;
          border-color: #00d2ff;
          box-shadow: 0 0 15px rgba(0, 210, 255, 0.4);
        }

        .categoria-icono-wrapper {
          color: #00b4d8;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .tarjeta-categoria-item:hover .categoria-icono-wrapper {
          color: #00d2ff;
          transform: scale(1.1);
          filter: drop-shadow(0 0 6px rgba(0, 210, 255, 0.6));
        }

        .categoria-nombre-texto {
          font-size: 0.72rem;
          color: #cbd5e1;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          transition: color 0.2s ease;
        }

        .tarjeta-categoria-item:hover .categoria-nombre-texto {
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}

export default TarjetaCategoria;
