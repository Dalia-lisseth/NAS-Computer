import React, { useMemo, useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  CheckCircle,
  Plus,
  Minus,
  Search,
  PencilLine,
  RefreshCw,
  ShieldAlert
} from 'lucide-react';
import { useProductosContext } from '../../../contextos/ContextoProductos';
import { formatearPrecio } from '../../../utilidades/formatearPrecio';
import { TarjetaKpiAdmin } from '../../../componentes/Administracion/TarjetaKpiAdmin';
import { ModalFormularioProducto } from '../../../componentes/Administracion/ModalFormularioProducto';

export function PaginaAdminInventario() {
  const { productos, actualizarStock, actualizarProducto } = useProductosContext();
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [modalReponer, setModalReponer] = useState(null);
  const [cantidadReponer, setCantidadReponer] = useState(10);
  const [productoAEditar, setProductoAEditar] = useState(null);

  const categorias = useMemo(() => (
    [...new Set(productos.map((producto) => producto.categoriaNombre || producto.categoria || 'General'))]
  ), [productos]);

  const totalUnidades = productos.reduce((acc, p) => acc + (p.stock || 0), 0);
  const valorTotalInventario = productos.reduce((acc, p) => acc + ((p.precio || 0) * (p.stock || 0)), 0);
  const agotados = productos.filter((p) => (p.stock || 0) === 0);
  const stockBajo = productos.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= (p.stockMinimo || 4));

  const productosFiltrados = productos.filter((producto) => {
    const texto = busqueda.trim().toLowerCase();
    const coincideTexto = !texto || producto.nombre.toLowerCase().includes(texto);
    const categoriaOk = categoriaFiltro === 'todas' || (producto.categoriaNombre || producto.categoria) === categoriaFiltro;
    const stock = producto.stock || 0;
    const min = producto.stockMinimo || 4;
    const estadoOk = estadoFiltro === 'todos'
      || (estadoFiltro === 'disponibles' && stock > min)
      || (estadoFiltro === 'bajo' && stock > 0 && stock <= min)
      || (estadoFiltro === 'agotados' && stock === 0);

    return coincideTexto && categoriaOk && estadoOk;
  });

  const disponibles = productosFiltrados.filter((p) => (p.stock || 0) > (p.stockMinimo || 4));
  const bajoStock = productosFiltrados.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= (p.stockMinimo || 4));
  const agotadosFiltrados = productosFiltrados.filter((p) => (p.stock || 0) === 0);

  const cambiarStockDirecto = (id, stockActual, delta) => {
    actualizarStock(id, Math.max(0, Number(stockActual || 0) + Number(delta || 0)));
  };

  const abrirReponer = (producto) => {
    setModalReponer(producto);
    setCantidadReponer(10);
  };

  const confirmarReposicion = () => {
    if (!modalReponer) return;
    const nuevoStock = (modalReponer.stock || 0) + Number(cantidadReponer || 0);
    actualizarStock(modalReponer.id, nuevoStock);
    setModalReponer(null);
  };

  const guardarEdicionProducto = (datosProducto) => {
    if (!productoAEditar) return;
    actualizarProducto(productoAEditar.id, datosProducto);
    setProductoAEditar(null);
  };

  const renderTarjetaProducto = (producto, tipo) => {
    const stock = producto.stock || 0;
    const minimo = producto.stockMinimo || 4;
    const nivel = Math.min(100, Math.max(0, ((stock / Math.max(minimo, 1)) * 100)));
    const estadoColor = tipo === 'agotado' ? 'rojo' : tipo === 'bajo' ? 'ambar' : 'verde';

    return (
      <div key={producto.id} className={`admin-inventario-ficha ${tipo}`}>
        <div className="admin-inventario-ficha-head">
          <div className="admin-inventario-miniatura">
            <img src={producto.imagen} alt={producto.nombre} />
          </div>

          <div className="admin-inventario-info">
            <h4>{producto.nombre}</h4>
            <span>{producto.categoriaNombre || producto.categoria || 'General'}</span>
          </div>

          <div className={`admin-inventario-stock-label ${estadoColor}`}>
            Stock: {stock} uds.
          </div>
        </div>

        <div className="admin-inventario-barra-wrap">
          <div className={`admin-inventario-barra ${estadoColor}`} style={{ width: `${Math.min(100, nivel)}%` }} />
        </div>

        <div className="admin-inventario-controles">
          <div className="admin-inventario-stepper">
            <button type="button" onClick={() => cambiarStockDirecto(producto.id, stock, -1)} aria-label="Disminuir stock">
              <Minus size={12} />
            </button>
            <span>{stock}</span>
            <button type="button" onClick={() => cambiarStockDirecto(producto.id, stock, 1)} aria-label="Aumentar stock">
              <Plus size={12} />
            </button>
          </div>

          {tipo === 'agotado' ? (
            <button type="button" className="admin-inventario-btn reponer" onClick={() => abrirReponer(producto)}>
              <RefreshCw size={14} />
              Reponer stock
            </button>
          ) : (
            <button type="button" className="admin-inventario-btn" onClick={() => setProductoAEditar(producto)}>
              <PencilLine size={14} />
              Editar
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-inventario-vista">
      <div className="admin-kpis-grid">
        <TarjetaKpiAdmin titulo="Unidades Totales" valor={`${totalUnidades} uds.`} icono={<Boxes size={22} />} color="cyan" />
        <TarjetaKpiAdmin titulo="Valor del Inventario" valor={formatearPrecio(valorTotalInventario)} icono={<CheckCircle size={22} />} color="green" />
        <TarjetaKpiAdmin titulo="Bajo stock" valor={`${stockBajo.length} productos`} icono={<AlertTriangle size={22} />} color="gold" subtexto="≤ 4 unidades" />
        <TarjetaKpiAdmin titulo="Agotados" valor={`${agotados.length} productos`} icono={<ShieldAlert size={22} />} color={agotados.length > 0 ? 'red' : 'green'} subtexto="0 unidades" />
      </div>

      <div className="admin-inventario-toolbar">
        <div className="admin-tabla-busqueda">
          <Search size={16} className="admin-tabla-icono-lupa" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto..."
            className="admin-tabla-input"
          />
        </div>

        <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)} className="admin-tabla-select">
          <option value="todas">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria} value={categoria}>{categoria}</option>
          ))}
        </select>

        <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} className="admin-tabla-select">
          <option value="todos">Todos los estados</option>
          <option value="disponibles">Disponibles</option>
          <option value="bajo">Bajo stock</option>
          <option value="agotados">Agotados</option>
        </select>
      </div>

      <div className="admin-inventario-grid-3">
        <section className="admin-inventario-columna disponible">
          <div className="admin-inventario-header-row">
            <h3>Disponibles ({disponibles.length})</h3>
          </div>
          <div className="admin-inventario-lista">
            {disponibles.length ? disponibles.map((producto) => renderTarjetaProducto(producto, 'disponible')) : <div className="admin-inventario-vacio">Sin productos disponibles.</div>}
          </div>
        </section>

        <section className="admin-inventario-columna bajo">
          <div className="admin-inventario-header-row">
            <h3>Bajo stock ({bajoStock.length})</h3>
          </div>
          <div className="admin-inventario-lista">
            {bajoStock.length ? bajoStock.map((producto) => renderTarjetaProducto(producto, 'bajo')) : <div className="admin-inventario-vacio">Sin alertas de stock.</div>}
          </div>
        </section>

        <section className="admin-inventario-columna agotado">
          <div className="admin-inventario-header-row">
            <h3>Agotados ({agotadosFiltrados.length})</h3>
          </div>
          <div className="admin-inventario-lista">
            {agotadosFiltrados.length ? agotadosFiltrados.map((producto) => renderTarjetaProducto(producto, 'agotado')) : <div className="admin-inventario-vacio">Sin productos agotados.</div>}
          </div>
        </section>
      </div>

      {modalReponer && (
        <div className="admin-banner-modal-backdrop" onClick={() => setModalReponer(null)}>
          <div className="admin-banner-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-banner-modal-header">
              <h3>Reponer stock</h3>
              <button type="button" className="admin-banner-modal-close" onClick={() => setModalReponer(null)}><ShieldAlert size={18} /></button>
            </div>
            <p className="admin-reponer-text">{modalReponer.nombre} está agotado. Ingresa la cantidad a reponer.</p>
            <div className="admin-reponer-row">
              <input type="number" min="1" value={cantidadReponer} onChange={(e) => setCantidadReponer(e.target.value)} />
              <button type="button" className="btn-agregar-producto-admin" onClick={confirmarReposicion}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {productoAEditar && (
        <ModalFormularioProducto
          productoAEditar={productoAEditar}
          alCerrar={() => setProductoAEditar(null)}
          alGuardar={guardarEdicionProducto}
        />
      )}

      <style>{`
        .admin-inventario-vista {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .admin-inventario-toolbar {
          display: grid;
          grid-template-columns: minmax(220px, 1.5fr) minmax(180px, 1fr) minmax(180px, 1fr);
          gap: 1rem;
          background: rgba(9, 16, 33, 0.8);
          border: 1px solid #162645;
          border-radius: 16px;
          padding: 1rem;
        }

        .admin-inventario-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.25rem;
          min-height: 540px;
        }

        .admin-inventario-columna {
          background: rgba(9, 16, 33, 0.92);
          border: 1px solid rgba(34, 211, 238, 0.2);
          border-radius: 18px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 480px;
        }

        .admin-inventario-columna.bajo { border-color: rgba(251, 191, 36, 0.35); }
        .admin-inventario-columna.agotado { border-color: rgba(239, 68, 68, 0.4); }

        .admin-inventario-header-row h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #f8fafc;
        }

        .admin-inventario-lista {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          flex: 1;
        }

        .admin-inventario-ficha {
          background: rgba(8, 15, 29, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.15);
          border-radius: 14px;
          padding: 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          min-height: 146px;
        }

        .admin-inventario-ficha-head {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .admin-inventario-miniatura {
          width: 56px;
          height: 56px;
          border-radius: 10px;
          overflow: hidden;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.18);
          flex-shrink: 0;
        }

        .admin-inventario-miniatura img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .admin-inventario-info {
          flex: 1;
          min-width: 0;
        }

        .admin-inventario-info h4 {
          margin: 0 0 0.2rem;
          color: #f8fafc;
          font-size: 0.92rem;
          line-height: 1.3;
          overflow-wrap: anywhere;
        }

        .admin-inventario-info span {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        .admin-inventario-stock-label {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.3rem 0.5rem;
          border-radius: 999px;
        }

        .admin-inventario-stock-label.verde { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .admin-inventario-stock-label.ambar { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        .admin-inventario-stock-label.rojo { background: rgba(239, 68, 68, 0.15); color: #fca5a5; }

        .admin-inventario-barra-wrap {
          width: 100%;
          height: 8px;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.15);
          overflow: hidden;
        }

        .admin-inventario-barra {
          height: 100%;
          border-radius: 999px;
        }

        .admin-inventario-barra.verde { background: linear-gradient(90deg, #22c55e, #34d399); }
        .admin-inventario-barra.ambar { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
        .admin-inventario-barra.rojo { background: linear-gradient(90deg, #ef4444, #f87171); }

        .admin-inventario-controles {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          margin-top: auto;
        }

        .admin-inventario-stepper {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem;
          border-radius: 10px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.18);
        }

        .admin-inventario-stepper button {
          width: 26px;
          height: 26px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #dbeafe;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .admin-inventario-stepper span {
          min-width: 32px;
          text-align: center;
          color: #f8fafc;
          font-weight: 700;
        }

        .admin-inventario-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 0.75rem;
          border-radius: 9px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          background: rgba(8, 15, 29, 0.75);
          color: #dbeafe;
          cursor: pointer;
        }

        .admin-inventario-btn.reponer {
          background: rgba(239, 68, 68, 0.10);
          border-color: rgba(239, 68, 68, 0.35);
          color: #fecaca;
        }

        .admin-inventario-ver-mas {
          margin-top: auto;
          border: none;
          background: transparent;
          color: #fca5a5;
          font-weight: 700;
          text-align: left;
          padding: 0.25rem 0;
          cursor: pointer;
        }

        .admin-inventario-vacio {
          border: 1px dashed rgba(148, 163, 184, 0.2);
          border-radius: 12px;
          padding: 1rem;
          color: #94a3b8;
          text-align: center;
        }

        .admin-inventario-footer-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          background: rgba(9, 16, 33, 0.8);
          border: 1px solid #162645;
          border-radius: 14px;
          padding: 0.9rem 1rem;
          flex-wrap: wrap;
        }

        .admin-inventario-consejo {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          color: #cbd5e1;
        }

        .admin-inventario-report-btn {
          border: 1px solid rgba(34, 211, 238, 0.25);
          background: rgba(8, 15, 29, 0.7);
          color: #a5f3fc;
          border-radius: 9px;
          padding: 0.6rem 1rem;
          cursor: pointer;
        }

        .admin-reponer-text {
          margin: 0 0 1rem;
          color: #cbd5e1;
        }

        .admin-reponer-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .admin-reponer-row input {
          flex: 1;
          background: #0b1425;
          border: 1px solid #1c3057;
          border-radius: 10px;
          padding: 0.7rem 0.8rem;
          color: #f8fafc;
        }

        @media (max-width: 1100px) {
          .admin-inventario-grid-3 {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .admin-inventario-toolbar {
            grid-template-columns: 1fr;
          }

          .admin-inventario-controles {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}

export default PaginaAdminInventario;
