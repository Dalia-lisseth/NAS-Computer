import React from 'react';
import { formatearPrecio } from '../../utilidades/formatearPrecio';
import { EstrellasCalificacion } from '../Comunes/EstrellasCalificacion';
import { Insignia } from '../Comunes/Insignia';
import { IconoHuella } from '../Comunes/IconoHuella';
import { useSeleccion } from '../../ganchos/useSeleccion';

/**
 * Tarjeta de producto individual réplica del diseño oficial NAS Computer
 */
export function TarjetaProducto({ producto, alHacerClic }) {
  const { alternarSeleccion, estaEnSeleccion } = useSeleccion();

  if (!producto) return null;

  const seleccionado = estaEnSeleccion(producto.id);

  const manejarClickHuella = (e) => {
    e.stopPropagation();
    alternarSeleccion(producto);
  };

  const manejarClickCard = () => {
    if (alHacerClic) {
      alHacerClic(producto);
    }
  };

  return (
    <div className="tarjeta-producto-nas" onClick={manejarClickCard}>
      {/* Cabecera de la tarjeta: Badge e Icono Huella */}
      <div className="tarjeta-producto-top">
        <div className="tarjeta-producto-badge-area">
          {producto.badge && (
            <Insignia tipo={producto.badge} />
          )}
        </div>
        <div className="tarjeta-producto-accion-area">
          <IconoHuella
            activo={seleccionado}
            size={13}
            onClick={manejarClickHuella}
          />
        </div>
      </div>

      {/* Imagen del Producto */}
      <div className="tarjeta-producto-imagen-contenedor">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="tarjeta-producto-img"
          loading="lazy"
        />
      </div>

      {/* Información del Producto */}
      <div className="tarjeta-producto-info">
        <h3 className="tarjeta-producto-titulo" title={producto.nombre}>
          {producto.nombre}
        </h3>

        <div className="tarjeta-producto-rating">
          <EstrellasCalificacion
            rating={producto.rating || 5}
            totalReviews={producto.totalReviews || 0}
            tamano={10}
          />
        </div>

        <div className="tarjeta-producto-precios">
          <span className="precio-actual">
            {formatearPrecio(producto.precio)}
          </span>
          {producto.precioAnterior && (
            <span className="precio-anterior">
              {formatearPrecio(producto.precioAnterior)}
            </span>
          )}
        </div>
      </div>

      <style>{`
        .tarjeta-producto-nas {
          position: relative;
          background: #090f1e;
          border: 1px solid #14223d;
          border-radius: 12px;
          padding: 0.75rem 0.85rem;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          overflow: hidden;
        }

        .tarjeta-producto-nas:hover {
          border-color: rgba(0, 180, 216, 0.5);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 180, 216, 0.25);
          background: #0d152a;
        }

        .tarjeta-producto-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
          min-height: 24px;
          margin-bottom: 0.25rem;
          z-index: 2;
        }

        .tarjeta-producto-badge-area {
          display: flex;
          align-items: center;
        }

        .tarjeta-producto-accion-area {
          margin-left: auto;
        }

        .tarjeta-producto-imagen-contenedor {
          width: 100%;
          height: 115px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.6rem;
          overflow: hidden;
          border-radius: 6px;
          background: radial-gradient(circle at center, rgba(14, 28, 54, 0.6) 0%, rgba(5, 8, 17, 0.8) 100%);
        }

        .tarjeta-producto-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .tarjeta-producto-nas:hover .tarjeta-producto-img {
          transform: scale(1.06);
        }

        .tarjeta-producto-info {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          width: 100%;
        }

        .tarjeta-producto-titulo {
          font-size: 0.82rem;
          font-weight: 600;
          color: #f1f5f9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2;
          letter-spacing: 0.01em;
        }

        .tarjeta-producto-rating {
          margin-top: -0.1rem;
        }

        .tarjeta-producto-precios {
          display: flex;
          align-items: baseline;
          gap: 0.45rem;
          margin-top: 0.15rem;
        }

        .precio-actual {
          font-size: 0.88rem;
          font-weight: 700;
          color: #00b4d8;
          text-shadow: 0 0 8px rgba(0, 180, 216, 0.3);
        }

        .precio-anterior {
          font-size: 0.72rem;
          color: #64748b;
          text-decoration: line-through;
          font-weight: 400;
        }
      `}</style>
    </div>
  );
}

export default TarjetaProducto;
