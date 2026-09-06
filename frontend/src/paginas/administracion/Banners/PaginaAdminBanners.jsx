import React, { useMemo, useState, useEffect } from 'react';
import { Plus, PencilLine, Trash2, ArrowUpDown, Eye, CheckCircle2, XCircle, UploadCloud } from 'lucide-react';
import { useProductosContext } from '../../../contextos/ContextoProductos';

const DIMENSIONES_RECOMENDADAS = {
  ancho: 1440,
  alto: 520,
  ratio: '2.77:1'
};

export function PaginaAdminBanners() {
  const { banners, agregarBanner, actualizarBanner, eliminarBanner, reordenarBanners } = useProductosContext();
  const [formulario, setFormulario] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [metaImagen, setMetaImagen] = useState(null);

  const bannersOrdenados = useMemo(
    () => Array.isArray(banners) ? banners.filter((b) => b && b.id) : [],
    [banners]
  );

  useEffect(() => {
    if (!formulario?.imagen) {
      setMetaImagen(null);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setMetaImagen({
        ancho: img.width,
        alto: img.height,
        compatible: img.width === DIMENSIONES_RECOMENDADAS.ancho && img.height === DIMENSIONES_RECOMENDADAS.alto
      });
    };
    img.onerror = () => setMetaImagen(null);
    img.src = formulario.imagen;
  }, [formulario?.imagen]);

  const abrirFormulario = (banner = null) => {
    setFormulario({
      id: banner?.id || '',
      activo: banner?.activo !== false,
      imagen: banner?.imagen || '',
      titulo: banner?.titulo || '',
      tituloResaltado: banner?.tituloResaltado || '',
      subtitulo: banner?.subtitulo || '',
      enlace: banner?.enlace || '/catalogo',
      botonTexto: banner?.botonTexto || 'Ver ahora',
      beneficios: Array.isArray(banner?.beneficios) && banner.beneficios.length
        ? banner.beneficios.map((item) => ({
            icono: item.icono || 'Truck',
            texto: item.texto || ''
          }))
        : [
            { icono: 'Truck', texto: 'Envíos rápidos' },
            { icono: 'ShieldCheck', texto: 'Garantía NAS' },
            { icono: 'Headphones', texto: 'Soporte técnico' }
          ]
    });
  };

  const guardarBanner = () => {
    if (!formulario) return;
    const payload = {
      ...formulario,
      beneficios: formulario.beneficios
        .filter((item) => item && item.texto)
        .map((item) => ({
          icono: item.icono || 'Truck',
          texto: item.texto
        }))
    };

    if (formulario.id) {
      actualizarBanner(formulario.id, payload);
      setMensaje('Banner actualizado correctamente.');
    } else {
      agregarBanner(payload);
      setMensaje('Nuevo banner agregado.');
    }
    setFormulario(null);
    setMetaImagen(null);
  };

  const moverBanner = (index, direccion) => {
    const destino = index + direccion;
    if (destino < 0 || destino >= bannersOrdenados.length) return;
    reordenarBanners(index, destino);
  };

  const eliminar = (id) => {
    if (window.confirm('¿Deseas eliminar este banner?')) {
      eliminarBanner(id);
    }
  };

  const cambiarTextoBeneficio = (indice, valor) => {
    setFormulario((prev) => ({
      ...prev,
      beneficios: prev.beneficios.map((beneficio, i) =>
        i === indice ? { ...beneficio, texto: valor } : beneficio
      )
    }));
  };

  const manejarCambioImagen = (evento) => {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = () => {
      setFormulario((prev) => ({
        ...prev,
        imagen: String(lector.result || '')
      }));
    };
    lector.readAsDataURL(archivo);
  };

  return (
    <div className="admin-banners-vista">
      <div className="admin-seccion-header-row">
        <div>
          <h2>Banners del carrusel</h2>
          <p>Gestiona los slides visibles en la tienda del cliente en tiempo real.</p>
        </div>
        <button type="button" className="btn-agregar-producto-admin" onClick={() => abrirFormulario()}>
          <Plus size={15} />
          <span>Nuevo banner</span>
        </button>
      </div>

      {mensaje && <div className="admin-banner-mensaje">{mensaje}</div>}

      <div className="admin-banners-grid">
        {bannersOrdenados.map((banner, index) => (
          <div key={banner.id} className={`admin-banner-card ${banner.activo === false ? 'inactivo' : ''}`}>
            <div className="admin-banner-preview">
              <img src={banner.imagen || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80'} alt={banner.titulo} />
              <div className="admin-banner-overlay">
                <span>{banner.activo === false ? 'Inactivo' : 'Activo'}</span>
              </div>
            </div>

            <div className="admin-banner-info">
              <div className="admin-banner-top-row">
                <strong>{banner.titulo}</strong>
                <button type="button" className="admin-banner-icon-btn" onClick={() => abrirFormulario(banner)} title="Editar banner">
                  <PencilLine size={14} />
                </button>
              </div>

              <p>{banner.subtitulo}</p>

              <div className="admin-banner-actions-row">
                <button
                  type="button"
                  className="admin-banner-small-btn"
                  onClick={() => actualizarBanner(banner.id, { activo: banner.activo === false })}
                >
                  {banner.activo === false ? <CheckCircle2 size={14} /> : <Eye size={14} />}
                  {banner.activo === false ? 'Activar' : 'Visible'}
                </button>

                <button type="button" className="admin-banner-small-btn danger" onClick={() => eliminar(banner.id)}>
                  <Trash2 size={14} />
                  Eliminar
                </button>
              </div>

              <div className="admin-banner-order-controls">
                <button type="button" disabled={index === 0} onClick={() => moverBanner(index, -1)}><ArrowUpDown size={14} /></button>
                <span>Orden {index + 1}</span>
                <button type="button" disabled={index === bannersOrdenados.length - 1} onClick={() => moverBanner(index, 1)}><ArrowUpDown size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {formulario && (
        <div className="admin-banner-modal-backdrop" onClick={() => setFormulario(null)}>
          <div className="admin-banner-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-banner-modal-header">
              <h3>{formulario.id ? 'Editar banner' : 'Crear banner'}</h3>
              <button type="button" className="admin-banner-modal-close" onClick={() => setFormulario(null)}>
                <XCircle size={18} />
              </button>
            </div>

            <div className="admin-banner-form-grid">
              <label className="full-width">
                <span>Imagen del banner</span>
                <div className="admin-banner-upload-box">
                  <UploadCloud size={18} />
                  <input type="file" accept="image/*" onChange={manejarCambioImagen} />
                  <small>Recomendado: {DIMENSIONES_RECOMENDADAS.ancho} × {DIMENSIONES_RECOMENDADAS.alto}px ({DIMENSIONES_RECOMENDADAS.ratio})</small>
                </div>
                {metaImagen && (
                  <div className={`admin-banner-dimension-note ${metaImagen.compatible ? 'ok' : 'warning'}`}>
                    {metaImagen.compatible
                      ? `Imagen válida: ${metaImagen.ancho} × ${metaImagen.alto}px`
                      : `Tamaño detectado: ${metaImagen.ancho} × ${metaImagen.alto}px. Se recomienda 1440 × 520 px.`}
                  </div>
                )}
                {formulario.imagen && (
                  <img src={formulario.imagen} alt="Vista previa del banner" className="admin-banner-preview-upload" />
                )}
              </label>

              <label>
                <span>URL de imagen (opcional)</span>
                <input value={formulario.imagen} onChange={(e) => setFormulario({ ...formulario, imagen: e.target.value })} />
              </label>

              <label>
                <span>Enlace</span>
                <input value={formulario.enlace} onChange={(e) => setFormulario({ ...formulario, enlace: e.target.value })} />
              </label>

              <label>
                <span>Título principal</span>
                <input value={formulario.titulo} onChange={(e) => setFormulario({ ...formulario, titulo: e.target.value })} />
              </label>

              <label>
                <span>Título resaltado</span>
                <input value={formulario.tituloResaltado} onChange={(e) => setFormulario({ ...formulario, tituloResaltado: e.target.value })} />
              </label>

              <label className="full-width">
                <span>Subtítulo</span>
                <textarea value={formulario.subtitulo} onChange={(e) => setFormulario({ ...formulario, subtitulo: e.target.value })} rows={3} />
              </label>

              <label>
                <span>Texto del botón</span>
                <input value={formulario.botonTexto} onChange={(e) => setFormulario({ ...formulario, botonTexto: e.target.value })} />
              </label>

              <label>
                <span>Estado</span>
                <select value={formulario.activo ? 'activo' : 'inactivo'} onChange={(e) => setFormulario({ ...formulario, activo: e.target.value === 'activo' })}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </label>

              <div className="full-width admin-banner-beneficios-wrap">
                <span>Beneficios</span>
                {formulario.beneficios.map((beneficio, indice) => (
                  <div key={`${beneficio.texto}-${indice}`} className="admin-banner-beneficio-row">
                    <select value={beneficio.icono || 'Truck'} onChange={(e) => {
                      const copia = [...formulario.beneficios];
                      copia[indice] = { ...copia[indice], icono: e.target.value };
                      setFormulario({ ...formulario, beneficios: copia });
                    }}>
                      <option value="Truck">Envíos</option>
                      <option value="ShieldCheck">Garantía</option>
                      <option value="Headphones">Soporte</option>
                    </select>
                    <input value={beneficio.texto || ''} onChange={(e) => cambiarTextoBeneficio(indice, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-banner-modal-actions">
              <button type="button" className="btn-admin-secondary" onClick={() => setFormulario(null)}>Cancelar</button>
              <button type="button" className="btn-agregar-producto-admin" onClick={guardarBanner}>Guardar banner</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-banners-vista {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .admin-seccion-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .admin-seccion-header-row h2 {
          margin: 0 0 0.35rem;
          font-size: clamp(1.6rem, 2vw, 2.25rem);
          color: #f8fafc;
        }

        .admin-seccion-header-row p {
          margin: 0;
          color: #94a3b8;
        }

        .admin-banner-mensaje {
          background: rgba(16, 185, 129, 0.09);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #a7f3d0;
          padding: 0.75rem 1rem;
          border-radius: 12px;
        }

        .admin-banners-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.25rem;
        }

        .admin-banner-card {
          background: #091021;
          border: 1px solid #162645;
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .admin-banner-card.inactivo {
          opacity: 0.7;
        }

        .admin-banner-preview {
          position: relative;
          height: 170px;
          overflow: hidden;
          background: #070d1a;
        }

        .admin-banner-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .admin-banner-overlay {
          position: absolute;
          inset: auto 12px 12px 12px;
          display: flex;
          justify-content: flex-start;
        }

        .admin-banner-overlay span {
          background: rgba(4, 8, 20, 0.7);
          border: 1px solid rgba(255,255,255,0.18);
          padding: 0.3rem 0.55rem;
          border-radius: 999px;
          font-size: 0.7rem;
          color: #f8fafc;
        }

        .admin-banner-info {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          padding: 1rem;
        }

        .admin-banner-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.6rem;
        }

        .admin-banner-top-row strong {
          color: #f8fafc;
          font-size: 1rem;
        }

        .admin-banner-icon-btn {
          width: 30px;
          height: 30px;
          border-radius: 10px;
          border: 1px solid #1c3057;
          background: #0d1628;
          color: #7dd3fc;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .admin-banner-info p {
          margin: 0;
          color: #a0aec0;
          line-height: 1.5;
          min-height: 48px;
        }

        .admin-banner-actions-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .admin-banner-small-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(14, 116, 144, 0.12);
          border: 1px solid rgba(34, 211, 238, 0.24);
          color: #a5f3fc;
          border-radius: 10px;
          padding: 0.45rem 0.7rem;
          cursor: pointer;
        }

        .admin-banner-small-btn.danger {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.3);
          color: #fecaca;
        }

        .admin-banner-order-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          color: #94a3b8;
          font-size: 0.75rem;
        }

        .admin-banner-order-controls button {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: 1px solid #1c3057;
          background: #0b1425;
          color: #cbd5e1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .admin-banner-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(2, 6, 23, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1200;
          padding: 1rem;
          overflow-y: auto;
        }

        .admin-banner-modal {
          width: min(900px, 100%);
          max-height: calc(100vh - 2rem);
          overflow-y: auto;
          background: #08111e;
          border: 1px solid #1d2d4d;
          border-radius: 20px;
          padding: 1.25rem;
          box-shadow: 0 28px 65px rgba(0,0,0,0.45);
        }

        .admin-banner-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .admin-banner-modal-header h3 {
          margin: 0;
          color: #f8fafc;
        }

        .admin-banner-modal-close {
          background: transparent;
          border: none;
          color: #cbd5e1;
          cursor: pointer;
        }

        .admin-banner-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }

        .admin-banner-form-grid label {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          color: #cbd5e1;
          font-size: 0.8rem;
        }

        .admin-banner-form-grid .full-width {
          grid-column: 1 / -1;
        }

        .admin-banner-form-grid input,
        .admin-banner-form-grid select,
        .admin-banner-form-grid textarea {
          background: #0b1425;
          border: 1px solid #1c3057;
          border-radius: 10px;
          padding: 0.7rem 0.8rem;
          color: #f8fafc;
          resize: vertical;
        }

        .admin-banner-upload-box {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding: 0.85rem 0.9rem;
          background: #0b1425;
          border: 1px dashed rgba(34, 211, 238, 0.45);
          border-radius: 12px;
          color: #dbeafe;
        }

        .admin-banner-upload-box input {
          padding: 0;
          border: none;
          background: transparent;
        }

        .admin-banner-upload-box small {
          color: #94a3b8;
        }

        .admin-banner-dimension-note {
          border-radius: 10px;
          padding: 0.45rem 0.6rem;
          font-size: 0.75rem;
          margin-top: -0.2rem;
        }

        .admin-banner-dimension-note.ok {
          background: rgba(16, 185, 129, 0.08);
          color: #a7f3d0;
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .admin-banner-dimension-note.warning {
          background: rgba(245, 158, 11, 0.08);
          color: #fcd34d;
          border: 1px solid rgba(245, 158, 11, 0.25);
        }

        .admin-banner-preview-upload {
          width: 100%;
          max-height: 200px;
          object-fit: cover;
          border-radius: 12px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          margin-top: 0.25rem;
        }

        .admin-banner-beneficios-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .admin-banner-beneficio-row {
          display: grid;
          grid-template-columns: 170px 1fr;
          gap: 0.6rem;
        }

        .admin-banner-modal-actions {
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }

        .btn-admin-secondary {
          background: transparent;
          border: 1px solid #1c3057;
          color: #cbd5e1;
          padding: 0.7rem 1rem;
          border-radius: 10px;
          cursor: pointer;
        }

        @media (max-width: 720px) {
          .admin-banner-form-grid {
            grid-template-columns: 1fr;
          }

          .admin-banner-beneficio-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default PaginaAdminBanners;
