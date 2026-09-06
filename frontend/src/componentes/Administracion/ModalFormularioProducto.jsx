import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { useProductosContext } from '../../contextos/ContextoProductos';

export function ModalFormularioProducto({ productoAEditar, alCerrar, alGuardar }) {
  const { categorias } = useProductosContext();

  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'laptops',
    categoriaNombre: 'Laptops',
    precio: '',
    precioAnterior: '',
    stock: 10,
    stockMinimo: 4,
    badge: '',
    tipoSeccion: 'general',
    imagen: '',
    descripcion: '',
    especificaciones: {}
  });

  const [specsList, setSpecsList] = useState([
    { clave: 'Procesador', valor: '' },
    { clave: 'Memoria RAM', valor: '' },
    { clave: 'Almacenamiento', valor: '' }
  ]);

  useEffect(() => {
    if (productoAEditar) {
      setFormData({
        nombre: productoAEditar.nombre || '',
        categoria: productoAEditar.categoria || 'laptops',
        categoriaNombre: productoAEditar.categoriaNombre || 'Laptops',
        precio: productoAEditar.precio !== undefined ? productoAEditar.precio : '',
        precioAnterior: productoAEditar.precioAnterior || '',
        stock: productoAEditar.stock !== undefined ? productoAEditar.stock : 10,
        stockMinimo: productoAEditar.stockMinimo !== undefined ? productoAEditar.stockMinimo : 4,
        badge: productoAEditar.badge || '',
        tipoSeccion: productoAEditar.tipoSeccion || 'general',
        imagen: productoAEditar.imagen || '',
        descripcion: productoAEditar.descripcion || '',
        especificaciones: productoAEditar.especificaciones || {}
      });

      if (productoAEditar.especificaciones && Object.keys(productoAEditar.especificaciones).length > 0) {
        setSpecsList(
          Object.entries(productoAEditar.especificaciones).map(([clave, valor]) => ({ clave, valor }))
        );
      }
    }
  }, [productoAEditar]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    if (name === 'categoria') {
      const catObj = categorias.find(c => c.slug === value || c.id === value);
      setFormData(prev => ({
        ...prev,
        categoria: value,
        categoriaNombre: catObj ? catObj.nombre : value
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const actualizarSpec = (index, campo, valor) => {
    const copia = [...specsList];
    copia[index][campo] = valor;
    setSpecsList(copia);
  };

  const agregarFilaSpec = () => {
    setSpecsList(prev => [...prev, { clave: '', valor: '' }]);
  };

  const eliminarFilaSpec = (index) => {
    setSpecsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reconstruir objeto de especificaciones
    const specsObj = {};
    specsList.forEach(item => {
      if (item.clave.trim()) {
        specsObj[item.clave.trim()] = item.valor.trim();
      }
    });

    const productoPayload = {
      ...formData,
      precio: parseFloat(formData.precio) || 0,
      precioAnterior: formData.precioAnterior ? parseFloat(formData.precioAnterior) : null,
      stock: parseInt(formData.stock, 10) || 0,
      stockMinimo: parseInt(formData.stockMinimo, 10) || 4,
      badge: formData.badge || null,
      especificaciones: specsObj
    };

    alGuardar(productoPayload);
  };

  return (
    <div className="modal-nas-overlay" onClick={alCerrar}>
      <div className="modal-form-producto-card anim-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera */}
        <div className="modal-form-header">
          <div>
            <h2 className="modal-form-titulo">
              {productoAEditar ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </h2>
            <p className="modal-form-sub">Configura precios, especificaciones y disponibilidad para el catálogo del cliente.</p>
          </div>
          <button type="button" className="modal-nas-cerrar" onClick={alCerrar}>
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="modal-form-body">
          <div className="form-grid-2">
            {/* Nombre del Producto */}
            <div className="campo-grupo full-width">
              <label className="campo-label">Nombre del Producto *</label>
              <input
                type="text"
                name="nombre"
                required
                placeholder="Ej: ASUS ROG Zephyrus G16"
                value={formData.nombre}
                onChange={manejarCambio}
                className="campo-input"
              />
            </div>

            {/* Categoría */}
            <div className="campo-grupo">
              <label className="campo-label">Categoría Principal *</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={manejarCambio}
                className="campo-input"
              >
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.nombre}</option>
                ))}
              </select>
            </div>

            {/* Sección de Visualización en Inicio */}
            <div className="campo-grupo">
              <label className="campo-label">Ubicación en Inicio</label>
              <select
                name="tipoSeccion"
                value={formData.tipoSeccion}
                onChange={manejarCambio}
                className="campo-input"
              >
                <option value="general">Catálogo General</option>
                <option value="destacados">Productos Destacados</option>
                <option value="ofertas">Productos en Oferta</option>
                <option value="masVendidos">Más Vendidos</option>
              </select>
            </div>

            {/* Precio Actual */}
            <div className="campo-grupo">
              <label className="campo-label">Precio ($ USD) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="precio"
                required
                placeholder="Ej: 899.00"
                value={formData.precio}
                onChange={manejarCambio}
                className="campo-input"
              />
            </div>

            {/* Precio Anterior (Tachado) */}
            <div className="campo-grupo">
              <label className="campo-label">Precio Anterior / Antes ($ USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="precioAnterior"
                placeholder="Opcional para ofertas (ej: 1099.00)"
                value={formData.precioAnterior}
                onChange={manejarCambio}
                className="campo-input"
              />
            </div>

            {/* Stock Actual */}
            <div className="campo-grupo">
              <label className="campo-label">Stock en Inventario *</label>
              <input
                type="number"
                min="0"
                name="stock"
                required
                value={formData.stock}
                onChange={manejarCambio}
                className="campo-input"
              />
            </div>

            {/* Stock Mínimo para Alerta */}
            <div className="campo-grupo">
              <label className="campo-label">Stock Mínimo (Alerta)</label>
              <input
                type="number"
                min="1"
                name="stockMinimo"
                value={formData.stockMinimo}
                onChange={manejarCambio}
                className="campo-input"
              />
            </div>

            {/* Insignia / Badge */}
            <div className="campo-grupo full-width">
              <label className="campo-label">Insignia Promocional</label>
              <div className="badges-radios">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="badge"
                    value=""
                    checked={formData.badge === ''}
                    onChange={manejarCambio}
                  />
                  <span>Ninguna</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="badge"
                    value="NUEVO"
                    checked={formData.badge === 'NUEVO'}
                    onChange={manejarCambio}
                  />
                  <span className="badge-prev nuevo">NUEVO (Verde)</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="badge"
                    value="SALE"
                    checked={formData.badge === 'SALE'}
                    onChange={manejarCambio}
                  />
                  <span className="badge-prev sale">SALE (Azul)</span>
                </label>
              </div>
            </div>

            {/* URL Imagen */}
            <div className="campo-grupo full-width">
              <label className="campo-label">URL de la Imagen del Producto *</label>
              <div className="imagen-input-row">
                <input
                  type="url"
                  name="imagen"
                  required
                  placeholder="https://images.unsplash.com/... o enlace de imagen"
                  value={formData.imagen}
                  onChange={manejarCambio}
                  className="campo-input"
                />
                {formData.imagen && (
                  <div className="img-preview-box">
                    <img src={formData.imagen} alt="Preview" />
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div className="campo-grupo full-width">
              <label className="campo-label">Descripción</label>
              <textarea
                name="descripcion"
                rows={3}
                placeholder="Detalla las características principales del equipo..."
                value={formData.descripcion}
                onChange={manejarCambio}
                className="campo-input"
              />
            </div>
          </div>

          {/* Especificaciones Técnicas */}
          <div className="specs-section-container">
            <div className="specs-header-row">
              <label className="campo-label">Especificaciones Técnicas (Clave - Valor)</label>
              <button
                type="button"
                className="btn-add-spec"
                onClick={agregarFilaSpec}
              >
                <Plus size={13} /> Añadir fila
              </button>
            </div>

            <div className="specs-inputs-list">
              {specsList.map((spec, index) => (
                <div key={index} className="spec-row-item">
                  <input
                    type="text"
                    placeholder="Característica (ej: Procesador)"
                    value={spec.clave}
                    onChange={(e) => actualizarSpec(index, 'clave', e.target.value)}
                    className="campo-input spec-input-clave"
                  />
                  <input
                    type="text"
                    placeholder="Detalle (ej: Intel Core i7 13va Gen)"
                    value={spec.valor}
                    onChange={(e) => actualizarSpec(index, 'valor', e.target.value)}
                    className="campo-input spec-input-valor"
                  />
                  <button
                    type="button"
                    className="btn-remove-spec"
                    onClick={() => eliminarFilaSpec(index)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="modal-form-footer">
            <button
              type="button"
              className="btn-form-cancelar"
              onClick={alCerrar}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-form-guardar"
            >
              <Save size={16} />
              <span>{productoAEditar ? 'Guardar Cambios' : 'Crear Producto'}</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-nas-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: rgba(2, 6, 18, 0.72);
          backdrop-filter: blur(3px);
        }

        .modal-form-producto-card {
          position: relative;
          background: #091021;
          border: 1px solid #1c3057;
          border-radius: var(--radio-xl);
          padding: 2rem;
          width: 100%;
          max-width: 720px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 180, 216, 0.25);
        }

        .modal-form-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #162645;
        }

        .modal-form-titulo {
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
        }

        .modal-form-sub {
          font-size: 0.8rem;
          color: #8497b0;
          margin-top: 0.2rem;
        }

        .modal-form-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .campo-grupo {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .campo-label {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: #e2ebff;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .campo-input {
          width: 100%;
          background: rgba(13, 24, 40, 0.9);
          border: 1px solid rgba(120, 147, 188, 0.35);
          border-radius: 12px;
          color: #f8fbff;
          padding: 0.8rem 0.9rem;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .campo-input::placeholder {
          color: #7d8ea5;
        }

        .campo-input:focus {
          border-color: rgba(0, 210, 255, 0.9);
          box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.12);
        }

        textarea.campo-input {
          resize: vertical;
          min-height: 96px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .badges-radios {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          background: #060b17;
          border: 1px solid #1c2e4f;
          padding: 0.6rem 1rem;
          border-radius: 8px;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          cursor: pointer;
          font-size: 0.82rem;
          color: #cbd5e1;
        }

        .badge-prev.nuevo {
          color: #10b981;
          font-weight: 700;
        }

        .badge-prev.sale {
          color: #00d2ff;
          font-weight: 700;
        }

        .imagen-input-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .img-preview-box {
          width: 48px;
          height: 48px;
          border-radius: 6px;
          background: #060a14;
          border: 1px solid #1c3057;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          padding: 2px;
        }

        .img-preview-box img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .specs-section-container {
          background: #060b17;
          border: 1px solid #162645;
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .specs-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .btn-add-spec {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: #00d2ff;
          font-weight: 600;
          cursor: pointer;
        }

        .specs-inputs-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .spec-row-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .spec-input-clave {
          width: 35%;
        }

        .spec-input-valor {
          flex: 1;
        }

        .btn-remove-spec {
          color: #64748b;
          padding: 0.4rem;
          cursor: pointer;
          transition: color 0.2s;
        }

        .btn-remove-spec:hover {
          color: #ef4444;
        }

        .modal-nas-cerrar {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(148, 163, 184, 0.25);
          color: #dfe9ff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .modal-form-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.85rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #162645;
        }

        .btn-form-cancelar {
          background: #0b1528;
          border: 1px solid #1c3057;
          color: #94a3b8;
          padding: 0.65rem 1.25rem;
          border-radius: var(--radio-md);
          font-weight: 600;
          cursor: pointer;
        }

        .btn-form-cancelar:hover {
          color: #ffffff;
        }

        .btn-form-guardar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%);
          color: #ffffff;
          padding: 0.65rem 1.5rem;
          border-radius: var(--radio-md);
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.4);
        }

        .btn-form-guardar:hover {
          background: linear-gradient(135deg, #00d2ff 0%, #0096c7 100%);
        }
      `}</style>
    </div>
  );
}

export default ModalFormularioProducto;
