import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { abrirWhatsApp } from '../../../utilidades/generarMensajeWhatsApp';

export function PaginaContacto() {
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <main className="pagina-contacto-nas">
      <div className="contenedor-principal">
        <div className="contacto-cabecera">
          <h1 className="contacto-titulo">Contacto y Asesoría Tecnológica</h1>
          <p className="contacto-sub">Estamos listos para impulsar tu negocio con las mejores soluciones de hardware y computación.</p>
        </div>

        <div className="contacto-grid">
          {/* Info cards */}
          <div className="contacto-info-col">
            <div className="info-card-item">
              <div className="info-icono-box">
                <Phone size={20} />
              </div>
              <div>
                <h4>Línea de Atención / WhatsApp</h4>
                <p>+593 96 046 6181</p>
                <span className="info-badge">Lunes a Sábado: 8am - 7pm</span>
              </div>
            </div>

            <div className="info-card-item">
              <div className="info-icono-box">
                <Mail size={20} />
              </div>
              <div>
                <h4>Correo Electrónico</h4>
                <p>byronanchundia1991@gmail.com</p>
                <span>Soporte y cotizaciones corporativas</span>
              </div>
            </div>

            <div className="info-card-item">
              <div className="info-icono-box">
                <MapPin size={20} />
              </div>
              <div>
                <h4>Sede Principal</h4>
                <p>Urbirrios 1, Calle 235, entre Av. 206 y 207</p>
                <span>Envíos seguros a nivel nacional</span>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="callout-whatsapp-card">
              <MessageSquare size={24} className="wa-icon" />
              <h4>¿Necesitas respuesta inmediata?</h4>
              <p>Habla directamente con uno de nuestros ingenieros o asesores en tiempo real.</p>
              <button
                type="button"
                className="btn-wa-directo"
                onClick={() => abrirWhatsApp()}
              >
                Abrir WhatsApp Oficial
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="contacto-form-col">
            {!enviado ? (
              <form onSubmit={handleSubmit} className="contacto-form-card">
                <h3>Envíanos un mensaje</h3>

                <div className="campo-grupo">
                  <label className="campo-label">Nombre completo</label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="campo-input"
                  />
                </div>

                <div className="campo-grupo">
                  <label className="campo-label">Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="tu@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="campo-input"
                  />
                </div>

                <div className="campo-grupo">
                  <label className="campo-label">Asunto</label>
                  <input
                    type="text"
                    name="asunto"
                    required
                    placeholder="Cotización de servidor, PC Gamer, etc."
                    value={formData.asunto}
                    onChange={handleChange}
                    className="campo-input"
                  />
                </div>

                <div className="campo-grupo">
                  <label className="campo-label">Mensaje</label>
                  <textarea
                    name="mensaje"
                    rows={4}
                    required
                    placeholder="Cuéntanos sobre tu proyecto o necesidad tecnológica..."
                    value={formData.mensaje}
                    onChange={handleChange}
                    className="campo-input"
                  />
                </div>

                <button type="submit" className="btn-enviar-contacto">
                  <Send size={16} /> Enviar Mensaje
                </button>
              </form>
            ) : (
              <div className="contacto-exito-card">
                <CheckCircle2 size={48} className="icono-exito" />
                <h3>¡Mensaje Recibido!</h3>
                <p>Nuestro equipo de soporte se pondrá en contacto contigo a la brevedad posible.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .pagina-contacto-nas {
          padding: 2rem 0 3.5rem 0;
        }

        .contacto-cabecera {
          margin-bottom: 2.5rem;
          text-align: center;
        }

        .contacto-titulo {
          font-size: 2rem;
          color: #ffffff;
          font-weight: 800;
        }

        .contacto-sub {
          color: #8497b0;
          font-size: 0.95rem;
          margin-top: 0.4rem;
        }

        .contacto-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2.5rem;
        }

        .contacto-info-col {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .info-card-item {
          background: #091021;
          border: 1px solid #162645;
          border-radius: var(--radio-lg);
          padding: 1.25rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .info-icono-box {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 180, 216, 0.12);
          border: 1px solid rgba(0, 180, 216, 0.3);
          color: #00d2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .info-card-item h4 {
          font-size: 0.95rem;
          color: #ffffff;
          font-weight: 700;
        }

        .info-card-item p {
          font-size: 0.85rem;
          color: #00b4d8;
          margin-top: 0.2rem;
        }

        .info-card-item span {
          font-size: 0.75rem;
          color: #64748b;
        }

        .info-badge {
          display: inline-block;
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.72rem;
          margin-top: 0.3rem;
        }

        .callout-whatsapp-card {
          background: #071526;
          border: 1px solid rgba(0, 180, 216, 0.4);
          border-radius: var(--radio-lg);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .wa-icon {
          color: #25d366;
        }

        .callout-whatsapp-card h4 {
          color: #ffffff;
          font-size: 1.05rem;
        }

        .callout-whatsapp-card p {
          font-size: 0.82rem;
          color: #8497b0;
          line-height: 1.4;
        }

        .btn-wa-directo {
          background: #25d366;
          color: #ffffff;
          font-weight: 700;
          padding: 0.65rem 1.2rem;
          border-radius: var(--radio-md);
          margin-top: 0.4rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 0 15px rgba(37, 211, 102, 0.3);
        }

        .btn-wa-directo:hover {
          background: #20ba5a;
          box-shadow: 0 0 20px rgba(37, 211, 102, 0.6);
        }

        .contacto-form-card {
          background: #091021;
          border: 1px solid #162645;
          border-radius: var(--radio-lg);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .contacto-form-card h3 {
          font-size: 1.3rem;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .campo-grupo {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .campo-label {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: #e2ebff;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .campo-input {
          width: 100%;
          background: rgba(13, 24, 40, 0.9);
          border: 1px solid rgba(120, 147, 188, 0.35);
          border-radius: 12px;
          color: #f8fbff;
          padding: 0.8rem 0.9rem;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .campo-input::placeholder {
          color: #7d8ea5;
        }

        .campo-input:focus {
          border-color: rgba(0, 210, 255, 0.9);
          box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.12);
        }

        textarea.campo-input {
          resize: vertical;
          min-height: 120px;
        }

        .btn-enviar-contacto {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%);
          color: #ffffff;
          padding: 0.8rem;
          border-radius: var(--radio-md);
          font-weight: 700;
          cursor: pointer;
          margin-top: 0.5rem;
        }

        .contacto-exito-card {
          background: #091021;
          border: 1px solid #162645;
          border-radius: var(--radio-lg);
          padding: 3rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        @media (max-width: 860px) {
          .contacto-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

export default PaginaContacto;
