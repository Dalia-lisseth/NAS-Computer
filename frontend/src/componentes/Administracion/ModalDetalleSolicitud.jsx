import React from 'react';
import { X, MessageSquare, Phone, Mail, User, Calendar } from 'lucide-react';
import { formatearPrecio } from '../../utilidades/formatearPrecio';

export function ModalDetalleSolicitud({ solicitud, alCerrar, onCambiarEstado }) {
  if (!solicitud) return null;

  const cliente = solicitud.cliente || {};
  const items = solicitud.items || [];

  const abrirChatCliente = () => {
    const telefonoLimpio = (cliente.telefono || '').replace(/[^\d]/g, '');
    if (telefonoLimpio) {
      const msg = encodeURIComponent(`Hola ${cliente.nombre || ''}, te contactamos desde *NAS Computer* referente a tu solicitud de cotización ${solicitud.id}.`);
      window.open(`https://wa.me/${telefonoLimpio}?text=${msg}`, '_blank');
    }
  };

  return (
    <div className="modal-nas-overlay" onClick={alCerrar}>
      <div className="modal-detalle-solicitud-card anim-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-form-header">
          <div>
            <span className="solicitud-badge-id">{solicitud.id}</span>
            <h2 className="modal-form-titulo">Detalle de Cotización</h2>
          </div>
          <button type="button" className="modal-nas-cerrar" onClick={alCerrar}>
            <X size={20} />
          </button>
        </div>

        <div className="solicitud-cuerpo-grid">
          {/* Información del Cliente */}
          <div className="solicitud-cliente-card">
            <h3>Información del Cliente</h3>
            <div className="cliente-info-lista">
              <div className="info-renglon">
                <User size={15} /> <strong>Nombre:</strong> <span>{cliente.nombre || 'No especificado'}</span>
              </div>
              <div className="info-renglon">
                <Mail size={15} /> <strong>Email:</strong> <span>{cliente.email || 'No especificado'}</span>
              </div>
              <div className="info-renglon">
                <Phone size={15} /> <strong>Teléfono:</strong> <span>{cliente.telefono || 'No especificado'}</span>
              </div>
              <div className="info-renglon">
                <Calendar size={15} /> <strong>Fecha:</strong> <span>{new Date(solicitud.fecha).toLocaleString()}</span>
              </div>
            </div>

            {cliente.notas && (
              <div className="cliente-notas-box">
                <strong>Notas / Requerimientos:</strong>
                <p>{cliente.notas}</p>
              </div>
            )}

            {cliente.telefono && (
              <button
                type="button"
                className="btn-chat-wa-cliente"
                onClick={abrirChatCliente}
              >
                <MessageSquare size={16} />
                <span>Contactar por WhatsApp</span>
              </button>
            )}
          </div>

          {/* Lista de Productos Solicitados */}
          <div className="solicitud-items-card">
            <h3>Productos Cotizados ({items.length})</h3>
            <div className="solicitud-lista-items">
              {items.map((item, idx) => (
                <div key={idx} className="solicitud-item-row">
                  <div className="sol-item-info">
                    <h4>{item.nombre}</h4>
                    <span>{formatearPrecio(item.precio)} × {item.cantidad || 1} unid.</span>
                  </div>
                  <strong className="sol-item-subtotal">
                    {formatearPrecio(item.precio * (item.cantidad || 1))}
                  </strong>
                </div>
              ))}
            </div>

            <div className="solicitud-total-row">
              <span>Total Estimado:</span>
              <strong className="sol-total-monto">{formatearPrecio(solicitud.total)}</strong>
            </div>

            {/* Selector de Estado */}
            <div className="solicitud-estado-selector-row">
              <label>Estado de Solicitud:</label>
              <select
                value={solicitud.estado || 'Pendiente'}
                onChange={(e) => onCambiarEstado && onCambiarEstado(solicitud.id, e.target.value)}
                className="select-estado-solicitud"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Contactado">Contactado</option>
                <option value="Cerrado">Cerrado / Vendido</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .modal-detalle-solicitud-card {
          position: relative;
          background: #091021;
          border: 1px solid #1c3057;
          border-radius: var(--radio-xl);
          padding: 2rem;
          width: 100%;
          max-width: 780px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 180, 216, 0.25);
        }

        .solicitud-badge-id {
          font-size: 0.72rem;
          color: #00d2ff;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .solicitud-cuerpo-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .solicitud-cliente-card, .solicitud-items-card {
          background: #060b17;
          border: 1px solid #162645;
          border-radius: var(--radio-md);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .solicitud-cliente-card h3, .solicitud-items-card h3 {
          font-size: 0.95rem;
          color: #ffffff;
          font-weight: 700;
          border-bottom: 1px solid #162645;
          padding-bottom: 0.5rem;
        }

        .cliente-info-lista {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          font-size: 0.84rem;
        }

        .info-renglon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #94a3b8;
        }

        .info-renglon span {
          color: #f1f5f9;
        }

        .cliente-notas-box {
          background: rgba(0, 180, 216, 0.05);
          border: 1px solid rgba(0, 180, 216, 0.2);
          border-radius: 6px;
          padding: 0.75rem;
          font-size: 0.8rem;
          color: #cbd5e1;
        }

        .btn-chat-wa-cliente {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #25d366;
          color: #ffffff;
          font-weight: 700;
          padding: 0.65rem;
          border-radius: 6px;
          margin-top: auto;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-chat-wa-cliente:hover {
          background: #20ba5a;
          box-shadow: 0 0 15px rgba(37, 211, 102, 0.4);
        }

        .solicitud-lista-items {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          max-height: 220px;
          overflow-y: auto;
        }

        .solicitud-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: #091021;
          border-radius: 6px;
        }

        .sol-item-info h4 {
          font-size: 0.82rem;
          color: #ffffff;
        }

        .sol-item-info span {
          font-size: 0.72rem;
          color: #64748b;
        }

        .sol-item-subtotal {
          font-size: 0.85rem;
          color: #00d2ff;
        }

        .solicitud-total-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-top: 0.75rem;
          border-top: 1px solid #162645;
          font-size: 0.95rem;
          color: #ffffff;
        }

        .sol-total-monto {
          font-size: 1.3rem;
          color: #00d2ff;
        }

        .solicitud-estado-selector-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: #94a3b8;
        }

        .select-estado-solicitud {
          background: #091021;
          border: 1px solid #1c2e4f;
          color: #ffffff;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .solicitud-cuerpo-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default ModalDetalleSolicitud;
