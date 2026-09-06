import React from 'react';
import { Truck, ShieldCheck, CreditCard, Headphones } from 'lucide-react';

export function BarraBeneficios() {
  const beneficios = [
    {
      id: 1,
      icono: <Truck size={24} />,
      titulo: 'Envíos rápidos y seguros',
      subtitulo: 'a toda la ciudad'
    },
    {
      id: 2,
      icono: <ShieldCheck size={24} />,
      titulo: 'Garantía asegurada',
      subtitulo: 'Productos 100% garantizados'
    },
    {
      id: 3,
      icono: <CreditCard size={24} />,
      titulo: 'Pagos seguros',
      subtitulo: 'Tu compra protegida'
    },
    {
      id: 4,
      icono: <Headphones size={24} />,
      titulo: 'Soporte especializado',
      subtitulo: 'Te ayudamos siempre'
    }
  ];

  return (
    <section className="barra-beneficios-seccion">
      <div className="barra-beneficios-grid">
        {beneficios.map((item) => (
          <div key={item.id} className="beneficio-item">
            <div className="beneficio-icono-wrapper">
              {item.icono}
            </div>
            <div className="beneficio-info">
              <h4 className="beneficio-titulo">{item.titulo}</h4>
              <p className="beneficio-subtitulo">{item.subtitulo}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .barra-beneficios-seccion {
          width: 100%;
          background: #081021;
          border: 1px solid #14223d;
          border-radius: var(--radio-lg);
          padding: 1.25rem 2rem;
          margin: 2rem 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        .barra-beneficios-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          align-items: center;
        }

        .beneficio-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .beneficio-icono-wrapper {
          color: #00b4d8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          filter: drop-shadow(0 0 8px rgba(0, 180, 216, 0.4));
        }

        .beneficio-info {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }

        .beneficio-titulo {
          font-size: 0.85rem;
          font-weight: 700;
          color: #f1f5f9;
        }

        .beneficio-subtitulo {
          font-size: 0.75rem;
          color: #64748b;
        }
      `}</style>
    </section>
  );
}

export default BarraBeneficios;
