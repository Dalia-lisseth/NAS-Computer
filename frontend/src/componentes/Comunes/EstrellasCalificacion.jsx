import React from 'react';

/**
 * Componente para renderizar calificación de estrellas y número de opiniones
 */
export function EstrellasCalificacion({ rating = 5, totalReviews = 0, tamano = 11, className = '' }) {
  const estrellas = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className={`estrellas-calificacion-contenedor ${className}`}>
      <div className="estrellas-fila">
        {estrellas.map((estrella) => (
          <svg
            key={estrella}
            width={tamano}
            height={tamano}
            viewBox="0 0 24 24"
            fill={estrella <= rating ? '#fbbf24' : '#334155'}
            stroke={estrella <= rating ? '#f59e0b' : '#475569'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="estrella-svg"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      {totalReviews !== undefined && totalReviews !== null && (
        <span className="total-reviews">({totalReviews})</span>
      )}

      <style>{`
        .estrellas-calificacion-contenedor {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .estrellas-fila {
          display: flex;
          align-items: center;
          gap: 1.5px;
        }

        .estrella-svg {
          filter: drop-shadow(0 0 2px rgba(245, 158, 11, 0.4));
        }

        .total-reviews {
          font-size: 0.72rem;
          color: var(--color-texto-atenuado);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

export default EstrellasCalificacion;
