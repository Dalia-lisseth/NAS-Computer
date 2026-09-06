import React, { useState, useEffect, useMemo } from 'react';
import { useProductos } from '../../../ganchos/useProductos';
import { GrillaProductos } from '../../../componentes/Productos/GrillaProductos';
import { ModalDetalleProducto } from '../../../componentes/Productos/ModalDetalleProducto';
import { Filter, SlidersHorizontal, ChevronRight } from 'lucide-react';

export function PaginaCatalogo({ categoriaInicial = null, terminoBusqueda = '', onNavegar }) {
  const [categoria, setCategoria] = useState(categoriaInicial);
  const [orden, setOrden] = useState('relevancia');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    setCategoria(categoriaInicial);
  }, [categoriaInicial]);

  const { productos, categorias, totalResultados } = useProductos({
    categoria,
    busqueda: terminoBusqueda,
    orden
  });

  const categoriaActualObj = useMemo(() => {
    if (!categoria) return null;
    const catNormalizada = String(categoria).toLowerCase().trim();
    return categorias.find(c =>
      c.slug.toLowerCase() === catNormalizada ||
      c.id.toLowerCase() === catNormalizada ||
      c.nombre.toLowerCase() === catNormalizada
    );
  }, [categoria, categorias]);

  const seleccionarCategoria = (slug) => {
    setCategoria(slug);
    if (onNavegar) {
      if (slug) {
        onNavegar(`categoria-${slug}`);
      } else {
        onNavegar('catalogo');
      }
    }
  };

  return (
    <main className="pagina-catalogo-nas">
      <div className="contenedor-principal">
        {/* Breadcrumb de Navegación */}
        <nav className="catalogo-breadcrumb" aria-label="Navegación de ruta">
          <button
            type="button"
            className="breadcrumb-link"
            onClick={() => onNavegar && onNavegar('inicio')}
          >
            Inicio
          </button>
          <ChevronRight size={13} className="breadcrumb-sep" />
          <button
            type="button"
            className={`breadcrumb-link ${!categoria ? 'breadcrumb-activo' : ''}`}
            onClick={() => seleccionarCategoria(null)}
          >
            Categorías
          </button>
          {categoriaActualObj && (
            <>
              <ChevronRight size={13} className="breadcrumb-sep" />
              <span className="breadcrumb-activo">{categoriaActualObj.nombre}</span>
            </>
          )}
        </nav>

        {/* Cabecera del Catálogo */}
        <div className="catalogo-cabecera">
          <div>
            <h1 className="catalogo-titulo">
              {categoriaActualObj
                ? categoriaActualObj.nombre
                : terminoBusqueda
                ? `Resultados para "${terminoBusqueda}"`
                : 'Catálogo de Productos'}
            </h1>
            <p className="catalogo-sub">
              {categoriaActualObj?.descripcion ||
                'Explora nuestra gama de soluciones de cómputo, servidores, periféricos y accesorios de alto rendimiento.'}
            </p>
          </div>

          <div className="catalogo-filtros-top">
            <div className="catalogo-orden-box">
              <SlidersHorizontal size={15} />
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className="catalogo-select"
              >
                <option value="relevancia">Más relevantes</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor valorados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Catálogo: Sidebar de Categorías + Grilla */}
        <div className="catalogo-layout">
          {/* Sidebar */}
          <aside className="catalogo-sidebar">
            <h3 className="sidebar-titulo"><Filter size={15} /> Categorías</h3>
            <ul className="sidebar-lista-cats">
              <li>
                <button
                  type="button"
                  className={`sidebar-cat-btn ${!categoria ? 'activa' : ''}`}
                  onClick={() => seleccionarCategoria(null)}
                >
                  Todas las categorías
                </button>
              </li>
              {categorias.map((cat) => {
                const esActiva =
                  categoria &&
                  (categoria === cat.slug ||
                   categoria === cat.id ||
                   String(categoria).toLowerCase() === String(cat.nombre).toLowerCase());
                return (
                  <li key={cat.id}>
                    <button
                      type="button"
                      className={`sidebar-cat-btn ${esActiva ? 'activa' : ''}`}
                      onClick={() => seleccionarCategoria(cat.slug)}
                    >
                      {cat.nombre}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Grilla */}
          <div className="catalogo-contenido-area">
            <div className="catalogo-contador-resultados">
              <span>Mostrando {totalResultados} productos</span>
            </div>

            <GrillaProductos
              productos={productos}
              columnas={3}
              alHacerClicProducto={(prod) => setProductoSeleccionado(prod)}
            />
          </div>
        </div>
      </div>

      {productoSeleccionado && (
        <ModalDetalleProducto
          producto={productoSeleccionado}
          alCerrar={() => setProductoSeleccionado(null)}
        />
      )}

      <style>{`
        .pagina-catalogo-nas {
          padding: 1.75rem 0 3rem 0;
        }

        .catalogo-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          margin-bottom: 1.25rem;
          font-size: 0.82rem;
        }

        .breadcrumb-link {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0;
          font-size: 0.82rem;
          transition: color 0.15s ease;
        }

        .breadcrumb-link:hover {
          color: #00d2ff;
        }

        .breadcrumb-sep {
          color: #475569;
        }

        .breadcrumb-activo {
          color: #00d2ff;
          font-weight: 600;
        }

        .catalogo-cabecera {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
          border-bottom: 1px solid #16243f;
          padding-bottom: 1.25rem;
          gap: 1rem;
        }

        .catalogo-titulo {
          font-size: 1.75rem;
          font-weight: 800;
          color: #ffffff;
        }

        .catalogo-sub {
          font-size: 0.88rem;
          color: #8497b0;
          margin-top: 0.3rem;
        }

        .catalogo-orden-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #091021;
          border: 1px solid #1c3057;
          border-radius: var(--radio-md);
          padding: 0.4rem 0.8rem;
          color: #94a3b8;
        }

        .catalogo-select {
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 0.85rem;
          outline: none;
          cursor: pointer;
        }

        .catalogo-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 2rem;
        }

        .catalogo-sidebar {
          background: #091021;
          border: 1px solid #162645;
          border-radius: var(--radio-lg);
          padding: 1.25rem;
          height: fit-content;
        }

        .sidebar-titulo {
          font-size: 0.88rem;
          font-weight: 700;
          color: #00d2ff;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .sidebar-lista-cats {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .sidebar-cat-btn {
          width: 100%;
          text-align: left;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          color: #94a3b8;
          font-size: 0.84rem;
          transition: all 0.15s ease;
        }

        .sidebar-cat-btn:hover {
          color: #ffffff;
          background: rgba(0, 180, 216, 0.1);
        }

        .sidebar-cat-btn.activa {
          color: #00d2ff;
          background: rgba(0, 180, 216, 0.18);
          font-weight: 700;
          border-left: 3px solid #00b4d8;
        }

        .catalogo-contenido-area {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .catalogo-contador-resultados {
          font-size: 0.82rem;
          color: #64748b;
        }

        @media (max-width: 860px) {
          .catalogo-layout {
            grid-template-columns: 1fr;
          }
          .catalogo-cabecera {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}

export default PaginaCatalogo;
