import React from 'react';

/**
 * Icono de huella / pata de león NAS estilizado con brillo azul neón
 */
export function IconoHuella({ activo = false, size = 16, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`icono-huella-btn ${activo ? 'activo' : ''} ${className}`}
      title={activo ? 'En tu selección' : 'Añadir a mi selección'}
      aria-label="Añadir a mi selección"
      style={{
        width: `${size + 14}px`,
        height: `${size + 14}px`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="icono-huella-svg"
      >
        {/* Almohadilla principal de la pata */}
        <path d="M12 11.5C9.5 11.5 7.5 13.5 7.5 16C7.5 18.5 9.5 20.5 12 20.5C14.5 20.5 16.5 18.5 16.5 16C16.5 13.5 14.5 11.5 12 11.5Z" />
        {/* Dedos superiores */}
        <ellipse cx="6" cy="9" rx="2.2" ry="3.2" transform="rotate(-15 6 9)" />
        <ellipse cx="10" cy="6.2" rx="2.2" ry="3.2" transform="rotate(-5 10 6.2)" />
        <ellipse cx="14" cy="6.2" rx="2.2" ry="3.2" transform="rotate(5 14 6.2)" />
        <ellipse cx="18" cy="9" rx="2.2" ry="3.2" transform="rotate(15 18 9)" />
      </svg>
      <style>{`
        .icono-huella-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 180, 216, 0.15);
          border: 1px solid rgba(0, 210, 255, 0.4);
          color: #00d2ff;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0;
          box-shadow: 0 0 8px rgba(0, 180, 216, 0.3);
          backdrop-filter: blur(4px);
        }
        .icono-huella-btn:hover {
          background: rgba(0, 210, 255, 0.3);
          border-color: #00d2ff;
          transform: scale(1.15);
          box-shadow: 0 0 16px rgba(0, 210, 255, 0.7);
          color: #ffffff;
        }
        .icono-huella-btn.activo {
          background: linear-gradient(135deg, #00b4d8, #0077b6);
          border-color: #00d2ff;
          color: #ffffff;
          box-shadow: 0 0 15px rgba(0, 210, 255, 0.8), 0 0 25px rgba(0, 180, 216, 0.4);
          animation: pulseHuella 1.5s infinite alternate;
        }
        @keyframes pulseHuella {
          0% { transform: scale(1); box-shadow: 0 0 10px rgba(0, 210, 255, 0.6); }
          100% { transform: scale(1.08); box-shadow: 0 0 18px rgba(0, 210, 255, 0.95); }
        }
      `}</style>
    </button>
  );
}

export default IconoHuella;
