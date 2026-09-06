import { useState, useMemo, useEffect } from 'react';
import { useProductosContext } from '../contextos/ContextoProductos';

const normalizarCategoria = (valor) => {
  if (valor === null || valor === undefined) return '';
  return String(valor)
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');
};

const normalizarTexto = (valor) => {
  if (valor === null || valor === undefined) return '';
  return String(valor)
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export function useProductos({ categoria = null, busqueda = '', orden = 'relevancia', tipoSeccion = null } = {}) {
  const { productos, categorias } = useProductosContext();
  const [terminoBusqueda, setTerminoBusqueda] = useState(busqueda);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categoria);

  useEffect(() => {
    setCategoriaSeleccionada(categoria);
  }, [categoria]);

  useEffect(() => {
    setTerminoBusqueda(busqueda);
  }, [busqueda]);

  const consultaBusquedaEfectiva = busqueda !== undefined && busqueda !== null ? busqueda : terminoBusqueda;

  const productosFiltrados = useMemo(() => {
    let resultado = [...productos];

    if (tipoSeccion) {
      resultado = resultado.filter(p => p.tipoSeccion === tipoSeccion);
    }

    if (categoriaSeleccionada) {
      const categoriaObjetivo = normalizarCategoria(categoriaSeleccionada);
      resultado = resultado.filter((p) => {
        const valoresCategoria = [
          p.categoria,
          p.categoriaNombre,
          p.categoriaId,
          p.categoriaSlug,
          p.slug,
          p.id
        ];

        return valoresCategoria.some((valor) => normalizarCategoria(valor) === categoriaObjetivo);
      });
    }

    const textoFiltro = String(consultaBusquedaEfectiva || '').trim();
    if (textoFiltro !== '') {
      const q = normalizarTexto(textoFiltro);
      resultado = resultado.filter((p) => {
        const nombre = normalizarTexto(p.nombre);
        const categoriaNombre = normalizarTexto(p.categoriaNombre);
        const categoriaSlug = normalizarTexto(p.categoria);
        const descripcion = normalizarTexto(p.descripcion);

        return (
          nombre.includes(q) ||
          categoriaNombre.includes(q) ||
          categoriaSlug.includes(q) ||
          descripcion.includes(q)
        );
      });
    }

    if (orden === 'precio-asc') {
      resultado.sort((a, b) => a.precio - b.precio);
    } else if (orden === 'precio-desc') {
      resultado.sort((a, b) => b.precio - a.precio);
    } else if (orden === 'rating') {
      resultado.sort((a, b) => b.rating - a.rating);
    } else if (orden === 'nombre') {
      resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (orden === 'stock-asc') {
      resultado.sort((a, b) => (a.stock || 0) - (b.stock || 0));
    }

    return resultado;
  }, [productos, categoriaSeleccionada, consultaBusquedaEfectiva, orden, tipoSeccion]);

  return {
    productos: productosFiltrados,
    todosLosProductos: productos,
    categorias,
    terminoBusqueda: consultaBusquedaEfectiva,
    setTerminoBusqueda,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    totalResultados: productosFiltrados.length
  };
}

export default useProductos;
