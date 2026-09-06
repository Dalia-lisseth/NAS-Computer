import React from 'react';
import {
  LayoutDashboard,
  Package,
  Boxes,
  FolderTree,
  Tag,
  MessageSquareQuote,
  Store,
  LogOut,
  ShieldCheck,
  ImageIcon
} from 'lucide-react';
import logoNas from '../../assets/logo/logo-nas.png';
import { useAutenticacionContext } from '../../contextos/ContextoAutenticacion';
import { useProductosContext } from '../../contextos/ContextoProductos';

export function BarraLateralAdmin({ seccionActiva = 'inicio', onCambiarSeccion, onIrATienda }) {
  const { cerrarSesion } = useAutenticacionContext();
  const { productos } = useProductosContext();

  const stockBajoCount = productos.filter(p => (p.stock || 0) <= (p.stockMinimo || 4)).length;

  const itemsNav = [
    { id: 'inicio', label: 'Dashboard', icono: <LayoutDashboard size={18} /> },
    { id: 'productos', label: 'Productos', icono: <Package size={18} />, badge: productos.length },
    { id: 'inventario', label: 'Inventario', icono: <Boxes size={18} />, badgeAlerta: stockBajoCount > 0 ? stockBajoCount : null },
    { id: 'categorias', label: 'Categorías', icono: <FolderTree size={18} /> },
    { id: 'ofertas', label: 'Ofertas & SALE', icono: <Tag size={18} /> },
    { id: 'solicitudes', label: 'Solicitudes WhatsApp', icono: <MessageSquareQuote size={18} /> },
    { id: 'banners', label: 'Banners', icono: <ImageIcon size={18} />, destacado: true }
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <img src={logoNas} alt="NAS Computer" className="admin-logo-img" />
        <span className="admin-badge-rol">
          <ShieldCheck size={12} /> PANEL CONTROL
        </span>
      </div>

      <nav className="admin-sidebar-nav">
        <div className="admin-sidebar-seccion-label">Navegación</div>
        {itemsNav.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`admin-nav-item ${seccionActiva === item.id ? 'activo' : ''} ${item.destacado ? 'destacado' : ''} ${item.soporte ? 'soporte' : ''}`}
            onClick={() => onCambiarSeccion(item.id)}
          >
            {item.icono}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span className="admin-nav-badge">{item.badge}</span>
            )}
            {item.badgeAlerta && (
              <span className="admin-nav-badge alerta" title="Productos con stock bajo">{item.badgeAlerta}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button
          type="button"
          className="btn-ver-tienda-cliente"
          onClick={onIrATienda}
        >
          <Store size={16} />
          <span>Ver Tienda Cliente</span>
        </button>

        <button
          type="button"
          className="btn-admin-logout"
          onClick={cerrarSesion}
        >
          <LogOut size={15} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

export default BarraLateralAdmin;
