import React, { useState } from 'react';
import { X, Send, User, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { useSeleccion } from '../../ganchos/useSeleccion';
import { formatearPrecio } from '../../utilidades/formatearPrecio';
import { abrirWhatsApp } from '../../utilidades/generarMensajeWhatsApp';
import { servicioSolicitudes } from '../../servicios/servicioSolicitudes';
import { useAutenticacionContext } from '../../contextos/ContextoAutenticacion';

export function ModalCotizacion({ alCerrar }) {
  const { itemsSeleccionados, totalMonto, vaciarSeleccion } = useSeleccion();
  const { usuario, estaAutenticado, abrirModalAuth } = useAutenticacionContext();

  const [formulario, setFormulario] = useState({
    nombre: '',
    rut: '',
    email: '',
    telefono: '',
    notas: ''
  });

  const [enviado, setEnviado] = useState(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const manejarEnviar = async (e) => {
    e.preventDefault();
    if (!estaAutenticado) {
      abrirModalAuth('login');
      return;
    }

    await servicioSolicitudes.crearSolicitudCotizacion({
      usuarioId: usuario.id,
      cliente: formulario,
      items: itemsSeleccionados,
      total: totalMonto
    });

    setEnviado(true);
    setTimeout(() => {
      abrirWhatsApp(itemsSeleccionados, totalMonto);
    }, 1200);
  };

  return (
    <div className="modal-nas-overlay" onClick={alCerrar}>
      <div className="modal-cotizacion-card anim-fade-in" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-nas-cerrar" onClick={alCerrar}>
          <X size={20} />
        </button>

        {!enviado ? (
          <div>
            <div className="modal-cot-header">
              <h3 className="modal-cot-titulo">Solicitar Cotización Formal</h3>
              <p className="modal-cot-sub">Completa tus datos para enviarte la propuesta formal o contactarte directamente.</p>
            </div>

            {!estaAutenticado && (
              <p className="modal-cot-aviso-sesion">Inicia sesión antes de enviar la cotización para poder consultarla después en “Mis solicitudes”.</p>
            )}

            <div className="modal-cot-resumen-box">
              <span>{itemsSeleccionados.length} productos seleccionados</span>
              <strong className="monto-res">{formatearPrecio(totalMonto)}</strong>
            </div>

            <form onSubmit={manejarEnviar} className="modal-cot-form">
              <div className="campo-grupo">
                <label className="campo-label"><User size={14} /> Nombre completo</label>
                <input
                  type="text"
                  name="nombre"
                  required
                  placeholder="Ej: Carlos Mendoza"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  className="campo-input"
                />
              </div>

              <div className="campo-grupo">
                <label className="campo-label"><FileText size={14} /> RUT para facturación</label>
                <input
                  type="text"
                  name="rut"
                  required
                  placeholder="Ej: 12.345.678-9"
                  value={formulario.rut}
                  onChange={manejarCambio}
                  className="campo-input"
                />
              </div>

              <div className="campo-fila-2">
                <div className="campo-grupo">
                  <label className="campo-label"><Mail size={14} /> Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="carlos@empresa.com"
                    value={formulario.email}
                    onChange={manejarCambio}
                    className="campo-input"
                  />
                </div>

                <div className="campo-grupo">
                  <label className="campo-label"><Phone size={14} /> Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    name="telefono"
                    required
                    placeholder="+593 99 123 4567"
                    value={formulario.telefono}
                    onChange={manejarCambio}
                    className="campo-input"
                  />
                </div>
              </div>

              <div className="campo-grupo">
                <label className="campo-label"><FileText size={14} /> Notas adicionales o requerimientos</label>
                <textarea
                  name="notas"
                  rows={3}
                  placeholder="Indica requerimientos de entrega u otras observaciones."
                  value={formulario.notas}
                  onChange={manejarCambio}
                  className="campo-input"
                />
              </div>

              <button type="submit" className="btn-enviar-cotizacion">
                <Send size={16} />
                <span>Enviar y Abrir WhatsApp</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="modal-cot-exito">
            <CheckCircle2 size={54} className="icono-exito" />
            <h3>¡Cotización Enviada con Éxito!</h3>
            <p>Redirigiendo a WhatsApp para conectar con un asesor comercial de NAS Computer...</p>
          </div>
        )}
      </div>

      <style>{`
        .modal-nas-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          overflow-y: auto;
          background: rgba(2, 6, 18, 0.72);
          backdrop-filter: blur(3px);
        }

        .modal-cotizacion-card {
          position: relative;
          background: #091022;
          border: 1px solid #1c3057;
          border-radius: var(--radio-lg);
          padding: 2rem;
          width: 100%;
          max-width: 520px;
          max-height: calc(100vh - 3rem);
          overflow-y: auto;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 180, 216, 0.3);
        }

        .modal-cot-header {
          margin-bottom: 1.2rem;
        }

        .modal-cot-titulo {
          font-size: 1.25rem;
          color: #ffffff;
          font-weight: 700;
        }

        .modal-cot-sub {
          font-size: 0.82rem;
          color: #8497b0;
          margin-top: 0.2rem;
        }

        .modal-cot-resumen-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(0, 180, 216, 0.1);
          border: 1px solid rgba(0, 180, 216, 0.3);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.85rem;
          color: #e2e8f0;
          margin-bottom: 1.2rem;
        }

        .modal-cot-aviso-sesion {
          margin: 0 0 1rem;
          padding: 0.7rem 0.8rem;
          border: 1px solid rgba(251, 191, 36, 0.35);
          border-radius: 8px;
          background: rgba(251, 191, 36, 0.08);
          color: #fde68a;
          font-size: 0.8rem;
          line-height: 1.4;
        }

        .monto-res {
          color: #00d2ff;
          font-size: 1.05rem;
        }

        .modal-cot-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .campo-fila-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }

        .campo-grupo {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .campo-label {
          font-size: 0.76rem;
          font-weight: 600;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .campo-input {
          background: #060b17;
          border: 1px solid #1c2e4f;
          border-radius: 6px;
          padding: 0.6rem 0.8rem;
          color: #ffffff;
          font-size: 0.85rem;
        }

        .btn-enviar-cotizacion {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%);
          color: #ffffff;
          padding: 0.8rem;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: all 0.2s ease;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.4);
        }

        .btn-enviar-cotizacion:hover {
          background: linear-gradient(135deg, #00d2ff 0%, #0096c7 100%);
        }

        .modal-cot-exito {
          text-align: center;
          padding: 2.5rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .icono-exito {
          color: #10b981;
          filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.6));
        }

        @media (max-width: 600px) {
          .modal-nas-overlay {
            padding: 0.75rem;
          }

          .modal-cotizacion-card {
            max-height: calc(100vh - 1.5rem);
            padding: 1.25rem;
          }

          .campo-fila-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default ModalCotizacion;
