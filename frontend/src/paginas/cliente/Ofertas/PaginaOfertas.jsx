import React, { useState } from 'react';
import { useProductosContext } from '../../../contextos/ContextoProductos';
import { GrillaProductos } from '../../../componentes/Productos/GrillaProductos';
import { ModalDetalleProducto } from '../../../componentes/Productos/ModalDetalleProducto';
import { Sparkles, Tag } from 'lucide-react';

export function PaginaOfertas() {
  const { productos } = useProductosContext();
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const productosEnOferta = productos.filter(p => p.badge === 'SALE' || !!p.precioAnterior || p.tipoSeccion === 'ofertas');

  return (
    <main className="pagina-ofertas-nas">
      <div className="contenedor-principal">
        <div className="ofertas-hero-card">
          <div className="ofertas-badge-tag">
            <Tag size={14} /> OFERTAS EXCLUSIVAS
          </div>
          <h1 className="ofertas-titulo">Equipos y Componentes con Descuento Especial</h1>
          <p className="ofertas-sub">Aprovecha precios promocionales en tecnología de vanguardia y hardware de alto rendimiento.</p>
        </div>

        <div className="ofertas-grilla-area">
          <GrillaProductos
            productos={productosEnOferta}
            columnas={3}
            alHacerClicProducto={(prod) => setProductoSeleccionado(prod)}
          />
        </div>
      </div>

      {productoSeleccionado && (
        <ModalDetalleProducto
          producto={productoSeleccionado}
          alCerrar={() => setProductoSeleccionado(null)}
        />
      )}

      <style>{`
        .pagina-ofertas-nas {
          padding: 2rem 0 3rem 0;
        }

        .ofertas-hero-card {
          background: linear-gradient(135deg, rgba(0, 180, 216, 0.15) 0%, rgba(5, 8, 17, 0.8) 100%);
          border: 1px solid rgba(0, 180, 216, 0.35);
          border-radius: var(--radio-xl);
          padding: 2.5rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
        }

        .ofertas-badge-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #00b4d8;
          color: #050811;
          font-weight: 800;
          font-size: 0.72rem;
          padding: 0.25rem 0.65rem;
          border-radius: 9999px;
          margin-bottom: 0.75rem;
          letter-spacing: 0.05em;
        }

        .ofertas-titulo {
          font-size: 1.85rem;
          color: #ffffff;
          font-weight: 800;
        }

        .ofertas-sub {
          font-size: 0.95rem;
          color: #94a3b8;
          margin-top: 0.5rem;
          max-width: 650px;
        }
      `}</style>
    </main>
  );
}

export default PaginaOfertas;
