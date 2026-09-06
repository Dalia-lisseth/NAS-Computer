import React from 'react';

export function TarjetaKpiAdmin({ titulo, valor, icono, color = 'cyan', subtexto }) {
  return (
    <div className="admin-kpi-card">
      <div className="admin-kpi-info">
        <span className="admin-kpi-label">{titulo}</span>
        <span className="admin-kpi-valor">{valor}</span>
        {subtexto && <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{subtexto}</span>}
      </div>

      <div className={`admin-kpi-icono-caja ${color}`}>
        {icono}
      </div>
    </div>
  );
}

export default TarjetaKpiAdmin;
