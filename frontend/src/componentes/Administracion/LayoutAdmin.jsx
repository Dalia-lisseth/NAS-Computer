import React from 'react';
import { BarraLateralAdmin } from './BarraLateralAdmin';
import { CabeceraAdmin } from './CabeceraAdmin';
import '../../estilos/admin.css';

export function LayoutAdmin({ seccionActiva, onCambiarSeccion, onIrATienda, titulo, children }) {
  return (
    <div className="admin-layout-wrapper">
      <BarraLateralAdmin
        seccionActiva={seccionActiva}
        onCambiarSeccion={onCambiarSeccion}
        onIrATienda={onIrATienda}
      />

      <div className="admin-main-area">
        <CabeceraAdmin
          titulo={titulo}
          onIrATienda={onIrATienda}
        />

        <div className="admin-page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default LayoutAdmin;
