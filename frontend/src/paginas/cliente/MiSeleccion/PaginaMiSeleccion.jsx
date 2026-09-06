import React from 'react';
import { useSeleccion } from '../../../ganchos/useSeleccion';
import { formatearPrecio } from '../../../utilidades/formatearPrecio';
import { abrirWhatsApp } from '../../../utilidades/generarMensajeWhatsApp';
import { Trash2, Plus, Minus, Send, ShoppingBag } from 'lucide-react';
import { ModalCotizacion } from '../../../componentes/Seleccion/ModalCotizacion';
import { useAutenticacionContext } from '../../../contextos/ContextoAutenticacion';
import { servicioSolicitudes } from '../../../servicios/servicioSolicitudes';

export function PaginaMiSeleccion() {
  const {
    itemsSeleccionados,
    totalMonto,
    totalItems,
    quitarDeSeleccion,
    actualizarCantidad,
    vaciarSeleccion,
    modalCotizacionAbierto,
    setModalCotizacionAbierto
  } = useSeleccion();
  const { usuario, estaAutenticado, abrirModalAuth } = useAutenticacionContext();

  const manejarCotizarWhatsApp = async () => {
    if (!estaAutenticado) {
      abrirModalAuth('login');
      return;
    }

    await servicioSolicitudes.crearSolicitudWhatsApp({
      usuario,
      items: itemsSeleccionados,
      total: totalMonto
    });
    abrirWhatsApp(itemsSeleccionados, totalMonto);
  };

  return (
    <main className="pagina-seleccion-nas">
      <div className="contenedor-principal">
        <div className="seleccion-cabecera">
          <h1 className="seleccion-titulo">Mi Selección y Cotizador</h1>
          <p className="seleccion-sub">Revisa tus equipos seleccionados, ajusta las cantidades y genera tu cotización instantánea.</p>
        </div>

        {itemsSeleccionados.length === 0 ? (
          <div className="seleccion-vacia-panel">
            <ShoppingBag size={56} className="icono-bolsa-vacia" />
            <h2>No tienes productos en tu selección</h2>
            <p>Visita nuestro catálogo para agregar computadoras, laptops o componentes a tu cotización.</p>
          </div>
        ) : (
          <div className="seleccion-layout">
            <div className="seleccion-items-lista">
              {itemsSeleccionados.map((item) => (
                <div key={item.id} className="seleccion-item-fila">
                  <div className="item-fila-img-box">
                    <img src={item.imagen} alt={item.nombre} />
                  </div>

                  <div className="item-fila-detalles">
                    <h3>{item.nombre}</h3>
                    <span className="item-cat-label">{item.categoriaNombre}</span>
                    <span className="item-precio-unit">{formatearPrecio(item.precio)} c/u</span>
                  </div>

                  <div className="item-fila-cantidad">
                    <button
                      type="button"
                      className="btn-cant-ctrl"
                      onClick={() => actualizarCantidad(item.id, (item.cantidad || 1) - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="cant-valor">{item.cantidad || 1}</span>
                    <button
                      type="button"
                      className="btn-cant-ctrl"
                      onClick={() => actualizarCantidad(item.id, (item.cantidad || 1) + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="item-fila-subtotal">
                    <span className="subtotal-val">
                      {formatearPrecio(item.precio * (item.cantidad || 1))}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="item-fila-btn-quitar"
                    onClick={() => quitarDeSeleccion(item.id)}
                    title="Eliminar producto"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              <div className="seleccion-acciones-secundarias">
                <button
                  type="button"
                  className="btn-vaciar-todo"
                  onClick={vaciarSeleccion}
                >
                  Vaciar toda la selección
                </button>
              </div>
            </div>

            {/* Resumen Card */}
            <aside className="seleccion-resumen-sidebar">
              <div className="resumen-card">
                <h3>Resumen de Cotización</h3>
                <div className="resumen-renglon">
                  <span>Productos ({totalItems}):</span>
                  <span>{formatearPrecio(totalMonto)}</span>
                </div>
                <div className="resumen-renglon">
                  <span>Asesoría personalizada:</span>
                  <span className="texto-gratis">Gratis</span>
                </div>
                <div className="resumen-renglon">
                  <span>Garantía oficial NAS:</span>
                  <span className="texto-gratis">Incluida</span>
                </div>

                <div className="resumen-total-fila">
                  <span>Total estimado:</span>
                  <strong className="resumen-total-destacado">{formatearPrecio(totalMonto)}</strong>
                </div>

                <div className="resumen-botones-accion">
                  <button
                    type="button"
                    className="btn-cotizar-wa-grande"
                    onClick={manejarCotizarWhatsApp}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.972.575 1.777.946 2.781.946 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.766-5.767-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.823 0-3.529-.493-5.002-1.353l-5.998 1.572 1.603-5.851c-.961-1.536-1.503-3.342-1.503-5.368 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
                    </svg>
                    <span>Cotizar por WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    className="btn-solicitar-formal"
                    onClick={() => setModalCotizacionAbierto(true)}
                  >
                    Solicitud Formal con Factura
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      {modalCotizacionAbierto && (
        <ModalCotizacion alCerrar={() => setModalCotizacionAbierto(false)} />
      )}

      <style>{`
        .pagina-seleccion-nas {
          padding: 2rem 0 3.5rem 0;
        }

        .seleccion-cabecera {
          margin-bottom: 2rem;
        }

        .seleccion-titulo {
          font-size: 1.85rem;
          font-weight: 800;
          color: #ffffff;
        }

        .seleccion-sub {
          font-size: 0.9rem;
          color: #8497b0;
          margin-top: 0.3rem;
        }

        .seleccion-vacia-panel {
          background: #091021;
          border: 1px dashed #1c3057;
          border-radius: var(--radio-lg);
          padding: 4rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .icono-bolsa-vacia {
          color: #00b4d8;
        }

        .seleccion-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 2rem;
        }

        .seleccion-items-lista {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .seleccion-item-fila {
          background: #091021;
          border: 1px solid #162645;
          border-radius: var(--radio-lg);
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .item-fila-img-box {
          width: 70px;
          height: 70px;
          border-radius: 8px;
          background: #060a14;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          padding: 0.35rem;
        }

        .item-fila-img-box img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .item-fila-detalles {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .item-fila-detalles h3 {
          font-size: 0.95rem;
          color: #ffffff;
          font-weight: 700;
        }

        .item-cat-label {
          font-size: 0.72rem;
          color: #00b4d8;
          text-transform: uppercase;
        }

        .item-precio-unit {
          font-size: 0.8rem;
          color: #64748b;
        }

        .item-fila-cantidad {
          display: flex;
          align-items: center;
          background: #060b17;
          border: 1px solid #1a2d4e;
          border-radius: 6px;
        }

        .btn-cant-ctrl {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          transition: color 0.2s;
        }

        .btn-cant-ctrl:hover {
          color: #00d2ff;
        }

        .cant-valor {
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0 0.5rem;
          color: #ffffff;
        }

        .item-fila-subtotal {
          min-width: 90px;
          text-align: right;
        }

        .subtotal-val {
          font-size: 1.05rem;
          font-weight: 800;
          color: #00d2ff;
        }

        .item-fila-btn-quitar {
          color: #64748b;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .item-fila-btn-quitar:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.15);
        }

        .btn-vaciar-todo {
          font-size: 0.8rem;
          color: #64748b;
          transition: color 0.2s;
        }

        .btn-vaciar-todo:hover {
          color: #ef4444;
        }

        .resumen-card {
          background: #091021;
          border: 1px solid #1c3057;
          border-radius: var(--radio-lg);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .resumen-card h3 {
          font-size: 1.15rem;
          color: #ffffff;
          font-weight: 700;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #162645;
        }

        .resumen-renglon {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          color: #94a3b8;
        }

        .texto-gratis {
          color: #10b981;
          font-weight: 600;
        }

        .resumen-total-fila {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-top: 0.85rem;
          border-top: 1px solid #162645;
          font-size: 0.95rem;
          color: #ffffff;
        }

        .resumen-total-destacado {
          font-size: 1.45rem;
          color: #00d2ff;
          text-shadow: 0 0 15px rgba(0, 210, 255, 0.5);
        }

        .resumen-botones-accion {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-top: 0.5rem;
        }

        .btn-cotizar-wa-grande {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%);
          color: #ffffff;
          padding: 0.85rem;
          border-radius: var(--radio-md);
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.4);
        }

        .btn-cotizar-wa-grande:hover {
          background: linear-gradient(135deg, #00d2ff 0%, #0096c7 100%);
        }

        .btn-solicitar-formal {
          background: transparent;
          border: 1px solid #1e355e;
          color: #cbd5e1;
          padding: 0.75rem;
          border-radius: var(--radio-md);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-solicitar-formal:hover {
          border-color: #00b4d8;
          color: #00d2ff;
        }

        @media (max-width: 860px) {
          .seleccion-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

export default PaginaMiSeleccion;
