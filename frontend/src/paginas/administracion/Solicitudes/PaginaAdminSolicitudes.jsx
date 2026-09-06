import React, { useState, useEffect } from 'react';
import {
  MessageSquareQuote,
  Eye,
  MessageSquare,
  Search,
  CheckCircle,
  Clock,
  User,
  Phone
} from 'lucide-react';
import { servicioSolicitudes } from '../../../servicios/servicioSolicitudes';
import { formatearPrecio } from '../../../utilidades/formatearPrecio';
import { ModalDetalleSolicitud } from '../../../componentes/Administracion/ModalDetalleSolicitud';

export function PaginaAdminSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  const cargarSolicitudes = () => {
    servicioSolicitudes.obtenerSolicitudes().then(data => {
      setSolicitudes(data);
    });
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const solicitudesFiltradas = solicitudes.filter(sol => {
    const coincideTexto =
      !busqueda ||
      (sol.cliente?.nombre && sol.cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
      (sol.cliente?.email && sol.cliente.email.toLowerCase().includes(busqueda.toLowerCase())) ||
      (sol.id && sol.id.toLowerCase().includes(busqueda.toLowerCase()));

    const coincideEstado = filtroEstado === 'todos' || sol.estado === filtroEstado;

    return coincideTexto && coincideEstado;
  });

  const cambiarEstado = (id, nuevoEstado) => {
    const actualizadas = solicitudes.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s);
    setSolicitudes(actualizadas);
    localStorage.setItem('nas_solicitudes', JSON.stringify(actualizadas));
    setSolicitudSeleccionada(null);
  };

  const abrirChatCliente = (sol) => {
    const telefonoLimpio = (sol.cliente?.telefono || '').replace(/[^\d]/g, '');
    if (telefonoLimpio) {
      const msg = encodeURIComponent(`Hola ${sol.cliente?.nombre || ''}, te contactamos de *NAS Computer* sobre tu cotización ${sol.id}.`);
      window.open(`https://wa.me/${telefonoLimpio}?text=${msg}`, '_blank');
    }
  };

  return (
    <div className="admin-solicitudes-vista">
      <div className="admin-seccion-header-row">
        <div>
          <h2>Bandeja de Cotizaciones y Solicitudes</h2>
          <p>Gestiona los requerimientos enviados por clientes desde el cotizador web y WhatsApp.</p>
        </div>
      </div>

      <div className="admin-tabla-panel">
        <div className="admin-tabla-top-bar">
          <div className="admin-tabla-busqueda">
            <Search size={16} className="admin-tabla-icono-lupa" />
            <input
              type="text"
              placeholder="Buscar por cliente, ID o correo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="admin-tabla-input"
            />
          </div>

          <div className="admin-tabla-filtros">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="admin-tabla-select"
            >
              <option value="todos">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Contactado">Contactado</option>
              <option value="Cerrado">Cerrado / Vendido</option>
            </select>
          </div>
        </div>

        <div className="admin-tabla-contenedor">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>ID Solicitud</th>
                <th>Cliente</th>
                <th>Teléfono / WhatsApp</th>
                <th>Ítems Cotizados</th>
                <th>Monto Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                    <MessageSquareQuote size={36} style={{ display: 'block', margin: '0 auto 0.5rem auto', color: '#00b4d8' }} />
                    No hay solicitudes registradas con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                solicitudesFiltradas.map((sol) => (
                  <tr key={sol.id}>
                    <td>
                      <code style={{ color: '#00d2ff', fontWeight: 700 }}>{sol.id}</code>
                    </td>

                    <td>
                      <strong style={{ color: '#ffffff' }}>{sol.cliente?.nombre || 'Cliente WhatsApp'}</strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{sol.cliente?.email || 'Sin correo'}</div>
                    </td>

                    <td>
                      <span style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>
                        {sol.cliente?.telefono || 'No registrado'}
                      </span>
                    </td>

                    <td>
                      <span style={{ color: '#94a3b8' }}>
                        {sol.items?.length || 0} {(sol.items?.length || 0) === 1 ? 'producto' : 'productos'}
                      </span>
                    </td>

                    <td>
                      <strong style={{ color: '#00d2ff', fontSize: '0.95rem' }}>
                        {formatearPrecio(sol.total)}
                      </strong>
                    </td>

                    <td>
                      <span className={`stock-pill ${sol.estado === 'Cerrado' ? 'disponible' : sol.estado === 'Contactado' ? 'bajo' : 'agotado'}`}>
                        {sol.estado || 'Pendiente'}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {new Date(sol.fecha).toLocaleDateString()}
                      </span>
                    </td>

                    <td>
                      <div className="admin-acciones-celda" style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn-accion-tabla"
                          onClick={() => setSolicitudSeleccionada(sol)}
                          title="Ver detalle completo"
                        >
                          <Eye size={15} />
                        </button>

                        {sol.cliente?.telefono && (
                          <button
                            type="button"
                            className="btn-accion-tabla wa"
                            onClick={() => abrirChatCliente(sol)}
                            title="Contactar al cliente por WhatsApp"
                          >
                            <MessageSquare size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {solicitudSeleccionada && (
        <ModalDetalleSolicitud
          solicitud={solicitudSeleccionada}
          alCerrar={() => setSolicitudSeleccionada(null)}
          onCambiarEstado={cambiarEstado}
        />
      )}

      <style>{`
        .admin-solicitudes-vista {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
      `}</style>
    </div>
  );
}

export default PaginaAdminSolicitudes;
