import React from 'react';

/**
 * Insignia / Badge para productos (NUEVO, SALE, OFERTA, etc.)
 */
export function Insignia({ tipo = 'NUEVO', texto, className = '' }) {
  const etiqueta = texto || tipo;
  const esNuevo = tipo.toUpperCase() === 'NUEVO';
  const esSale = tipo.toUpperCase() === 'SALE' || tipo.toUpperCase() === 'OFERTA';

  return (
    <span className={`insignia-nas ${esNuevo ? 'insignia-nuevo' : ''} ${esSale ? 'insignia-sale' : ''} ${className}`}>
      {etiqueta}

      <style>{`
        .insignia-nas {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          padding: 0.18rem 0.45rem;
          border-radius: var(--radio-sm);
          text-transform: uppercase;
          line-height: 1;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        }

        .insignia-nuevo {
          background-color: #059669;
          color: #ffffff;
          border: 1px solid rgba(52, 211, 153, 0.4);
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
        }

        .insignia-sale {
          background-color: #0284c7;
          color: #ffffff;
          border: 1px solid rgba(56, 189, 248, 0.4);
          box-shadow: 0 0 8px rgba(0, 180, 216, 0.4);
        }
      `}</style>
    </span>
  );
}

export default Insignia;
