import React from 'react';
import logoNas from '../../assets/logo/logo-nas.png';
import { useAutenticacionContext } from '../../contextos/ContextoAutenticacion';

export function PiePagina({ onNavegar }) {
  const { abrirModalAuth, estaAutenticado, usuario, cerrarSesion } = useAutenticacionContext();

  const manejarLink = (e, ruta) => {
    e.preventDefault();
    if (onNavegar) {
      onNavegar(ruta);
    }
  };

  return (
    <footer className="pie-pagina-nas">
      <div className="contenedor-principal">
        <div className="pie-pagina-grid">
          {/* Logo y Slogan */}
          <div className="pie-columna-logo">
            <img src={logoNas} alt="NAS Computer" className="pie-logo-img" />
          </div>

          {/* Columna Navegación */}
          <div className="pie-columna">
            <h4 className="pie-columna-titulo">NAVEGACIÓN</h4>
            <ul className="pie-lista-enlaces">
              <li><a href="#inicio" onClick={(e) => manejarLink(e, 'inicio')}>Inicio</a></li>
              <li><a href="#categorias" onClick={(e) => manejarLink(e, 'categorias')}>Categorías</a></li>
              <li><a href="#ofertas" onClick={(e) => manejarLink(e, 'ofertas')}>Ofertas</a></li>
              <li><a href="#contacto" onClick={(e) => manejarLink(e, 'contacto')}>Contacto</a></li>
            </ul>
          </div>

          {/* Columna Mi Cuenta */}
          <div className="pie-columna">
            <h4 className="pie-columna-titulo">MI CUENTA</h4>
            <ul className="pie-lista-enlaces">
              {estaAutenticado ? (
                <>
                  <li><span style={{ color: '#00d2ff', fontSize: '0.8rem' }}>Hola, {usuario?.nombre}</span></li>
                  <li><a href="#cerrar" onClick={(e) => { e.preventDefault(); cerrarSesion(); }}>Cerrar sesión</a></li>
                </>
              ) : (
                <>
                  <li><a href="#login" onClick={(e) => { e.preventDefault(); abrirModalAuth('login'); }}>Iniciar sesión</a></li>
                  <li><a href="#registro" onClick={(e) => { e.preventDefault(); abrirModalAuth('registro'); }}>Registrarse</a></li>
                </>
              )}
              <li><a href="#solicitudes" onClick={(e) => manejarLink(e, 'solicitudes')}>Mis solicitudes</a></li>
            </ul>
          </div>

          {/* Columna Información */}
          <div className="pie-columna">
            <h4 className="pie-columna-titulo">INFORMACIÓN</h4>
            <ul className="pie-lista-enlaces">
              <li><a href="#nosotros" onClick={(e) => manejarLink(e, 'nosotros')}>¿Quiénes somos?</a></li>
              <li><a href="#terminos" onClick={(e) => manejarLink(e, 'terminos')}>Términos y condiciones</a></li>
              <li><a href="#privacidad" onClick={(e) => manejarLink(e, 'privacidad')}>Política de privacidad</a></li>
              <li><a href="#faq" onClick={(e) => manejarLink(e, 'faq')}>Preguntas frecuentes</a></li>
            </ul>
          </div>

          {/* Columna Síguenos */}
          <div className="pie-columna pie-columna-social">
            <div className="pie-seccion-siguenos">
              <h4 className="pie-columna-titulo">SÍGUENOS</h4>
              <div className="pie-redes-sociales">
                {/* Facebook */}
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="red-social-btn fb" aria-label="Facebook">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.889C10.5 0 9 1.5 9 4.667V8z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="red-social-btn ig" aria-label="Instagram">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                {/* WhatsApp */}
                <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="red-social-btn wa" aria-label="WhatsApp">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.972.575 1.777.946 2.781.946 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.766-5.767-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.823 0-3.529-.493-5.002-1.353l-5.998 1.572 1.603-5.851c-.961-1.536-1.503-3.342-1.503-5.368 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
                  </svg>
                </a>
                {/* YouTube */}
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="red-social-btn yt" aria-label="YouTube">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Barra inferior de copyright */}
        <div className="pie-pagina-inferior">
          <p>© 2026 NAS Computer. Todos los derechos reservados.</p>
        </div>
      </div>

      <style>{`
        .pie-pagina-nas {
          background-color: #04070e;
          border-top: 1px solid #101c33;
          padding: 3rem 0 1.5rem 0;
          margin-top: auto;
        }

        .pie-pagina-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.1fr 1fr;
          gap: 2rem;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .pie-columna-logo {
          display: flex;
          align-items: flex-start;
        }

        .pie-logo-img {
          height: 48px;
          object-fit: contain;
        }

        .pie-columna {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .pie-columna-titulo {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #94a3b8;
          text-transform: uppercase;
        }

        .pie-lista-enlaces {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .pie-lista-enlaces a {
          font-size: 0.8rem;
          color: #cbd5e1;
          transition: all 0.2s ease;
        }

        .pie-lista-enlaces a:hover {
          color: #00d2ff;
          transform: translateX(3px);
          display: inline-block;
        }

        .pie-columna-social {
          gap: 1.5rem;
        }

        .pie-redes-sociales {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .red-social-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .red-social-btn:hover {
          transform: translateY(-2px);
        }

        .red-social-btn.fb {
          background: #1877f2;
          box-shadow: 0 0 10px rgba(24, 119, 242, 0.4);
        }

        .red-social-btn.ig {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          box-shadow: 0 0 10px rgba(220, 39, 67, 0.4);
        }

        .red-social-btn.wa {
          background: #25d366;
          box-shadow: 0 0 10px rgba(37, 211, 102, 0.4);
        }

        .red-social-btn.yt {
          background: #ff0000;
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.4);
        }

        .pie-pagina-inferior {
          padding-top: 1.5rem;
          text-align: center;
          font-size: 0.75rem;
          color: #475569;
        }
      `}</style>
    </footer>
  );
}

export default PiePagina;
