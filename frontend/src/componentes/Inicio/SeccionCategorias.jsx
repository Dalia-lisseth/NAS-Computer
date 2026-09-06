import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useProductosContext } from '../../contextos/ContextoProductos';
import { TarjetaCategoria } from './TarjetaCategoria';

export function SeccionCategorias({ categoriaActiva, alSeleccionarCategoria, onVerTodas }) {
  const { categorias } = useProductosContext();

  return (
    <section className="seccion-categorias-nas">
      {/* Título de Sección */}
      <div className="titulo-seccion-contenedor">
        <h2 className="titulo-seccion">CATEGORÍAS PRINCIPALES</h2>
        <button
          type="button"
          className="enlace-ver-todas"
          onClick={onVerTodas}
        >
          Ver todas <ArrowRight size={14} />
        </button>
      </div>

      {/* Fila / Grid de Categorías */}
      <div className="grid-categorias-fila">
        {categorias.slice(0, 10).map((cat) => (
          <TarjetaCategoria
            key={cat.id}
            categoria={cat}
            seleccionada={categoriaActiva === cat.slug}
            alSeleccionar={alSeleccionarCategoria}
          />
        ))}
      </div>

      <style>{`
        .seccion-categorias-nas {
          width: 100%;
          margin-bottom: 2.2rem;
        }

        .grid-categorias-fila {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 0.75rem;
          width: 100%;
        }

        @media (max-width: 1200px) {
          .grid-categorias-fila {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        @media (max-width: 768px) {
          .grid-categorias-fila {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 480px) {
          .grid-categorias-fila {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  );
}

export default SeccionCategorias;
