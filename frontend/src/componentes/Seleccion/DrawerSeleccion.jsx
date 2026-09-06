import React from 'react';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, ExternalLink } from 'lucide-react';
import { useSeleccion } from '../../ganchos/useSeleccion';
import { formatearPrecio } from '../../utilidades/formatearPrecio';
import { abrirWhatsApp } from '../../utilidades/generarMensajeWhatsApp';
import { useAutenticacionContext } from '../../contextos/ContextoAutenticacion';
import { servicioSolicitudes } from '../../servicios/servicioSolicitudes';

export function DrawerSeleccion({ onNavegar }) {
  const {
    itemsSeleccionados,
    totalMonto,
    totalItems,
    drawerAbierto,
    setDrawerAbierto,
    quitarDeSeleccion,
    actualizarCantidad,
    vaciarSeleccion
  } = useSeleccion();
  const { usuario, estaAutenticado, abrirModalAuth } = useAutenticacionContext();

  if (!drawerAbierto) return null;

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

  const irAPaginaCompleta = () => {
    setDrawerAbierto(false);
    if (onNavegar) {
      onNavegar('mi-seleccion');
    } else {
      window.dispatchEvent(new CustomEvent('nas:navigate', { detail: 'mi-seleccion' }));
    }
  };

  return (
    <div className="drawer-nas-overlay" onClick={() => setDrawerAbierto(false)}>
      <aside className="drawer-nas-panel anim-slide-left" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera del Drawer */}
        <div className="drawer-nas-header">
          <div className="drawer-titulo-area">
            <ShoppingBag size={20} className="drawer-icono-bag" />
            <h3 className="drawer-titulo">Mi Selección</h3>
            <span className="drawer-badge-conteo">{totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}</span>
          </div>
          <button
            type="button"
            className="drawer-btn-cerrar"
            onClick={() => setDrawerAbierto(false)}
            aria-label="Cerrar selección"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lista de Productos Seleccionados */}
        <div className="drawer-nas-cuerpo">
          {itemsSeleccionados.length === 0 ? (
            <div className="drawer-vacio">
              <div className="circulo-vacio-icono">
                <ShoppingBag size={36} />
              </div>
              <h4>Tu selección está vacía</h4>
              <p>Explora nuestro catálogo y haz clic en el icono de león en cada producto para agregarlo a tu cotización.</p>
            </div>
          ) : (
            <div className="drawer-lista-items">
              {itemsSeleccionados.map((item) => (
                <div key={item.id} className="drawer-item-card">
                  {/* Thumbnail */}
                  <div className="drawer-item-img-wrap">
                    <img src={item.imagen} alt={item.nombre} className="drawer-item-img" />
                  </div>

                  {/* Info */}
                  <div className="drawer-item-info">
                    <h4 className="drawer-item-nombre">{item.nombre}</h4>
                    <span className="drawer-item-precio-unit">{formatearPrecio(item.precio)} c/u</span>

                    {/* Controles de Cantidad */}
                    <div className="drawer-item-controles">
                      <div className="cantidad-selector">
                        <button
                          type="button"
                          className="btn-cant"
                          onClick={() => actualizarCantidad(item.id, (item.cantidad || 1) - 1)}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="cant-numero">{item.cantidad || 1}</span>
                        <button
                          type="button"
                          className="btn-cant"
                          onClick={() => actualizarCantidad(item.id, (item.cantidad || 1) + 1)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <span className="drawer-item-subtotal">
                        {formatearPrecio(item.precio * (item.cantidad || 1))}
                      </span>
                    </div>
                  </div>

                  {/* Botón Eliminar */}
                  <button
                    type="button"
                    className="drawer-item-btn-borrar"
                    onClick={() => quitarDeSeleccion(item.id)}
                    title="Eliminar producto"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con Resumen y Botón de WhatsApp */}
        {itemsSeleccionados.length > 0 && (
          <div className="drawer-nas-footer">
            <div className="drawer-resumen-fila">
              <span className="resumen-label">Total estimado:</span>
              <span className="resumen-monto-total">{formatearPrecio(totalMonto)}</span>
            </div>

            <div className="drawer-acciones-botones">
              <button
                type="button"
                className="drawer-btn-completa"
                onClick={irAPaginaCompleta}
              >
                <ExternalLink size={16} />
                <span>Ver selección completa y cotizador</span>
              </button>

              <button
                type="button"
                className="drawer-btn-whatsapp"
                onClick={manejarCotizarWhatsApp}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.972.575 1.777.946 2.781.946 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.766-5.767-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.823 0-3.529-.493-5.002-1.353l-5.998 1.572 1.603-5.851c-.961-1.536-1.503-3.342-1.503-5.368 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
                </svg>
                <span>Cotizar Selección por WhatsApp</span>
              </button>

              <button
                type="button"
                className="drawer-btn-vaciar"
                onClick={vaciarSeleccion}
              >
                Vaciar selección
              </button>
            </div>
          </div>
        )}
      </aside>

      <style>{`
        .drawer-nas-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(3, 6, 13, 0.75);
          backdrop-filter: blur(6px);
          z-index: 10000;
          display: flex;
          justify-content: flex-end;
        }

        .drawer-nas-panel {
          width: 100%;
          max-width: 420px;
          height: 100%;
          background: #090f1f;
          border-left: 1px solid #1c3057;
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 35px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 180, 216, 0.15);
        }

        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .anim-slide-left {
          animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .drawer-nas-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #14223d;
          background: #060b17;
        }

        .drawer-titulo-area {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .drawer-icono-bag {
          color: #00d2ff;
        }

        .drawer-titulo {
          font-size: 1.05rem;
          font-weight: 700;
          color: #ffffff;
        }

        .drawer-badge-conteo {
          background: rgba(0, 180, 216, 0.15);
          color: #00d2ff;
          border: 1px solid rgba(0, 180, 216, 0.3);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 9999px;
        }

        .drawer-btn-cerrar {
          color: #94a3b8;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .drawer-btn-cerrar:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .drawer-nas-cuerpo {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
        }

        .drawer-vacio {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3rem 1rem;
          color: #64748b;
          gap: 0.8rem;
        }

        .circulo-vacio-icono {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #0f1c38;
          border: 1px solid #1d335a;
          color: #00b4d8;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drawer-lista-items {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .drawer-item-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: #0d1527;
          border: 1px solid #162645;
          border-radius: var(--radio-md);
          padding: 0.75rem;
          transition: border-color 0.2s ease;
        }

        .drawer-item-card:hover {
          border-color: rgba(0, 180, 216, 0.4);
        }

        .drawer-item-img-wrap {
          width: 60px;
          height: 60px;
          border-radius: 6px;
          background: #060a14;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
          padding: 0.25rem;
        }

        .drawer-item-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .drawer-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .drawer-item-nombre {
          font-size: 0.82rem;
          font-weight: 600;
          color: #f1f5f9;
          line-height: 1.2;
        }

        .drawer-item-precio-unit {
          font-size: 0.72rem;
          color: #64748b;
        }

        .drawer-item-controles {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.3rem;
        }

        .cantidad-selector {
          display: flex;
          align-items: center;
          background: #070d1a;
          border: 1px solid #1b2f52;
          border-radius: 6px;
        }

        .btn-cant {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          transition: color 0.15s;
        }

        .btn-cant:hover {
          color: #00d2ff;
        }

        .cant-numero {
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0 0.4rem;
          color: #ffffff;
        }

        .drawer-item-subtotal {
          font-size: 0.84rem;
          font-weight: 700;
          color: #00d2ff;
        }

        .drawer-item-btn-borrar {
          color: #64748b;
          padding: 0.4rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .drawer-item-btn-borrar:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.15);
        }

        .drawer-nas-footer {
          padding: 1.25rem 1.5rem;
          background: #060b17;
          border-top: 1px solid #14223d;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .drawer-resumen-fila {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }

        .resumen-label {
          font-size: 0.88rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .resumen-monto-total {
          font-size: 1.35rem;
          font-weight: 800;
          color: #00d2ff;
          text-shadow: 0 0 12px rgba(0, 210, 255, 0.5);
        }

        .drawer-acciones-botones {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .drawer-btn-completa {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #0b1528;
          border: 1px solid #1a3660;
          color: #00d2ff;
          padding: 0.75rem;
          border-radius: var(--radio-md);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .drawer-btn-completa:hover {
          background: rgba(0, 210, 255, 0.12);
          border-color: #00d2ff;
          box-shadow: 0 0 14px rgba(0, 210, 255, 0.3);
        }

        .drawer-btn-whatsapp {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%);
          color: #ffffff;
          padding: 0.8rem;
          border-radius: var(--radio-md);
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.4);
        }

        .drawer-btn-whatsapp:hover {
          background: linear-gradient(135deg, #00d2ff 0%, #0096c7 100%);
          box-shadow: 0 0 25px rgba(0, 210, 255, 0.7);
        }

        .drawer-btn-vaciar {
          font-size: 0.75rem;
          color: #64748b;
          text-align: center;
          padding: 0.3rem;
          transition: color 0.2s ease;
        }

        .drawer-btn-vaciar:hover {
          color: #ef4444;
        }
      `}</style>
    </div>
  );
}

export default DrawerSeleccion;
