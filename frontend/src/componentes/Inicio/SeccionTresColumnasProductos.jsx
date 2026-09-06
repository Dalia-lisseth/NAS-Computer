import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useProductosContext } from '../../contextos/ContextoProductos';
import { TarjetaProducto } from '../Productos/TarjetaProducto';

export function SeccionTresColumnasProductos({ alSeleccionarProducto, onVerSeccion }) {
  const { productos } = useProductosContext();

  // Filtrar de forma dinámica y reactiva
  const destacados = productos.filter(p => p.tipoSeccion === 'destacados');
  const ofertas = productos.filter(p => p.tipoSeccion === 'ofertas' || p.badge === 'SALE' || p.precioAnterior);
  const masVendidos = productos.filter(p => p.tipoSeccion === 'masVendidos');

  const secciones = [
    {
      id: 'destacados',
      titulo: 'PRODUCTOS DESTACADOS',
      productos: destacados.slice(0, 3),
      enlace: 'destacados'
    },
    {
      id: 'ofertas',
      titulo: 'PRODUCTOS EN OFERTA',
      productos: ofertas.slice(0, 3),
      enlace: 'ofertas'
    },
    {
      id: 'masVendidos',
      titulo: 'MÁS VENDIDOS',
      productos: masVendidos.slice(0, 3),
      enlace: 'masVendidos'
    }
  ];

  return (
    <section className="seccion-tres-columnas-nas">
      <div className="seccion-tres-columnas-grid">
        {secciones.map((sec) => (
          <div key={sec.id} className="columna-bloque-productos">
            {/* Encabezado del bloque */}
            <div className="titulo-seccion-contenedor">
              <h3 className="titulo-seccion">{sec.titulo}</h3>
              <button
                type="button"
                className="enlace-ver-todas"
                onClick={() => onVerSeccion && onVerSeccion(sec.enlace)}
              >
                Ver todos <ArrowRight size={13} />
              </button>
            </div>

            {/* Fila de 3 productos del bloque */}
            <div className="columna-productos-cards-grid">
              {sec.productos.map((prod) => (
                <TarjetaProducto
                  key={prod.id}
                  producto={prod}
                  alHacerClic={alSeleccionarProducto}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .seccion-tres-columnas-nas {
          width: 100%;
          margin-bottom: 2.2rem;
        }

        .seccion-tres-columnas-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          width: 100%;
        }

        .columna-bloque-productos {
          display: flex;
          flex-direction: column;
        }

        .columna-productos-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.65rem;
        }

        @media (max-width: 1300px) {
          .seccion-tres-columnas-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .columna-productos-cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 640px) {
          .columna-productos-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

export default SeccionTresColumnasProductos;
