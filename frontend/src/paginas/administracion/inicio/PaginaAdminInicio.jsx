import React, { useState, useEffect } from 'react';
import {
  Package,
  Boxes,
  FolderTree,
  MessageSquareQuote,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye
} from 'lucide-react';
import { useProductosContext } from '../../../contextos/ContextoProductos';
import { TarjetaKpiAdmin } from '../../../componentes/Administracion/TarjetaKpiAdmin';
import { ModalFormularioProducto } from '../../../componentes/Administracion/ModalFormularioProducto';
import { ModalDetalleSolicitud } from '../../../componentes/Administracion/ModalDetalleSolicitud';
import { servicioSolicitudes } from '../../../servicios/servicioSolicitudes';
import { formatearPrecio } from '../../../utilidades/formatearPrecio';

export function PaginaAdminInicio({ onCambiarSeccion }) {
  const { productos, categorias, agregarProducto, actualizarStock } = useProductosContext();

  const [solicitudes, setSolicitudes] = useState([]);
  const [modalNuevoProducto, setModalNuevoProducto] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  useEffect(() => {
    servicioSolicitudes.obtenerSolicitudes().then(data => {
      setSolicitudes(data);
    });
  }, []);

  const productosStockBajo = productos.filter(p => (p.stock || 0) <= (p.stockMinimo || 4));
  const totalOfertas = productos.filter(p => p.badge === 'SALE' || p.precioAnterior).length;
  const valorInventario = productos.reduce((acc, p) => acc + ((p.precio || 0) * (p.stock || 0)), 0);

  const guardarNuevoProducto = (datos) => {
    agregarProducto(datos);
    setModalNuevoProducto(false);
  };

  const cambiarEstadoSolicitud = (id, nuevoEstado) => {
    const actualizadas = solicitudes.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s);
    setSolicitudes(actualizadas);
    localStorage.setItem('nas_solicitudes', JSON.stringify(actualizadas));
    setSolicitudSeleccionada(null);
  };

  return (
    <div className="admin-inicio-vista">
      {/* 4 KPIs Principales */}
      <div className="admin-kpis-grid">
        <TarjetaKpiAdmin
          titulo="Total Productos"
          valor={productos.length}
          icono={<Package size={22} />}
          color="cyan"
          subtexto={`${categorias.length} categorías activas`}
        />

        <TarjetaKpiAdmin
          titulo="Stock Bajo / Alertas"
          valor={productosStockBajo.length}
          icono={<AlertTriangle size={22} />}
          color={productosStockBajo.length > 0 ? "red" : "green"}
          subtexto={productosStockBajo.length > 0 ? "Requiere reabastecimiento" : "Inventario óptimo"}
        />

        <TarjetaKpiAdmin
          titulo="Ofertas Activas"
          valor={totalOfertas}
          icono={<TrendingUp size={22} />}
          color="gold"
          subtexto="Productos en promoción"
        />

        <TarjetaKpiAdmin
          titulo="Valor Inventario"
          valor={formatearPrecio(valorInventario)}
          icono={<Boxes size={22} />}
          color="green"
          subtexto="Total estimado en stock"
        />
      </div>

      {/* Barra de Acciones Rápidas */}
      <div className="admin-acciones-rapidas-card">
        <h3>Acciones Rápidas</h3>
        <div className="admin-botones-rapidos-row">
          <button
            type="button"
            className="btn-accion-rapida primario"
            onClick={() => setModalNuevoProducto(true)}
          >
            <Plus size={16} />
            <span>Agregar Producto</span>
          </button>

          <button
            type="button"
            className="btn-accion-rapida"
            onClick={() => onCambiarSeccion('inventario')}
          >
            <Boxes size={16} />
            <span>Ajustar Inventario</span>
          </button>

          <button
            type="button"
            className="btn-accion-rapida"
            onClick={() => onCambiarSeccion('ofertas')}
          >
            <TrendingUp size={16} />
            <span>Gestionar Ofertas</span>
          </button>

          <button
            type="button"
            className="btn-accion-rapida"
            onClick={() => onCambiarSeccion('solicitudes')}
          >
            <MessageSquareQuote size={16} />
            <span>Ver Cotizaciones</span>
          </button>
        </div>
      </div>

      {/* Grid de 2 Columnas: Stock Crítico + Solicitudes Recientes */}
      <div className="admin-dashboard-grid-2">
        {/* Tabla Stock Crítico */}
        <div className="admin-tabla-panel">
          <div className="admin-tabla-top-bar">
            <div>
              <h3 style={{ fontSize: '0.95rem', color: '#ffffff' }}>Productos con Stock Crítico</h3>
              <span style={{ fontSize: '0.75rem', color: '#8497b0' }}>Existencias menores o iguales al mínimo</span>
            </div>
            <button
              type="button"
              className="enlace-ver-todas"
              onClick={() => onCambiarSeccion('inventario')}
            >
              Inventario <ArrowRight size={13} />
            </button>
          </div>

          <div className="admin-tabla-contenedor">
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock Actual</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {productosStockBajo.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#10b981' }}>
                      <CheckCircle size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                      Todos los productos tienen niveles de stock saludables.
                    </td>
                  </tr>
                ) : (
                  productosStockBajo.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong style={{ color: '#ffffff' }}>{p.nombre}</strong>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{p.categoriaNombre}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 800, color: p.stock === 0 ? '#ef4444' : '#fbbf24' }}>
                          {p.stock} unid.
                        </span>
                      </td>
                      <td>
                        <span className={`stock-pill ${p.stock === 0 ? 'agotado' : 'bajo'}`}>
                          {p.stock === 0 ? 'Agotado' : 'Stock Bajo'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-accion-tabla"
                          title="Reabastecer +5 unidades"
                          onClick={() => actualizarStock(p.id, (p.stock || 0) + 5)}
                        >
                          +5
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla Solicitudes / Cotizaciones Recientes */}
        <div className="admin-tabla-panel">
          <div className="admin-tabla-top-bar">
            <div>
              <h3 style={{ fontSize: '0.95rem', color: '#ffffff' }}>Solicitudes de Cotización</h3>
              <span style={{ fontSize: '0.75rem', color: '#8497b0' }}>Pedidos y consultas generadas por clientes</span>
            </div>
            <button
              type="button"
              className="enlace-ver-todas"
              onClick={() => onCambiarSeccion('solicitudes')}
            >
              Ver todas <ArrowRight size={13} />
            </button>
          </div>

          <div className="admin-tabla-contenedor">
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Monto Total</th>
                  <th>Estado</th>
                  <th>Ver</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No hay solicitudes formales registradas aún.
                    </td>
                  </tr>
                ) : (
                  solicitudes.slice(0, 5).map((sol) => (
                    <tr key={sol.id}>
                      <td>
                        <strong style={{ color: '#ffffff' }}>{sol.cliente?.nombre || 'Cliente WhatsApp'}</strong>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{sol.cliente?.telefono || 'Contacto directo'}</div>
                      </td>
                      <td>
                        <strong style={{ color: '#00d2ff' }}>{formatearPrecio(sol.total)}</strong>
                      </td>
                      <td>
                        <span className={`stock-pill ${sol.estado === 'Cerrado' ? 'disponible' : 'bajo'}`}>
                          {sol.estado || 'Pendiente'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-accion-tabla"
                          onClick={() => setSolicitudSeleccionada(sol)}
                          title="Ver detalle"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Nuevo Producto */}
      {modalNuevoProducto && (
        <ModalFormularioProducto
          productoAEditar={null}
          alCerrar={() => setModalNuevoProducto(false)}
          alGuardar={guardarNuevoProducto}
        />
      )}

      {/* Modal Detalle Solicitud */}
      {solicitudSeleccionada && (
        <ModalDetalleSolicitud
          solicitud={solicitudSeleccionada}
          alCerrar={() => setSolicitudSeleccionada(null)}
          onCambiarEstado={cambiarEstadoSolicitud}
        />
      )}

      <style>{`
        .admin-inicio-vista {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .admin-acciones-rapidas-card {
          background: #091021;
          border: 1px solid #162645;
          border-radius: var(--radio-lg);
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .admin-acciones-rapidas-card h3 {
          font-size: 0.95rem;
          color: #ffffff;
          font-weight: 700;
        }

        .admin-botones-rapidos-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .btn-accion-rapida {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #060b17;
          border: 1px solid #1c2e4f;
          color: #cbd5e1;
          padding: 0.55rem 1rem;
          border-radius: var(--radio-md);
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-accion-rapida:hover {
          color: #00d2ff;
          border-color: #00b4d8;
          background: rgba(0, 180, 216, 0.1);
        }

        .btn-accion-rapida.primario {
          background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%);
          color: #ffffff;
          border-color: rgba(0, 210, 255, 0.4);
          box-shadow: 0 0 12px rgba(0, 180, 216, 0.35);
        }

        .btn-accion-rapida.primario:hover {
          background: linear-gradient(135deg, #00d2ff 0%, #0096c7 100%);
          box-shadow: 0 0 20px rgba(0, 210, 255, 0.6);
        }

        .admin-dashboard-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 1024px) {
          .admin-dashboard-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default PaginaAdminInicio;
