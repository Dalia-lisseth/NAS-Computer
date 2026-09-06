import React, { useMemo, useState } from 'react';
import { CalendarClock, CircleDollarSign, Flame, PencilLine, Plus, Search, Tag, X } from 'lucide-react';
import { useProductosContext } from '../../../contextos/ContextoProductos';
import { formatearPrecio } from '../../../utilidades/formatearPrecio';

const DIAS_ALERTA_FINALIZACION = 7;

export function PaginaAdminOfertas() {
  const { productos, alternarEstadoOferta, actualizarProducto } = useProductosContext();
  const [busqueda, setBusqueda] = useState('');
  const [mostrarCatalogo, setMostrarCatalogo] = useState(false);
  const [productoEnEdicion, setProductoEnEdicion] = useState(null);
  const [precioOferta, setPrecioOferta] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [errorFormulario, setErrorFormulario] = useState('');

  const productosEnOferta = useMemo(
    () => productos.filter((producto) => producto.badge === 'SALE' || Boolean(producto.precioAnterior)),
    [productos]
  );

  const productosDisponibles = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return productos.filter((producto) => {
      const esOferta = producto.badge === 'SALE' || Boolean(producto.precioAnterior);
      return !esOferta && (!termino || producto.nombre.toLowerCase().includes(termino));
    });
  }, [busqueda, productos]);

  const ahorroTotal = productosEnOferta.reduce(
    (total, producto) => total + Math.max(0, (producto.precioAnterior || producto.precio) - producto.precio),
    0
  );

  const proximasAFinalizar = productosEnOferta.filter((producto) => {
    if (!producto.fechaFinOferta) return false;
    const diferencia = Math.ceil((new Date(`${producto.fechaFinOferta}T23:59:59`) - new Date()) / 86400000);
    return diferencia >= 0 && diferencia <= DIAS_ALERTA_FINALIZACION;
  }).length;

  const abrirEditor = (producto) => {
    const precioBase = producto.precioAnterior || producto.precio;
    setProductoEnEdicion(producto);
    setPrecioOferta(String(producto.precioAnterior ? producto.precio : Math.round(precioBase * 0.85)));
    setFechaFin(producto.fechaFinOferta || '');
    setErrorFormulario('');
  };

  const guardarOferta = () => {
    if (!productoEnEdicion) return;
    const precioBase = productoEnEdicion.precioAnterior || productoEnEdicion.precio;
    const precioNuevo = Number(precioOferta);
    if (!Number.isFinite(precioNuevo) || precioNuevo <= 0) {
      setErrorFormulario('Ingresa un precio de oferta válido.');
      return;
    }
    if (precioNuevo >= precioBase) {
      setErrorFormulario('El precio de oferta debe ser menor al precio regular.');
      return;
    }
    actualizarProducto(productoEnEdicion.id, {
      precioAnterior: precioBase,
      precio: precioNuevo,
      badge: 'SALE',
      tipoSeccion: productoEnEdicion.tipoSeccion === 'general' ? 'ofertas' : productoEnEdicion.tipoSeccion,
      fechaFinOferta: fechaFin || null
    });
    setProductoEnEdicion(null);
  };

  const quitarOferta = (producto) => {
    alternarEstadoOferta(producto.id, false);
    actualizarProducto(producto.id, {
      fechaFinOferta: null,
      badge: null,
      precioAnterior: null,
      precio: producto.precioAnterior || producto.precio,
      tipoSeccion: producto.tipoSeccion === 'ofertas' ? 'general' : producto.tipoSeccion
    });
  };

  const obtenerAhorro = (producto) => Math.max(0, (producto.precioAnterior || producto.precio) - producto.precio);
  const formatoFecha = (fecha) => fecha
    ? new Intl.DateTimeFormat('es-EC', { day: 'numeric', month: 'short' }).format(new Date(`${fecha}T12:00:00`))
    : 'Sin fecha de cierre';

  return (
    <div className="admin-ofertas-vista">
      <header className="ofertas-encabezado">
        <div>
          <p className="ofertas-eyebrow"><Flame size={15} /> Promociones</p>
          <h2>Ofertas y Promociones</h2>
          <p>Gestiona descuentos visibles para los clientes de NAS Computer.</p>
        </div>
        <button type="button" className="ofertas-btn-principal" onClick={() => setMostrarCatalogo(true)}><Plus size={16} /> Crear oferta</button>
      </header>

      <section className="ofertas-resumen" aria-label="Resumen de promociones">
        <div className="ofertas-kpi"><span className="ofertas-kpi-icono llama"><Flame size={18} /></span><div><strong>{productosEnOferta.length}</strong><span>Activas</span></div></div>
        <div className="ofertas-kpi"><span className="ofertas-kpi-icono ahorro"><CircleDollarSign size={18} /></span><div><strong>{formatearPrecio(ahorroTotal)}</strong><span>Ahorro por unidad</span></div></div>
        <div className="ofertas-kpi"><span className="ofertas-kpi-icono fecha"><CalendarClock size={18} /></span><div><strong>{proximasAFinalizar}</strong><span>Por finalizar</span></div></div>
      </section>

      <section className="ofertas-seccion">
        <div className="ofertas-seccion-cabecera">
          <h3><Flame size={16} /> Ofertas activas</h3>
          <button type="button" className="ofertas-enlace" onClick={() => setMostrarCatalogo(true)}>Ver todas <span>→</span></button>
        </div>

        {productosEnOferta.length ? (
          <div className="ofertas-tarjetas-grid">
            {productosEnOferta.map((producto) => {
              const ahorro = obtenerAhorro(producto);
              const porcentaje = producto.precioAnterior ? Math.round((ahorro / producto.precioAnterior) * 100) : 0;
              return (
                <article key={producto.id} className="oferta-tarjeta">
                  <img src={producto.imagen} alt={producto.nombre} className="oferta-tarjeta-imagen" />
                  <div className="oferta-tarjeta-contenido">
                    <div><span className="oferta-categoria">{producto.categoriaNombre || 'Tecnología'}</span><h4>{producto.nombre}</h4></div>
                    <div className="oferta-precios"><span>{formatearPrecio(producto.precioAnterior || producto.precio)}</span><b>→</b><strong>{formatearPrecio(producto.precio)}</strong></div>
                    <p className="oferta-ahorro">Ahorras {formatearPrecio(ahorro)} {porcentaje ? `(${porcentaje}%)` : ''}</p>
                    <div className="oferta-estado"><i /> Oferta activa <span>{formatoFecha(producto.fechaFinOferta)}</span></div>
                    <div className="oferta-acciones">
                      <button type="button" onClick={() => abrirEditor(producto)}><PencilLine size={14} /> Editar</button>
                      <button type="button" className="desactivar" onClick={() => quitarOferta(producto)}><X size={14} /> Desactivar</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : <div className="ofertas-vacias"><Tag size={22} /><p>Aún no hay ofertas activas.</p><button type="button" onClick={() => setMostrarCatalogo(true)}>Crear la primera oferta</button></div>}
      </section>

      {mostrarCatalogo && (
        <section className="ofertas-catalogo">
          <div className="ofertas-seccion-cabecera"><div><h3>Productos disponibles para oferta</h3><p>Elige un producto y configura su precio promocional.</p></div><button type="button" className="ofertas-enlace" onClick={() => setMostrarCatalogo(false)}>Ocultar</button></div>
          <div className="ofertas-buscador"><Search size={16} /><input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar producto..." /></div>
          <div className="ofertas-lista-productos">
            {productosDisponibles.map((producto) => <div key={producto.id} className="ofertas-producto-fila"><img src={producto.imagen} alt={producto.nombre} /><div><strong>{producto.nombre}</strong><span>{producto.categoriaNombre} · {formatearPrecio(producto.precio)}</span></div><button type="button" onClick={() => abrirEditor(producto)}><Plus size={14} /> Crear oferta</button></div>)}
            {!productosDisponibles.length && <p className="ofertas-sin-resultados">No hay productos disponibles con esa búsqueda.</p>}
          </div>
        </section>
      )}

      {productoEnEdicion && (
        <div className="ofertas-modal-fondo" onClick={() => setProductoEnEdicion(null)}>
          <div className="ofertas-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="ofertas-modal-cerrar" onClick={() => setProductoEnEdicion(null)} aria-label="Cerrar"><X size={18} /></button>
            <p className="ofertas-eyebrow"><Tag size={15} /> {productoEnEdicion.precioAnterior ? 'Editar oferta' : 'Nueva oferta'}</p>
            <h3>{productoEnEdicion.nombre}</h3>
            <p className="ofertas-modal-precio">Precio regular: <strong>{formatearPrecio(productoEnEdicion.precioAnterior || productoEnEdicion.precio)}</strong></p>
            <label>Precio promocional<input type="number" min="0.01" step="0.01" value={precioOferta} onChange={(event) => setPrecioOferta(event.target.value)} /></label>
            <label>Finaliza el <small>(opcional)</small><input type="date" value={fechaFin} onChange={(event) => setFechaFin(event.target.value)} /></label>
            {errorFormulario && <p className="ofertas-error">{errorFormulario}</p>}
            <div className="ofertas-modal-acciones"><button type="button" onClick={() => setProductoEnEdicion(null)}>Cancelar</button><button type="button" className="ofertas-btn-principal" onClick={guardarOferta}>Guardar oferta</button></div>
          </div>
        </div>
      )}

      <style>{`
        .admin-ofertas-vista{display:flex;flex-direction:column;gap:1.5rem}.ofertas-encabezado,.ofertas-seccion-cabecera{display:flex;align-items:center;justify-content:space-between;gap:1rem}.ofertas-encabezado h2,.ofertas-seccion-cabecera h3,.ofertas-modal h3{margin:0;color:#f8fafc}.ofertas-encabezado h2{font-size:clamp(1.6rem,2vw,2.2rem)}.ofertas-encabezado>div>p:not(.ofertas-eyebrow),.ofertas-seccion-cabecera p{margin:.35rem 0 0;color:#94a3b8}.ofertas-eyebrow{margin:0 0 .35rem;display:inline-flex;align-items:center;gap:.35rem;color:#fbbf24;font-size:.75rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.ofertas-btn-principal,.ofertas-lista-productos button{display:inline-flex;align-items:center;justify-content:center;gap:.45rem;border:1px solid rgba(34,211,238,.5);border-radius:10px;background:linear-gradient(135deg,#0891b2,#0369a1);color:#f8fafc;padding:.7rem 1rem;cursor:pointer;font-weight:700}.ofertas-resumen{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.85rem;max-width:690px}.ofertas-kpi{display:flex;align-items:center;gap:.7rem;padding:.9rem 1rem;background:#091021;border:1px solid #1c3057;border-radius:13px}.ofertas-kpi-icono{display:grid;place-items:center;width:32px;height:32px;border-radius:9px}.ofertas-kpi-icono.llama{color:#fb923c;background:rgba(249,115,22,.13)}.ofertas-kpi-icono.ahorro{color:#fbbf24;background:rgba(245,158,11,.13)}.ofertas-kpi-icono.fecha{color:#67e8f9;background:rgba(34,211,238,.13)}.ofertas-kpi div{display:flex;flex-direction:column}.ofertas-kpi strong{color:#f8fafc;font-size:1.05rem}.ofertas-kpi span:not(.ofertas-kpi-icono){color:#94a3b8;font-size:.73rem}.ofertas-seccion,.ofertas-catalogo{background:rgba(9,16,33,.78);border:1px solid #162645;border-radius:17px;padding:1.15rem}.ofertas-seccion-cabecera h3{display:flex;align-items:center;gap:.45rem;font-size:1rem}.ofertas-seccion-cabecera h3 svg{color:#fb923c}.ofertas-enlace{background:none;border:none;color:#a5f3fc;cursor:pointer;font-weight:700}.ofertas-enlace span{margin-left:.25rem}.ofertas-tarjetas-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(295px,1fr));gap:1rem;margin-top:1rem}.oferta-tarjeta{display:flex;gap:.85rem;padding:.8rem;background:#08101f;border:1px solid rgba(148,163,184,.18);border-radius:14px}.oferta-tarjeta-imagen{width:92px;height:112px;border-radius:10px;object-fit:cover;background:#020617}.oferta-tarjeta-contenido{display:flex;flex:1;min-width:0;flex-direction:column;gap:.38rem}.oferta-tarjeta h4{margin:.1rem 0;color:#f8fafc;font-size:.92rem}.oferta-categoria{color:#64748b;font-size:.7rem}.oferta-precios{display:flex;align-items:baseline;gap:.35rem;font-size:.78rem;color:#94a3b8}.oferta-precios>span{text-decoration:line-through}.oferta-precios b{color:#64748b}.oferta-precios strong{color:#22d3ee;font-size:.95rem}.oferta-ahorro{margin:0;color:#fbbf24;font-size:.75rem;font-weight:700}.oferta-estado{display:flex;align-items:center;gap:.35rem;color:#86efac;font-size:.73rem}.oferta-estado i{width:8px;height:8px;border-radius:50%;background:#4ade80}.oferta-estado span{color:#64748b;margin-left:auto}.oferta-acciones{display:flex;gap:.5rem;margin-top:auto}.oferta-acciones button{display:inline-flex;align-items:center;gap:.3rem;padding:.38rem .55rem;border:1px solid #1c3057;border-radius:7px;background:#0d1729;color:#dbeafe;cursor:pointer;font-size:.72rem}.oferta-acciones button.desactivar{color:#fca5a5;border-color:rgba(239,68,68,.28)}.ofertas-vacias{display:flex;flex-direction:column;align-items:center;gap:.5rem;padding:2rem;margin-top:1rem;border:1px dashed #294262;border-radius:12px;color:#94a3b8}.ofertas-vacias svg{color:#fbbf24}.ofertas-vacias p{margin:0}.ofertas-vacias button{border:none;background:none;color:#67e8f9;cursor:pointer;font-weight:700}.ofertas-catalogo{display:flex;flex-direction:column;gap:1rem}.ofertas-buscador{display:flex;align-items:center;gap:.55rem;padding:.55rem .75rem;border:1px solid #1c3057;border-radius:10px;background:#08101f;color:#64748b}.ofertas-buscador input{flex:1;border:none;outline:none;background:transparent;color:#f8fafc}.ofertas-lista-productos{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:.7rem}.ofertas-producto-fila{display:flex;align-items:center;gap:.65rem;padding:.65rem;border:1px solid rgba(148,163,184,.16);border-radius:11px;background:#08101f}.ofertas-producto-fila img{width:42px;height:42px;object-fit:cover;border-radius:7px}.ofertas-producto-fila>div{flex:1;min-width:0;display:flex;flex-direction:column}.ofertas-producto-fila strong{color:#e2e8f0;font-size:.8rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ofertas-producto-fila span{color:#64748b;font-size:.7rem}.ofertas-lista-productos button{padding:.45rem .6rem;font-size:.7rem}.ofertas-sin-resultados{color:#94a3b8}.ofertas-modal-fondo{position:fixed;inset:0;z-index:1500;display:grid;place-items:center;padding:1rem;background:rgba(2,6,23,.75);backdrop-filter:blur(3px)}.ofertas-modal{position:relative;width:min(420px,100%);padding:1.5rem;border:1px solid #1c3057;border-radius:16px;background:#091021;box-shadow:0 22px 55px rgba(0,0,0,.55)}.ofertas-modal-precio{margin:.75rem 0;color:#94a3b8}.ofertas-modal-precio strong{color:#f8fafc}.ofertas-modal label{display:flex;flex-direction:column;gap:.4rem;margin-top:.9rem;color:#cbd5e1;font-size:.8rem;font-weight:600}.ofertas-modal label small{color:#64748b;font-weight:400}.ofertas-modal input{padding:.7rem .8rem;border:1px solid #1c3057;border-radius:9px;background:#08101f;color:#f8fafc}.ofertas-modal-cerrar{position:absolute;top:.8rem;right:.8rem;border:none;background:transparent;color:#94a3b8;cursor:pointer}.ofertas-error{color:#fca5a5;font-size:.8rem}.ofertas-modal-acciones{display:flex;justify-content:flex-end;gap:.65rem;margin-top:1.25rem}.ofertas-modal-acciones>button:first-child{border:1px solid #1c3057;border-radius:10px;background:transparent;color:#cbd5e1;padding:.7rem 1rem;cursor:pointer}@media(max-width:720px){.ofertas-encabezado,.ofertas-seccion-cabecera{align-items:flex-start;flex-direction:column}.ofertas-resumen{grid-template-columns:1fr}.ofertas-encabezado .ofertas-btn-principal{width:100%}.ofertas-tarjetas-grid{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}

export default PaginaAdminOfertas;
