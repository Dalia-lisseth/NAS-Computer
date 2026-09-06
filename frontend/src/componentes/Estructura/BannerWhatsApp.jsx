import React from 'react';
import { MessageCircle, Headphones, Sparkles, Send, ShieldCheck, UserCheck } from 'lucide-react';
import { useSeleccion } from '../../ganchos/useSeleccion';
import { abrirWhatsApp } from '../../utilidades/generarMensajeWhatsApp';

export function BannerWhatsApp() {
  const { itemsSeleccionados, totalMonto } = useSeleccion();

  const manejarClickWhatsApp = () => {
    abrirWhatsApp(itemsSeleccionados, totalMonto);
  };

  return (
    <section className="banner-whatsapp-seccion">
      <div className="banner-whatsapp-card">
        <div className="banner-whatsapp-contenido">
          {/* Logo WhatsApp Grande */}
          <div className="banner-whatsapp-icono-principal">
            <div className="circulo-verde-whatsapp">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="icono-wa-svg">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.972.575 1.777.946 2.781.946 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.766-5.767-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.823 0-3.529-.493-5.002-1.353l-5.998 1.572 1.603-5.851c-.961-1.536-1.503-3.342-1.503-5.368 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
              </svg>
            </div>
          </div>

          {/* 4 Pasos / Columnas de Valor */}
          <div className="banner-whatsapp-pasos">
            {/* Paso 1 */}
            <div className="whatsapp-paso-item">
              <h4 className="paso-titulo">¿Dudas o consultas?</h4>
              <p className="paso-desc">Escríbenos por WhatsApp y te ayudamos con tu compra.</p>
            </div>

            {/* Paso 2 */}
            <div className="whatsapp-paso-item con-icono">
              <div className="paso-mini-icono">
                <UserCheck size={16} />
              </div>
              <div>
                <h4 className="paso-titulo">Asesoría personalizada</h4>
                <p className="paso-desc">Te ayudamos a elegir lo mejor para ti.</p>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="whatsapp-paso-item con-icono">
              <div className="paso-mini-icono">
                <Headphones size={16} />
              </div>
              <div>
                <h4 className="paso-titulo">Atención rápida</h4>
                <p className="paso-desc">Respondemos todas tus consultas.</p>
              </div>
            </div>

            {/* Paso 4 */}
            <div className="whatsapp-paso-item con-icono">
              <div className="paso-mini-icono">
                <Send size={16} />
              </div>
              <div>
                <h4 className="paso-titulo">Cotiza por WhatsApp</h4>
                <p className="paso-desc">Envía tu selección y recibe una cotización al instante.</p>
              </div>
            </div>
          </div>

          {/* Botón CTA a la derecha */}
          <div className="banner-whatsapp-boton-col">
            <button
              type="button"
              onClick={manejarClickWhatsApp}
              className="btn-consultar-whatsapp"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.972.575 1.777.946 2.781.946 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.766-5.767-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.823 0-3.529-.493-5.002-1.353l-5.998 1.572 1.603-5.851c-.961-1.536-1.503-3.342-1.503-5.368 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
              </svg>
              <span>Consultar por WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .banner-whatsapp-seccion {
          width: 100%;
          margin: 2.2rem 0;
        }

        .banner-whatsapp-card {
          background: #081122;
          border: 1px solid rgba(0, 180, 216, 0.4);
          border-radius: var(--radio-lg);
          padding: 1.25rem 1.75rem;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 180, 216, 0.05);
          position: relative;
          overflow: hidden;
        }

        .banner-whatsapp-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: #00b4d8;
          box-shadow: 0 0 10px #00d2ff;
        }

        .banner-whatsapp-contenido {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .banner-whatsapp-icono-principal {
          flex-shrink: 0;
        }

        .circulo-verde-whatsapp {
          width: 46px;
          height: 46px;
          background: rgba(37, 211, 102, 0.15);
          border: 1px solid rgba(37, 211, 102, 0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #25d366;
          box-shadow: 0 0 15px rgba(37, 211, 102, 0.3);
        }

        .banner-whatsapp-pasos {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          flex: 1;
        }

        .whatsapp-paso-item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .whatsapp-paso-item.con-icono {
          flex-direction: row;
          align-items: flex-start;
          gap: 0.6rem;
        }

        .paso-mini-icono {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(0, 180, 216, 0.12);
          border: 1px solid rgba(0, 180, 216, 0.3);
          color: #00b4d8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .paso-titulo {
          font-size: 0.82rem;
          font-weight: 700;
          color: #f1f5f9;
          line-height: 1.2;
        }

        .paso-desc {
          font-size: 0.72rem;
          color: #8497b0;
          line-height: 1.35;
        }

        .banner-whatsapp-boton-col {
          flex-shrink: 0;
        }

        .btn-consultar-whatsapp {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(11, 23, 44, 0.9);
          border: 1px solid rgba(0, 180, 216, 0.7);
          color: #ffffff;
          padding: 0.65rem 1.4rem;
          border-radius: var(--radio-md);
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.35);
        }

        .btn-consultar-whatsapp:hover {
          background: rgba(0, 180, 216, 0.2);
          border-color: #00d2ff;
          box-shadow: 0 0 25px rgba(0, 210, 255, 0.7);
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}

export default BannerWhatsApp;
