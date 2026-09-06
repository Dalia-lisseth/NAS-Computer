import React, { useState } from 'react';
import { CarruselHero } from '../../../componentes/Inicio/CarruselHero';
import { SeccionCategorias } from '../../../componentes/Inicio/SeccionCategorias';
import { SeccionTresColumnasProductos } from '../../../componentes/Inicio/SeccionTresColumnasProductos';
import { BannerWhatsApp } from '../../../componentes/Estructura/BannerWhatsApp';
import { BarraBeneficios } from '../../../componentes/Estructura/BarraBeneficios';
import { ModalDetalleProducto } from '../../../componentes/Productos/ModalDetalleProducto';
import { GrillaProductos } from '../../../componentes/Productos/GrillaProductos';
import { useProductos } from '../../../ganchos/useProductos';

export function PaginaInicio({ onNavegar, terminoBusqueda }) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const { productos: productosFiltrados, totalResultados } = useProductos({
    categoria: categoriaSeleccionada,
    busqueda: terminoBusqueda
  });

  const manejarClickCategoria = (cat) => {
    if (categoriaSeleccionada === cat.slug) {
      setCategoriaSeleccionada(null);
    } else {
      setCategoriaSeleccionada(cat.slug);
    }
  };

  const hayFiltroActivo = !!terminoBusqueda || !!categoriaSeleccionada;

  const manejarAccionBanner = (enlace) => {
    const destino = String(enlace || '/catalogo').replace(/^\//, '').split('?')[0];
    onNavegar && onNavegar(destino || 'catalogo');
  };

  return (
    <main className="pagina-inicio-nas">
      <div className="contenedor-principal">
        {/* Banner Hero Carousel */}
        <CarruselHero onAccionBanner={manejarAccionBanner} />

        {/* Categorías Principales */}
        <SeccionCategorias
          categoriaActiva={categoriaSeleccionada}
          alSeleccionarCategoria={manejarClickCategoria}
          onVerTodas={() => onNavegar && onNavegar('catalogo')}
        />

        {/* Vista si hay búsqueda o filtro de categoría activo */}
        {hayFiltroActivo ? (
          <section className="seccion-resultados-filtro anim-fade-in">
            <div className="titulo-seccion-contenedor">
              <h3 className="titulo-seccion">
                {terminoBusqueda
                  ? `RESULTADOS PARA "${terminoBusqueda}" (${totalResultados})`
                  : `CATEGORÍA: ${categoriaSeleccionada?.toUpperCase()} (${totalResultados})`}
              </h3>
              <button
                type="button"
                className="enlace-ver-todas"
                onClick={() => {
                  setCategoriaSeleccionada(null);
                }}
              >
                Limpiar filtro ✕
              </button>
            </div>
            <GrillaProductos
              productos={productosFiltrados}
              columnas={4}
              alHacerClicProducto={(prod) => setProductoSeleccionado(prod)}
            />
          </section>
        ) : (
          /* Las 3 Columnas: Destacados, Ofertas y Más Vendidos */
          <SeccionTresColumnasProductos
            alSeleccionarProducto={(prod) => setProductoSeleccionado(prod)}
            onVerSeccion={(seccion) => onNavegar && onNavegar(seccion)}
          />
        )}

        {/* Banner Consultas y Cotizaciones WhatsApp */}
        <BannerWhatsApp />

        {/* Barra de 4 Beneficios de Confianza */}
        <BarraBeneficios />
      </div>

      {/* Modal de Detalle de Producto */}
      {productoSeleccionado && (
        <ModalDetalleProducto
          producto={productoSeleccionado}
          alCerrar={() => setProductoSeleccionado(null)}
        />
      )}

      <style>{`
        .pagina-inicio-nas {
          padding-top: 1.5rem;
          padding-bottom: 2rem;
          width: 100%;
        }

        .seccion-resultados-filtro {
          margin-bottom: 2.5rem;
        }
      `}</style>
    </main>
  );
}

export default PaginaInicio;
