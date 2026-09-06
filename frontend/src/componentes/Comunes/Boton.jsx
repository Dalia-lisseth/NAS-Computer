import React from 'react';

/**
 * Componente Botón configurable con variantes Cyber Neon
 */
export function Boton({
  children,
  variante = 'primario', // primario, secundario, contorno, whatsapp, fantasma
  tamano = 'md', // sm, md, lg
  icono = null,
  iconoDerecha = null,
  onClick,
  tipo = 'button',
  deshabilitado = false,
  anchoCompleto = false,
  className = '',
  ...props
}) {
  return (
    <button
      type={tipo}
      onClick={onClick}
      disabled={deshabilitado}
      className={`btn-nas btn-${variante} btn-${tamano} ${anchoCompleto ? 'btn-bloque' : ''} ${className}`}
      {...props}
    >
      {icono && <span className="btn-icono-izq">{icono}</span>}
      <span className="btn-texto">{children}</span>
      {iconoDerecha && <span className="btn-icono-der">{iconoDerecha}</span>}

      <style>{`
        .btn-nas {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-family: var(--fuente-principal);
          font-weight: 600;
          border-radius: var(--radio-md);
          cursor: pointer;
          transition: all var(--transicion-normal);
          white-space: nowrap;
          text-decoration: none;
        }

        .btn-nas:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: grayscale(0.5);
        }

        /* Tamaños */
        .btn-sm {
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
          border-radius: var(--radio-sm);
        }

        .btn-md {
          padding: 0.65rem 1.25rem;
          font-size: 0.9rem;
        }

        .btn-lg {
          padding: 0.85rem 1.75rem;
          font-size: 1rem;
          border-radius: var(--radio-lg);
        }

        .btn-bloque {
          width: 100%;
        }

        /* Variantes */
        .btn-primario {
          background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%);
          color: #ffffff;
          border: 1px solid rgba(0, 210, 255, 0.4);
          box-shadow: 0 0 12px rgba(0, 180, 216, 0.35);
        }

        .btn-primario:hover:not(:disabled) {
          background: linear-gradient(135deg, #00d2ff 0%, #0096c7 100%);
          box-shadow: 0 0 20px rgba(0, 210, 255, 0.6);
          transform: translateY(-2px);
        }

        .btn-secundario {
          background: #111c33;
          color: #ffffff;
          border: 1px solid var(--color-borde-brillante);
        }

        .btn-secundario:hover:not(:disabled) {
          background: #182849;
          border-color: var(--color-primario);
          color: var(--color-primario-brillante);
          box-shadow: 0 0 10px rgba(0, 180, 216, 0.2);
        }

        .btn-contorno {
          background: transparent;
          color: var(--color-primario-brillante);
          border: 1px solid var(--color-primario);
        }

        .btn-contorno:hover:not(:disabled) {
          background: rgba(0, 180, 216, 0.15);
          box-shadow: 0 0 12px var(--color-cyan-glow);
          transform: translateY(-1px);
        }

        .btn-whatsapp {
          background: rgba(11, 28, 44, 0.85);
          color: #ffffff;
          border: 1px solid rgba(0, 180, 216, 0.6);
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.3);
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .btn-whatsapp:hover:not(:disabled) {
          background: rgba(0, 180, 216, 0.18);
          border-color: #00d2ff;
          box-shadow: 0 0 25px rgba(0, 210, 255, 0.6);
          transform: translateY(-2px);
        }

        .btn-fantasma {
          background: transparent;
          color: var(--color-texto-secundario);
          border: 1px solid transparent;
        }

        .btn-fantasma:hover:not(:disabled) {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }

        .btn-icono-izq, .btn-icono-der {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </button>
  );
}

export default Boton;
