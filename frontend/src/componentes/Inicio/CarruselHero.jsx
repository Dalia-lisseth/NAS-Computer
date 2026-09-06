import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, Headphones } from 'lucide-react';
import { useProductosContext } from '../../contextos/ContextoProductos';

const iconosBeneficios = {
  Truck,
  ShieldCheck,
  Headphones
};

export function CarruselHero({ onAccionBanner }) {
  const { banners } = useProductosContext();
  const bannersActivos = useMemo(() => (Array.isArray(banners) ? banners.filter(b => b.activo !== false) : []), [banners]);
  const [slideActual, setSlideActual] = useState(0);

  const irASiguiente = () => {
    if (!bannersActivos.length) return;
    setSlideActual((prev) => (prev + 1) % bannersActivos.length);
  };

  const irAAnterior = () => {
    if (!bannersActivos.length) return;
    setSlideActual((prev) => (prev - 1 + bannersActivos.length) % bannersActivos.length);
  };

  useEffect(() => {
    if (!bannersActivos.length) return;
    const timer = setInterval(() => {
      irASiguiente();
    }, 7000);
    return () => clearInterval(timer);
  }, [bannersActivos.length]);

  if (!bannersActivos.length) {
    return null;
  }

  const bannerActual = bannersActivos[slideActual] || bannersActivos[0];

  return (
    <div className="carrusel-hero-contenedor">
      {/* Botón Flecha Anterior */}
      <button
        type="button"
        className="carrusel-nav-btn carrusel-nav-izq"
        onClick={irAAnterior}
        aria-label="Banner anterior"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Contenedor del Banner Principal */}
      <div className="carrusel-hero-slide-wrapper">
        <div className="carrusel-hero-banner-inner">
          <div className="carrusel-hero-content">
            <div className="carrusel-hero-copy">
              <p className="carrusel-hero-eyebrow">{bannerActual.tituloResaltado || 'NAS'}</p>
              <h2 className="carrusel-hero-titulo">{bannerActual.titulo}</h2>
              <p className="carrusel-hero-subtitulo">{bannerActual.subtitulo}</p>

              <div className="carrusel-hero-beneficios">
                {(bannerActual.beneficios || []).slice(0, 3).map((beneficio, indice) => {
                  const Icono = iconosBeneficios[beneficio.icono] || Truck;
                  return (
                    <div key={`${beneficio.texto}-${indice}`} className="carrusel-hero-beneficio-item">
                      <span className="carrusel-hero-beneficio-icono"><Icono size={14} /></span>
                      <span>{beneficio.texto}</span>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className="carrusel-hero-boton"
                onClick={() => onAccionBanner && onAccionBanner(bannerActual.enlace)}
              >
                {bannerActual.botonTexto || 'Ver catálogo'}
              </button>
            </div>

            <div className="carrusel-hero-imagen-wrap">
              <img
                src={bannerActual.imagen}
                alt={bannerActual.titulo || 'Banner NAS'}
                className="carrusel-hero-imagen-principal"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botón Flecha Siguiente */}
      <button
        type="button"
        className="carrusel-nav-btn carrusel-nav-der"
        onClick={irASiguiente}
        aria-label="Siguiente banner"
      >
        <ChevronRight size={20} />
      </button>

      {/* Paginador de Puntos */}
      <div className="carrusel-puntos-indicadores">
        {bannersActivos.map((_, indice) => (
          <button
            key={indice}
            type="button"
            className={`carrusel-punto ${indice === slideActual ? 'activo' : ''}`}
            onClick={() => setSlideActual(indice % bannersActivos.length)}
            aria-label={`Ir al banner ${indice + 1}`}
          />
        ))}
      </div>

      <style>{`
        .carrusel-hero-contenedor {
          position: relative;
          width: 100%;
          border-radius: var(--radio-lg);
          overflow: hidden;
          background: #050913;
          border: 1px solid #14223d;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7), inset 0 0 30px rgba(0, 180, 216, 0.05);
          margin-bottom: 2.2rem;
        }

        .carrusel-hero-slide-wrapper {
          width: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .carrusel-hero-banner-inner {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .carrusel-hero-content {
          width: 100%;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          align-items: center;
          gap: 1.5rem;
          min-height: 420px;
          padding: 2rem clamp(1.25rem, 2vw, 2.5rem);
          background: radial-gradient(circle at top left, rgba(0, 212, 255, 0.10), transparent 40%), linear-gradient(135deg, #040a18 0%, #0a1121 100%);
        }

        .carrusel-hero-copy {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          z-index: 1;
        }

        .carrusel-hero-eyebrow {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #00d2ff;
          margin: 0;
        }

        .carrusel-hero-titulo {
          margin: 0;
          font-size: clamp(2rem, 2.8vw, 3.3rem);
          line-height: 1.05;
          color: #f8fbff;
          max-width: 560px;
        }

        .carrusel-hero-subtitulo {
          margin: 0;
          max-width: 540px;
          color: #b7c5d9;
          line-height: 1.6;
        }

        .carrusel-hero-beneficios {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem 0.9rem;
          margin-top: 0.25rem;
        }

        .carrusel-hero-beneficio-item {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.78rem;
          color: #dfeaf7;
          background: rgba(10, 17, 34, 0.7);
          border: 1px solid rgba(148, 163, 184, 0.2);
          padding: 0.45rem 0.65rem;
          border-radius: 999px;
        }

        .carrusel-hero-beneficio-icono {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(0, 210, 255, 0.14);
          color: #00d2ff;
        }

        .carrusel-hero-boton {
          align-self: flex-start;
          margin-top: 0.75rem;
          background: linear-gradient(135deg, #00d2ff 0%, #38bdf8 100%);
          color: #04101d;
          border: none;
          border-radius: 999px;
          padding: 0.8rem 1.35rem;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 0 18px rgba(56, 189, 248, 0.45);
        }

        .carrusel-hero-boton:hover {
          transform: translateY(-1px);
        }

        .carrusel-hero-imagen-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }

        .carrusel-hero-imagen-principal {
          width: min(100%, 620px);
          height: auto;
          display: block;
          object-fit: cover;
          border-radius: 22px;
          box-shadow: 0 25px 60px rgba(5, 10, 20, 0.7);
        }

        /* Botones de navegación < y > */
        .carrusel-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(4, 8, 18, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
          backdrop-filter: blur(6px);
        }

        .carrusel-nav-izq {
          left: 1.25rem;
        }

        .carrusel-nav-der {
          right: 1.25rem;
        }

        .carrusel-nav-btn:hover {
          color: #ffffff;
          background: rgba(0, 180, 216, 0.4);
          border-color: #00d2ff;
          box-shadow: 0 0 15px rgba(0, 210, 255, 0.6);
        }

        /* Indicadores inferiores */
        .carrusel-puntos-indicadores {
          position: absolute;
          bottom: 0.9rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0.45rem;
          z-index: 10;
        }

        .carrusel-punto {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          padding: 0;
        }

        .carrusel-punto.activo {
          background: #00b4d8;
          box-shadow: 0 0 8px #00d2ff;
          width: 18px;
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .carrusel-hero-content {
            grid-template-columns: 1fr;
            min-height: auto;
            padding: 1.5rem 1rem 2.5rem;
          }

          .carrusel-nav-btn {
            width: 30px;
            height: 30px;
          }
          .carrusel-nav-izq {
            left: 0.5rem;
          }
          .carrusel-nav-der {
            right: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default CarruselHero;
