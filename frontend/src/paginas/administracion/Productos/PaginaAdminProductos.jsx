import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Tag,
  Filter,
  SlidersHorizontal,
  Package
} from 'lucide-react';
import { useProductosContext } from '../../../contextos/ContextoProductos';
import { ModalFormularioProducto } from '../../../componentes/Administracion/ModalFormularioProducto';
import { Insignia } from '../../../componentes/Comunes/Insignia';
import { formatearPrecio } from '../../../utilidades/formatearPrecio';

export function PaginaAdminProductos() {
  const {
    productos,
    categorias,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    alternarEstadoOferta
  } = useProductosContext();

  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);

  const productosFiltrados = productos.filter((p) => {
    const coincideTexto =
      !busqueda ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.categoriaNombre && p.categoriaNombre.toLowerCase().includes(busqueda.toLowerCase()));

    const coincideCat = !categoriaFiltro || p.categoria === categoriaFiltro;

    return coincideTexto && coincideCat;
  });

  const abrirModalCrear = () => {
    setProductoAEditar(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (prod) => {
    setProductoAEditar(prod);
    setModalAbierto(true);
  };

  const manejarGuardar = async (datosProducto) => {
    try {
      if (productoAEditar) {
        await actualizarProducto(productoAEditar.id, datosProducto);
      } else {
        await agregarProducto(datosProducto);
      }
      setModalAbierto(false);
      setProductoAEditar(null);
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert(error.message || 'No fue posible guardar el producto.');
    }
  };

  const manejarEliminar = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${nombre}" del catálogo?`)) {
      try {
        await eliminarProducto(id);
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert(error.message || 'No fue posible eliminar el producto.');
      }
    }
  };

  return (
    <div className="admin-productos-vista">
      {/* Barra Superior con Acciones */}
      <div className="admin-tabla-panel">
        <div className="admin-tabla-top-bar">
          {/* Buscador */}
          <div className="admin-tabla-busqueda">
            <Search size={16} className="admin-tabla-icono-lupa" />
            <input
              type="text"
              placeholder="Buscar por nombre o modelo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="admin-tabla-input"
            />
          </div>

          {/* Filtro por Categoría y Botón Agregar */}
          <div className="admin-tabla-filtros">
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="admin-tabla-select"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.nombre}</option>
              ))}
            </select>

            <button
              type="button"
              className="btn-agregar-producto-admin"
              onClick={abrirModalCrear}
            >
              <Plus size={16} />
              <span>Nuevo Producto</span>
            </button>
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="admin-tabla-contenedor">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio Actual</th>
                <th>Precio Anterior</th>
                <th>Insignia</th>
                <th>Stock</th>
                <th>Ubicación</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    <Package size={32} style={{ display: 'block', margin: '0 auto 0.5rem auto', color: '#00b4d8' }} />
                    No se encontraron productos que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <div className="prod-celda-info">
                        <div className="prod-miniatura">
                          <img src={prod.imagen} alt={prod.nombre} />
                        </div>
                        <div>
                          <strong className="prod-nombre-txt">{prod.nombre}</strong>
                          <div className="prod-slug-txt">{prod.slug}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="prod-cat-badge">{prod.categoriaNombre || prod.categoria}</span>
                    </td>

                    <td>
                      <strong style={{ color: '#00d2ff', fontSize: '0.95rem' }}>
                        {formatearPrecio(prod.precio)}
                      </strong>
                    </td>

                    <td>
                      {prod.precioAnterior ? (
                        <span style={{ color: '#64748b', textDecoration: 'line-through' }}>
                          {formatearPrecio(prod.precioAnterior)}
                        </span>
                      ) : (
                        <span style={{ color: '#475569' }}>—</span>
                      )}
                    </td>

                    <td>
                      {prod.badge ? (
                        <Insignia tipo={prod.badge} />
                      ) : (
                        <span style={{ color: '#475569' }}>—</span>
                      )}
                    </td>

                    <td>
                      <span className={`stock-pill ${(prod.stock || 0) <= (prod.stockMinimo || 4) ? 'bajo' : 'disponible'}`}>
                        {prod.stock || 0} unid.
                      </span>
                    </td>

                    <td>
                      <span className="seccion-tag">
                        {prod.tipoSeccion === 'destacados' ? 'Destacados' :
                         prod.tipoSeccion === 'ofertas' ? 'Ofertas' :
                         prod.tipoSeccion === 'masVendidos' ? 'Más Vendidos' : 'General'}
                      </span>
                    </td>

                    <td>
                      <div className="admin-acciones-celda" style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn-accion-tabla editar"
                          onClick={() => abrirModalEditar(prod)}
                          title="Editar producto"
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          type="button"
                          className="btn-accion-tabla eliminar"
                          onClick={() => manejarEliminar(prod.id, prod.nombre)}
                          title="Eliminar producto"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Formulario Producto */}
      {modalAbierto && (
        <ModalFormularioProducto
          productoAEditar={productoAEditar}
          alCerrar={() => setModalAbierto(false)}
          alGuardar={manejarGuardar}
        />
      )}

      <style>{`
        .admin-productos-vista {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .btn-agregar-producto-admin {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%);
          color: #ffffff;
          padding: 0.55rem 1.15rem;
          border-radius: var(--radio-md);
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 0 12px rgba(0, 180, 216, 0.35);
        }

        .btn-agregar-producto-admin:hover {
          background: linear-gradient(135deg, #00d2ff 0%, #0096c7 100%);
          box-shadow: 0 0 20px rgba(0, 210, 255, 0.6);
        }

        .prod-celda-info {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .prod-miniatura {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          background: #060a14;
          border: 1px solid #1c2e4f;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          padding: 2px;
        }

        .prod-miniatura img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .prod-nombre-txt {
          color: #ffffff;
          display: block;
          font-size: 0.86rem;
        }

        .prod-slug-txt {
          font-size: 0.72rem;
          color: #64748b;
        }

        .prod-cat-badge {
          background: rgba(0, 180, 216, 0.08);
          border: 1px solid rgba(0, 180, 216, 0.2);
          color: #cbd5e1;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .seccion-tag {
          font-size: 0.72rem;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}

export default PaginaAdminProductos;
