import React, { useEffect, useState } from 'react';
import { ClipboardList, FileText, LogIn, PackageOpen, RefreshCw } from 'lucide-react';
import { useAutenticacionContext } from '../../../contextos/ContextoAutenticacion';
import { servicioSolicitudes } from '../../../servicios/servicioSolicitudes';
import { formatearPrecio } from '../../../utilidades/formatearPrecio';

const formatearFecha = (fecha) => new Intl.DateTimeFormat('es-EC', {
  dateStyle: 'medium',
  timeStyle: 'short'
}).format(new Date(fecha));

export function PaginaMisSolicitudes({ onNavegar }) {
  const { usuario, estaAutenticado, abrirModalAuth } = useAutenticacionContext();
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [solicitudAbierta, setSolicitudAbierta] = useState(null);

  const cargarSolicitudes = async () => {
    if (!usuario) return;
    setCargando(true);
    try {
      const datos = await servicioSolicitudes.obtenerPorUsuario(usuario);
      setSolicitudes(datos);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, [usuario?.id]);

  if (!estaAutenticado) {
    return (
      <main className="pagina-solicitudes-nas">
        <section className="contenedor-principal solicitudes-vacio">
          <LogIn size={42} />
          <h1>Inicia sesión para ver tus solicitudes</h1>
          <p>Tu historial de cotizaciones está disponible sólo para la cuenta que las creó.</p>
          <button type="button" onClick={() => abrirModalAuth('login')}>Iniciar sesión</button>
        </section>
      </main>
    );
  }

  return (
    <main className="pagina-solicitudes-nas">
      <div className="contenedor-principal">
        <header className="solicitudes-cabecera">
          <div>
            <p className="solicitudes-eyebrow"><ClipboardList size={15} /> Cuenta</p>
            <h1>Mis solicitudes</h1>
            <p>Consulta el estado y detalle de las cotizaciones enviadas desde esta cuenta.</p>
          </div>
          <button type="button" className="solicitudes-actualizar" onClick={cargarSolicitudes} disabled={cargando}>
            <RefreshCw size={16} className={cargando ? 'solicitudes-girando' : ''} /> Actualizar
          </button>
        </header>

        {!cargando && !solicitudes.length ? (
          <section className="solicitudes-vacio">
            <PackageOpen size={42} />
            <h2>Aún no has enviado solicitudes</h2>
            <p>Agrega equipos a tu selección y solicita una cotización para verla aquí.</p>
            <button type="button" onClick={() => onNavegar?.('catalogo')}>Ver catálogo</button>
          </section>
        ) : (
          <section className="solicitudes-lista" aria-live="polite">
            {solicitudes.map((solicitud) => (
              <article key={solicitud.id} className="solicitud-tarjeta">
                <div className="solicitud-icono"><FileText size={20} /></div>
                <div className="solicitud-info">
                  <div className="solicitud-fila-principal"><h2>{solicitud.id}</h2><span className="solicitud-estado">{solicitud.estado || 'Pendiente'}</span></div>
                  <p>Enviada el {formatearFecha(solicitud.fecha)}</p>
                  <span>{solicitud.items?.length || 0} producto(s) · Total estimado: <strong>{formatearPrecio(solicitud.total || 0)}</strong></span>
                </div>
                <button type="button" onClick={() => setSolicitudAbierta(solicitud)}>Ver detalle</button>
              </article>
            ))}
          </section>
        )}

        {solicitudAbierta && (
          <div className="solicitudes-modal-fondo" onClick={() => setSolicitudAbierta(null)}>
            <section className="solicitudes-modal" onClick={(event) => event.stopPropagation()} aria-modal="true" role="dialog">
              <button type="button" className="solicitudes-modal-cerrar" onClick={() => setSolicitudAbierta(null)} aria-label="Cerrar detalle">×</button>
              <p className="solicitudes-eyebrow">Cotización</p>
              <h2>{solicitudAbierta.id}</h2>
              <p className="solicitudes-modal-fecha">{formatearFecha(solicitudAbierta.fecha)} · {solicitudAbierta.estado || 'Pendiente'}</p>
              <div className="solicitudes-items">
                {(solicitudAbierta.items || []).map((item) => <div key={item.id} className="solicitudes-item"><span>{item.nombre} × {item.cantidad || 1}</span><strong>{formatearPrecio((item.precio || 0) * (item.cantidad || 1))}</strong></div>)}
              </div>
              <div className="solicitudes-total"><span>Total estimado</span><strong>{formatearPrecio(solicitudAbierta.total || 0)}</strong></div>
            </section>
          </div>
        )}
      </div>

      <style>{`
        .pagina-solicitudes-nas{padding:2rem 0 3.5rem}.solicitudes-cabecera{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:1.5rem}.solicitudes-eyebrow{display:flex;align-items:center;gap:.35rem;margin:0 0 .4rem;color:#67e8f9;font-size:.75rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.solicitudes-cabecera h1,.solicitudes-vacio h1,.solicitudes-vacio h2,.solicitud-fila-principal h2,.solicitudes-modal h2{margin:0;color:#f8fafc}.solicitudes-cabecera>div>p:not(.solicitudes-eyebrow),.solicitud-info p{color:#94a3b8}.solicitudes-actualizar,.solicitudes-vacio button,.solicitud-tarjeta>button{border:1px solid rgba(34,211,238,.45);border-radius:10px;background:#0b2438;color:#cffafe;padding:.65rem .9rem;font-weight:700;cursor:pointer}.solicitudes-actualizar{display:inline-flex;align-items:center;gap:.45rem}.solicitudes-actualizar:disabled{opacity:.65;cursor:wait}.solicitudes-girando{animation:solicitudes-girar 1s linear infinite}.solicitudes-lista{display:flex;flex-direction:column;gap:.8rem}.solicitud-tarjeta{display:flex;align-items:center;gap:1rem;padding:1rem 1.15rem;border:1px solid #1c3057;border-radius:14px;background:#091021}.solicitud-icono{display:grid;place-items:center;width:42px;height:42px;border-radius:11px;background:rgba(34,211,238,.12);color:#67e8f9}.solicitud-info{flex:1;min-width:0}.solicitud-fila-principal{display:flex;align-items:center;gap:.65rem}.solicitud-fila-principal h2{font-size:1rem}.solicitud-estado{border-radius:999px;background:rgba(251,191,36,.13);color:#fde68a;padding:.2rem .5rem;font-size:.7rem;font-weight:700}.solicitud-info p,.solicitud-info>span{display:block;margin:.3rem 0 0;font-size:.8rem}.solicitud-info>span{color:#cbd5e1}.solicitudes-vacio{display:flex;flex-direction:column;align-items:center;gap:.7rem;margin-top:1rem;padding:3rem 1.5rem;border:1px dashed #294262;border-radius:16px;background:#091021;text-align:center;color:#94a3b8}.solicitudes-vacio svg{color:#67e8f9}.solicitudes-vacio p{max-width:470px;margin:0}.solicitudes-modal-fondo{position:fixed;inset:0;z-index:2100;display:grid;place-items:center;padding:1rem;background:rgba(2,6,23,.76);backdrop-filter:blur(3px)}.solicitudes-modal{position:relative;width:min(560px,100%);padding:1.5rem;border:1px solid #1c3057;border-radius:16px;background:#091021}.solicitudes-modal-cerrar{position:absolute;top:.7rem;right:.8rem;border:none;background:transparent;color:#cbd5e1;font-size:1.7rem;cursor:pointer}.solicitudes-modal-fecha{margin:.35rem 0 1.2rem;color:#94a3b8;font-size:.8rem}.solicitudes-items{display:flex;flex-direction:column;gap:.5rem}.solicitudes-item,.solicitudes-total{display:flex;justify-content:space-between;gap:1rem;padding:.7rem .8rem;border-radius:8px;background:#08101f;color:#cbd5e1;font-size:.85rem}.solicitudes-total{margin-top:1rem;border-top:1px solid #1c3057;background:#0b172a;color:#f8fafc}.solicitudes-total strong{color:#67e8f9;font-size:1rem}@keyframes solicitudes-girar{to{transform:rotate(360deg)}}@media(max-width:640px){.solicitudes-cabecera,.solicitud-tarjeta{align-items:stretch;flex-direction:column}.solicitudes-cabecera .solicitudes-actualizar,.solicitud-tarjeta>button{width:100%;justify-content:center}}
      `}</style>
    </main>
  );
}

export default PaginaMisSolicitudes;
