import React from 'react';
import { X, Check, ShoppingCart, MessageSquare, Star } from 'lucide-react';
import { formatearPrecio } from '../../utilidades/formatearPrecio';
import { EstrellasCalificacion } from '../Comunes/EstrellasCalificacion';
import { Insignia } from '../Comunes/Insignia';
import { Boton } from '../Comunes/Boton';
import { useSeleccion } from '../../ganchos/useSeleccion';
import { abrirWhatsApp } from '../../utilidades/generarMensajeWhatsApp';

export function ModalDetalleProducto({ producto, alCerrar }) {
  const { alternarSeleccion, estaEnSeleccion } = useSeleccion();

  if (!producto) return null;

  const seleccionado = estaEnSeleccion(producto.id);

  const cotizarDirecto = () => {
    abrirWhatsApp([{ ...producto, cantidad: 1 }], producto.precio);
  };

  return (
    <div className="modal-nas-overlay" onClick={alCerrar}>
      <div className="modal-nas-contenedor anim-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Botón cerrar */}
        <button className="modal-nas-cerrar" onClick={alCerrar} aria-label="Cerrar modal">
          <X size={20} />
        </button>

        <div className="modal-nas-grid">
          {/* Columna Izquierda: Imagen */}
          <div className="modal-nas-imagen-col">
            <div className="modal-nas-imagen-caja">
              <img src={producto.imagen} alt={producto.nombre} className="modal-nas-img" />
              {producto.badge && (
                <div className="modal-nas-badge-pos">
                  <Insignia tipo={producto.badge} />
                </div>
              )}
            </div>
          </div>

          {/* Columna Derecha: Información y Acciones */}
          <div className="modal-nas-info-col">
            <div className="modal-nas-cat">{producto.categoriaNombre || 'Categoría'}</div>
            <h2 className="modal-nas-titulo">{producto.nombre}</h2>

            <div className="modal-nas-rating-fila">
              <EstrellasCalificacion
                rating={producto.rating || 5}
                totalReviews={producto.totalReviews || 0}
                tamano={14}
              />
              <span className="modal-nas-stock">• Disponibilidad inmediata</span>
            </div>

            <div className="modal-nas-precio-box">
              <span className="modal-nas-precio-principal">
                {formatearPrecio(producto.precio)}
              </span>
              {producto.precioAnterior && (
                <span className="modal-nas-precio-anterior">
                  {formatearPrecio(producto.precioAnterior)}
                </span>
              )}
            </div>

            <p className="modal-nas-descripcion">{producto.descripcion}</p>

            {/* Especificaciones */}
            {producto.especificaciones && (
              <div className="modal-nas-especificaciones">
                <h4 className="modal-nas-subtitulo">Especificaciones Técnicas</h4>
                <div className="modal-nas-specs-grid">
                  {Object.entries(producto.especificaciones).map(([clave, valor]) => (
                    <div key={clave} className="modal-nas-spec-item">
                      <span className="spec-clave">{clave}:</span>
                      <span className="spec-valor">{valor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de Acción */}
            <div className="modal-nas-acciones">
              <Boton
                variante={seleccionado ? 'secundario' : 'primario'}
                tamano="md"
                icono={seleccionado ? <Check size={18} /> : <ShoppingCart size={18} />}
                onClick={() => alternarSeleccion(producto)}
                className="modal-btn-seleccion"
              >
                {seleccionado ? 'En tu selección' : 'Añadir a mi selección'}
              </Boton>

              <Boton
                variante="whatsapp"
                tamano="md"
                icono={<MessageSquare size={18} />}
                onClick={cotizarDirecto}
              >
                Cotizar por WhatsApp
              </Boton>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .modal-nas-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(3, 6, 13, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1.5rem;
        }

        .modal-nas-contenedor {
          position: relative;
          background: #091021;
          border: 1px solid #1c3057;
          border-radius: var(--radio-xl);
          width: 100%;
          max-width: 840px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 180, 216, 0.25);
          padding: 2rem;
        }

        .modal-nas-cerrar {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transicion-rapida);
          z-index: 10;
        }

        .modal-nas-cerrar:hover {
          color: #ffffff;
          background: rgba(239, 68, 68, 0.3);
          border-color: #ef4444;
        }

        .modal-nas-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2rem;
        }

        .modal-nas-imagen-col {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-nas-imagen-caja {
          position: relative;
          width: 100%;
          height: 300px;
          background: radial-gradient(circle at center, #111d38 0%, #060a14 100%);
          border: 1px solid #1c3057;
          border-radius: var(--radio-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .modal-nas-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .modal-nas-badge-pos {
          position: absolute;
          top: 1rem;
          left: 1rem;
        }

        .modal-nas-info-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .modal-nas-cat {
          font-size: 0.8rem;
          color: #00b4d8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
        }

        .modal-nas-titulo {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
        }

        .modal-nas-rating-fila {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .modal-nas-stock {
          font-size: 0.8rem;
          color: #10b981;
          font-weight: 500;
        }

        .modal-nas-precio-box {
          display: flex;
          align-items: baseline;
          gap: 0.8rem;
        }

        .modal-nas-precio-principal {
          font-size: 1.6rem;
          font-weight: 800;
          color: #00d2ff;
          text-shadow: 0 0 12px rgba(0, 210, 255, 0.4);
        }

        .modal-nas-precio-anterior {
          font-size: 1.1rem;
          color: #64748b;
          text-decoration: line-through;
        }

        .modal-nas-descripcion {
          font-size: 0.9rem;
          color: #94a3b8;
          line-height: 1.6;
        }

        .modal-nas-especificaciones {
          background: rgba(14, 25, 48, 0.6);
          border: 1px solid #192d52;
          border-radius: var(--radio-md);
          padding: 1rem;
        }

        .modal-nas-subtitulo {
          font-size: 0.85rem;
          font-weight: 700;
          color: #cbd5e1;
          margin-bottom: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .modal-nas-specs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.4rem;
        }

        .modal-nas-spec-item {
          display: flex;
          font-size: 0.82rem;
          gap: 0.5rem;
        }

        .spec-clave {
          color: #64748b;
          min-width: 110px;
        }

        .spec-valor {
          color: #e2e8f0;
          font-weight: 500;
        }

        .modal-nas-acciones {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .modal-nas-grid {
            grid-template-columns: 1fr;
          }
          .modal-nas-imagen-caja {
            height: 220px;
          }
        }
      `}</style>
    </div>
  );
}

export default ModalDetalleProducto;
