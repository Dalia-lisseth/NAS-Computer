import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export function ModalFormularioCategoria({ categoriaAEditar, alCerrar, alGuardar }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    icono: 'Monitor'
  });

  useEffect(() => {
    if (categoriaAEditar) {
      setFormData({
        nombre: categoriaAEditar.nombre || '',
        descripcion: categoriaAEditar.descripcion || '',
        icono: categoriaAEditar.icono || 'Monitor'
      });
    }
  }, [categoriaAEditar]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alGuardar(formData);
  };

  return (
    <div className="modal-nas-overlay" onClick={alCerrar}>
      <div className="modal-form-categoria-card anim-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-form-header">
          <h2 className="modal-form-titulo">
            {categoriaAEditar ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          <button type="button" className="modal-nas-cerrar" onClick={alCerrar}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-body">
          <div className="campo-grupo">
            <label className="campo-label">Nombre de la Categoría *</label>
            <input
              type="text"
              required
              placeholder="Ej: Servidores & NAS"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              className="campo-input"
            />
          </div>

          <div className="campo-grupo">
            <label className="campo-label">Icono Representativo</label>
            <select
              value={formData.icono}
              onChange={(e) => setFormData(prev => ({ ...prev, icono: e.target.value }))}
              className="campo-input"
            >
              <option value="Monitor">Monitor / Pantalla</option>
              <option value="Laptop">Laptop / Portátil</option>
              <option value="Cpu">Procesador / Componente</option>
              <option value="Gamepad2">Gaming / Consola</option>
              <option value="Mouse">Periféricos / Ratón</option>
              <option value="Network">Redes / Conectividad</option>
              <option value="ShieldCheck">Accesorios / Seguridad</option>
              <option value="Headphones">Audio / Sonido</option>
              <option value="Printer">Impresoras</option>
              <option value="Smartphone">Smartphones / Móviles</option>
            </select>
          </div>

          <div className="campo-grupo">
            <label className="campo-label">Descripción</label>
            <textarea
              rows={2}
              placeholder="Breve descripción del tipo de hardware..."
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              className="campo-input"
            />
          </div>

          <div className="modal-form-footer">
            <button type="button" className="btn-form-cancelar" onClick={alCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn-form-guardar">
              <Save size={16} />
              <span>Guardar Categoría</span>
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

        .modal-form-categoria-card {
          position: relative;
          background: #091021;
          border: 1px solid #1c3057;
          border-radius: var(--radio-lg);
          padding: 1.75rem;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 180, 216, 0.25);
        }

        .modal-form-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .modal-form-titulo {
          color: #ffffff;
          font-size: 1.4rem;
          font-weight: 800;
          margin: 0;
        }

        .modal-form-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
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
          min-height: 88px;
        }

        .modal-form-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .btn-form-cancelar {
          border: 1px solid rgba(148, 163, 184, 0.35);
          background: rgba(15, 23, 42, 0.7);
          color: #dfe9ff;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-form-guardar {
          background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%);
          color: #ffffff;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.3);
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
      `}</style>
    </div>
  );
}

export default ModalFormularioCategoria;
