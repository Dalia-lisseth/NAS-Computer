import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Package,
  Layers
} from 'lucide-react';
import { useProductosContext } from '../../../contextos/ContextoProductos';
import { ModalFormularioCategoria } from '../../../componentes/Administracion/ModalFormularioCategoria';

export function PaginaAdminCategorias() {
  const {
    categorias,
    productos,
    agregarCategoria,
    actualizarCategoria,
    eliminarCategoria
  } = useProductosContext();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [catAEditar, setCatAEditar] = useState(null);

  const abrirCrear = () => {
    setCatAEditar(null);
    setModalAbierto(true);
  };

  const abrirEditar = (cat) => {
    setCatAEditar(cat);
    setModalAbierto(true);
  };

  const manejarGuardar = (datos) => {
    if (catAEditar) {
      actualizarCategoria(catAEditar.id, datos);
    } else {
      agregarCategoria(datos);
    }
    setModalAbierto(false);
    setCatAEditar(null);
  };

  const manejarEliminar = (id, nombre) => {
    if (window.confirm(`¿Eliminar la categoría "${nombre}" y todos sus productos asociados?`)) {
      eliminarCategoria(id);
    }
  };

  return (
    <div className="admin-categorias-vista">
      <div className="admin-seccion-header-row">
        <div>
          <h2>Categorías de Productos</h2>
          <p>Organiza las categorías visibles en el menú de navegación y en la página principal.</p>
        </div>

        <button
          type="button"
          className="btn-agregar-producto-admin"
          onClick={abrirCrear}
        >
          <Plus size={16} />
          <span>Nueva Categoría</span>
        </button>
      </div>

      <div className="admin-categorias-grid">
        {categorias.map((cat) => {
          const conteoProds = productos.filter(p => p.categoria === cat.slug || p.categoria === cat.id).length;

          return (
            <div key={cat.id} className="admin-cat-card">
              <div className="admin-cat-top">
                <div className="admin-cat-icon-box">
                  <Layers size={22} />
                </div>
                <div className="admin-cat-actions">
                  <button
                    type="button"
                    className="btn-accion-tabla editar"
                    onClick={() => abrirEditar(cat)}
                    title="Editar categoría"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    type="button"
                    className="btn-accion-tabla eliminar"
                    onClick={() => manejarEliminar(cat.id, cat.nombre)}
                    title="Eliminar categoría"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <h3 className="admin-cat-nombre">{cat.nombre}</h3>
              <p className="admin-cat-slug">Identificador: <code>{cat.slug}</code></p>
              {cat.descripcion && <p className="admin-cat-desc">{cat.descripcion}</p>}

              <div className="admin-cat-footer">
                <Package size={14} />
                <span>{conteoProds} {conteoProds === 1 ? 'producto asociado' : 'productos asociados'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {modalAbierto && (
        <ModalFormularioCategoria
          categoriaAEditar={catAEditar}
          alCerrar={() => setModalAbierto(false)}
          alGuardar={manejarGuardar}
        />
      )}

      <style>{`
        .admin-categorias-vista {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .admin-seccion-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .admin-seccion-header-row h2 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
        }

        .admin-seccion-header-row p {
          font-size: 0.82rem;
          color: #8497b0;
          margin-top: 0.2rem;
        }

        .admin-categorias-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        .admin-cat-card {
          background: #091021;
          border: 1px solid #162645;
          border-radius: var(--radio-lg);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          transition: all 0.25s ease;
        }

        .admin-cat-card:hover {
          border-color: rgba(0, 180, 216, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.5), 0 0 15px rgba(0,180,216,0.15);
        }

        .admin-cat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .admin-cat-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(0, 180, 216, 0.12);
          border: 1px solid rgba(0, 180, 216, 0.3);
          color: #00d2ff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-cat-actions {
          display: flex;
          gap: 0.4rem;
        }

        .admin-cat-nombre {
          font-size: 1.05rem;
          font-weight: 700;
          color: #ffffff;
        }

        .admin-cat-slug {
          font-size: 0.72rem;
          color: #64748b;
        }

        .admin-cat-slug code {
          color: #00d2ff;
        }

        .admin-cat-desc {
          font-size: 0.78rem;
          color: #94a3b8;
          line-height: 1.4;
          flex: 1;
        }

        .admin-cat-footer {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid #14223d;
          font-size: 0.75rem;
          color: #10b981;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

export default PaginaAdminCategorias;
