import React from 'react';
import { TarjetaProducto } from './TarjetaProducto';

/**
 * Componente Grilla para mostrar productos con soporte para diferentes configuraciones de columnas
 */
export function GrillaProductos({ productos = [], alHacerClicProducto, columnas = 3, className = '' }) {
  if (!productos || productos.length === 0) {
    return (
      <div className="grilla-vacia">
        <p>No se encontraron productos disponibles.</p>
        <style>{`
          .grilla-vacia {
            padding: 3rem 1rem;
            text-align: center;
            color: #64748b;
            font-size: 0.95rem;
            background: #090f1e;
            border: 1px dashed #1c3057;
            border-radius: var(--radio-lg);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`grilla-productos-nas grilla-cols-${columnas} ${className}`}>
      {productos.map((producto) => (
        <TarjetaProducto
          key={producto.id}
          producto={producto}
          alHacerClic={alHacerClicProducto}
        />
      ))}

      <style>{`
        .grilla-productos-nas {
          display: grid;
          gap: 0.85rem;
          width: 100%;
        }

        .grilla-cols-3 {
          grid-template-columns: repeat(3, 1fr);
        }

        .grilla-cols-4 {
          grid-template-columns: repeat(4, 1fr);
        }

        @media (max-width: 1024px) {
          .grilla-cols-4 {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .grilla-cols-3, .grilla-cols-4 {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .grilla-cols-3, .grilla-cols-4 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default GrillaProductos;
