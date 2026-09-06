import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ContextoSeleccion = createContext(null);

export function ProveedorSeleccion({ children }) {
  const [itemsSeleccionados, setItemsSeleccionados] = useState(() => {
    try {
      const guardado = localStorage.getItem('nas_seleccion');
      if (guardado) {
        const datos = JSON.parse(guardado);
        if (Array.isArray(datos)) {
          return datos;
        }
      }
    } catch (e) {
      console.error('Error al cargar selección:', e);
    }

    return [];
  });

  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const [modalCotizacionAbierto, setModalCotizacionAbierto] = useState(false);
  const [productoParaDetalle, setProductoParaDetalle] = useState(null);

  // Persistir en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nas_seleccion', JSON.stringify(itemsSeleccionados));
    } catch (e) {
      console.error('Error al guardar selección:', e);
    }
  }, [itemsSeleccionados]);

  // Cálculos de total y cantidad de ítems
  const { totalMonto, totalItems } = useMemo(() => {
    const total = itemsSeleccionados.reduce((acc, item) => acc + (item.precio * (item.cantidad || 1)), 0);
    const cantidad = itemsSeleccionados.reduce((acc, item) => acc + (item.cantidad || 1), 0);
    return { totalMonto: total, totalItems: cantidad };
  }, [itemsSeleccionados]);

  // Agregar producto o incrementar cantidad
  const agregarASeleccion = (producto) => {
    setItemsSeleccionados(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item =>
          item.id === producto.id ? { ...item, cantidad: (item.cantidad || 1) + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // Alternar selección (usado por el botón de patita/león en las tarjetas)
  const alternarSeleccion = (producto) => {
    setItemsSeleccionados(prev => {
      const existe = prev.some(item => item.id === producto.id);
      if (existe) {
        return prev.filter(item => item.id !== producto.id);
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // Quitar producto de la selección
  const quitarDeSeleccion = (productoId) => {
    setItemsSeleccionados(prev => prev.filter(item => item.id !== productoId));
  };

  // Actualizar cantidad específica
  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      quitarDeSeleccion(productoId);
      return;
    }
    setItemsSeleccionados(prev =>
      prev.map(item =>
        item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  // Vaciar selección
  const vaciarSeleccion = () => {
    setItemsSeleccionados([]);
  };

  // Verificar si un producto está en la selección
  const estaEnSeleccion = (productoId) => {
    return itemsSeleccionados.some(item => item.id === productoId);
  };

  const valor = {
    itemsSeleccionados,
    totalMonto,
    totalItems,
    drawerAbierto,
    setDrawerAbierto,
    modalCotizacionAbierto,
    setModalCotizacionAbierto,
    productoParaDetalle,
    setProductoParaDetalle,
    agregarASeleccion,
    alternarSeleccion,
    quitarDeSeleccion,
    actualizarCantidad,
    vaciarSeleccion,
    estaEnSeleccion
  };

  return (
    <ContextoSeleccion.Provider value={valor}>
      {children}
    </ContextoSeleccion.Provider>
  );
}

export function useSeleccionContext() {
  const contexto = useContext(ContextoSeleccion);
  if (!contexto) {
    throw new Error('useSeleccionContext debe ser usado dentro de un ProveedorSeleccion');
  }
  return contexto;
}

export default ContextoSeleccion;
