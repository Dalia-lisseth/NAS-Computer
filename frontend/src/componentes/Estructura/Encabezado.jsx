import React, { useState } from 'react';
import { Search, User, ShoppingBag, ChevronDown } from 'lucide-react';
import logoNas from '../../assets/logo/logo-nas.png';
import { useSeleccion } from '../../ganchos/useSeleccion';
import { useAutenticacionContext } from '../../contextos/ContextoAutenticacion';
import { useProductosContext } from '../../contextos/ContextoProductos';
import { formatearPrecio } from '../../utilidades/formatearPrecio';

export function Encabezado({ onBuscar, seccionActiva = 'inicio', onNavegar }) {
  const { totalItems, totalMonto, setDrawerAbierto } = useSeleccion();
  const { usuario, estaAutenticado, esAdmin, abrirModalAuth, cerrarSesion } = useAutenticacionContext();
  const { categorias } = useProductosContext();

  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [dropdownCategorias, setDropdownCategorias] = useState(false);

  const manejarSubmitBusqueda = (e) => {
    e.preventDefault();
    if (onBuscar) {
      onBuscar(textoBusqueda);
    }
  };

  const manejarCambioInput = (e) => {
    setTextoBusqueda(e.target.value);
    if (onBuscar) {
      onBuscar(e.target.value);
    }
  };

  const manejarNavegacion = (ruta) => {
    setDropdownCategorias(false);
    if (onNavegar) {
      onNavegar(ruta);
    }
  };

  const esCategoriaActiva =
    seccionActiva === 'categorias' ||
    seccionActiva === 'catalogo' ||
    (typeof seccionActiva === 'string' && seccionActiva.startsWith('categoria-'));

  return (
    <header className="encabezado-nas-superior">
      <div className="contenedor-principal encabezado-contenedor">
        {/* Logo NAS Computer */}
        <div className="encabezado-logo-area" onClick={() => manejarNavegacion('inicio')}>
          <img src={logoNas} alt="NAS Computer" className="encabezado-logo-img" />
        </div>

        {/* Buscador Central */}
        <form className="encabezado-buscador-form" onSubmit={manejarSubmitBusqueda}>
          <div className="encabezado-buscador-wrapper">
            <input
              type="text"
              placeholder="Buscar productos, marcas o categorías..."
              value={textoBusqueda}
              onChange={manejarCambioInput}
              className="encabezado-buscador-input"
            />
            <button type="submit" className="encabezado-buscador-btn" aria-label="Buscar">
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Enlaces de Navegación Principal (Idénticos al Mockup) */}
        <nav className="encabezado-navegacion">
          <button
            type="button"
            className={`nav-enlace ${seccionActiva === 'inicio' ? 'activo' : ''}`}
            onClick={() => manejarNavegacion('inicio')}
          >
            Inicio
          </button>

          <div
            className="nav-dropdown-wrapper"
            onMouseEnter={() => setDropdownCategorias(true)}
            onMouseLeave={() => setDropdownCategorias(false)}
          >
            <button
              type="button"
              className={`nav-enlace nav-dropdown-btn ${esCategoriaActiva ? 'activo' : ''}`}
              onClick={() => manejarNavegacion('catalogo')}
            >
              Categorías
              <ChevronDown
                size={14}
                className={`dropdown-icono ${dropdownCategorias ? 'rotado' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownCategorias(!dropdownCategorias);
                }}
              />
            </button>

            {dropdownCategorias && (
              <div className="nav-dropdown-menu anim-fade-in">
                <button
                  type="button"
                  className={`nav-dropdown-item nav-dropdown-item-todas ${seccionActiva === 'catalogo' || seccionActiva === 'categorias' ? 'activo' : ''}`}
                  onClick={() => manejarNavegacion('catalogo')}
                >
                  Todas las categorías
                </button>
                <div className="nav-dropdown-separador" />
                {categorias.map((cat) => {
                  const estaActiva =
                    seccionActiva === `categoria-${cat.slug}` ||
                    seccionActiva === `categoria-${cat.id}`;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`nav-dropdown-item ${estaActiva ? 'activo' : ''}`}
                      onClick={() => manejarNavegacion(`categoria-${cat.slug}`)}
                    >
                      {cat.nombre}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            className={`nav-enlace ${seccionActiva === 'ofertas' ? 'activo' : ''}`}
            onClick={() => manejarNavegacion('ofertas')}
          >
            Ofertas
          </button>

          <button
            type="button"
            className={`nav-enlace ${seccionActiva === 'contacto' ? 'activo' : ''}`}
            onClick={() => manejarNavegacion('contacto')}
          >
            Contacto
          </button>
        </nav>

        {/* Acciones del Usuario: Mi Cuenta y Mi Selección */}
        <div className="encabezado-acciones">
          {/* Mi Cuenta (Login unificado / Registro / Panel Admin) */}
          <div
            className="encabezado-usuario-accion"
            onClick={() => {
              if (estaAutenticado) {
                if (esAdmin) {
                  manejarNavegacion('admin');
                } else if (window.confirm(`¿Deseas cerrar la sesión de ${usuario.nombre}?`)) {
                  cerrarSesion();
                }
              } else {
                abrirModalAuth('login');
              }
            }}
          >
            <div className="icono-avatar-circulo">
              <User size={18} />
            </div>
            <div className="usuario-textos">
              <span className="usuario-label">
                {esAdmin ? 'Panel Admin' : 'Mi cuenta'}
              </span>
              <span className="usuario-sublabel">
                {estaAutenticado ? usuario.nombre : 'Iniciar sesión'}
              </span>
            </div>
          </div>

          {/* Mi Selección (Carrito) */}
          <div className="encabezado-seleccion-accion" onClick={() => setDrawerAbierto(true)}>
            <div className="icono-carrito-circulo">
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="badge-seleccion-conteo">{totalItems}</span>
              )}
            </div>
            <div className="seleccion-textos">
              <span className="seleccion-label">Mi selección</span>
              <span className="seleccion-monto">{formatearPrecio(totalMonto)}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .encabezado-nas-superior {
          background-color: rgba(5, 8, 17, 0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(22, 36, 63, 0.7);
          position: sticky;
          top: 0;
          z-index: 1000;
          padding: 0.75rem 0;
          transition: all 0.3s ease;
        }

        .encabezado-contenedor {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .encabezado-logo-area {
          display: flex;
          align-items: center;
          cursor: pointer;
          flex-shrink: 0;
        }

        .encabezado-logo-img {
          height: 48px;
          object-fit: contain;
          transition: transform 0.2s ease;
        }

        .encabezado-logo-img:hover {
          transform: scale(1.02);
        }

        .encabezado-buscador-form {
          flex: 1;
          max-width: 380px;
        }

        .encabezado-buscador-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .encabezado-buscador-input {
          width: 100%;
          background: #080f1d;
          border: 1px solid #1a2c4e;
          border-radius: 9999px;
          padding: 0.55rem 2.8rem 0.55rem 1.15rem;
          color: #f1f5f9;
          font-size: 0.84rem;
          transition: all 0.2s ease;
        }

        .encabezado-buscador-input::placeholder {
          color: #52637f;
        }

        .encabezado-buscador-input:focus {
          border-color: #00b4d8;
          box-shadow: 0 0 12px rgba(0, 180, 216, 0.3);
          background: #0b1528;
        }

        .encabezado-buscador-btn {
          position: absolute;
          right: 0.4rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .encabezado-buscador-btn:hover {
          color: #00d2ff;
        }

        .encabezado-navegacion {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .nav-enlace {
          font-size: 0.9rem;
          color: #94a3b8;
          font-weight: 500;
          padding: 0.35rem 0.2rem;
          position: relative;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .nav-enlace:hover {
          color: #ffffff;
        }

        .nav-enlace.activo {
          color: #00d2ff;
          font-weight: 600;
        }

        .nav-enlace.activo::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #00d2ff;
          border-radius: 2px;
          box-shadow: 0 0 8px #00d2ff;
        }

        .nav-dropdown-wrapper {
          position: relative;
        }

        .dropdown-icono {
          transition: transform 0.2s ease;
        }

        .dropdown-icono.rotado {
          transform: rotate(180deg);
        }

        .nav-dropdown-menu {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 0;
          background: #091021;
          border: 1px solid #1c3057;
          border-radius: var(--radio-md);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 180, 216, 0.2);
          padding: 0.5rem;
          min-width: 180px;
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .nav-dropdown-item {
          text-align: left;
          padding: 0.45rem 0.75rem;
          color: #94a3b8;
          font-size: 0.85rem;
          border-radius: 6px;
          transition: all 0.15s ease;
        }

        .nav-dropdown-item:hover {
          color: #00d2ff;
          background: rgba(0, 180, 216, 0.1);
        }

        .nav-dropdown-item.activo {
          color: #00d2ff;
          background: rgba(0, 180, 216, 0.16);
          font-weight: 600;
        }

        .nav-dropdown-item-todas {
          font-weight: 600;
          color: #e2e8f0;
        }

        .nav-dropdown-separador {
          height: 1px;
          background: #192a48;
          margin: 0.25rem 0.4rem;
        }

        .encabezado-acciones {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .encabezado-usuario-accion, .encabezado-seleccion-accion {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          cursor: pointer;
          user-select: none;
        }

        .icono-avatar-circulo {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #20355a;
          background: #0a1224;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00b4d8;
          transition: all 0.2s ease;
        }

        .encabezado-usuario-accion:hover .icono-avatar-circulo {
          border-color: #00d2ff;
          color: #ffffff;
          box-shadow: 0 0 10px rgba(0, 210, 255, 0.4);
        }

        .usuario-textos, .seleccion-textos {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .usuario-label, .seleccion-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #e2e8f0;
        }

        .usuario-sublabel {
          font-size: 0.72rem;
          color: #64748b;
        }

        .icono-carrito-circulo {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #20355a;
          background: #0a1224;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00b4d8;
          transition: all 0.2s ease;
        }

        .encabezado-seleccion-accion:hover .icono-carrito-circulo {
          border-color: #00d2ff;
          color: #ffffff;
          box-shadow: 0 0 10px rgba(0, 210, 255, 0.4);
        }

        .badge-seleccion-conteo {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #00b4d8;
          color: #050811;
          font-size: 0.68rem;
          font-weight: 800;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 8px rgba(0, 180, 216, 0.8);
        }

        .seleccion-monto {
          font-size: 0.72rem;
          color: #00d2ff;
          font-weight: 700;
        }
      `}</style>
    </header>
  );
}

export default Encabezado;
