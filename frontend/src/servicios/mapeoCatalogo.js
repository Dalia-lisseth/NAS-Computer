const CLAVE_SECCION = '_nasTipoSeccion';
const CLAVE_FIN_OFERTA = '_nasFechaFinOferta';

const aNumero = (valor, respaldo = 0) => {
  if (valor === null || valor === undefined || valor === '') return respaldo;
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : respaldo;
};

export const mapearCategoria = (categoria) => ({
  id: categoria.id,
  nombre: categoria.name || categoria.nombre || '',
  slug: categoria.slug,
  icono: categoria.icon || categoria.icono || 'Cpu',
  descripcion: categoria.description || categoria.descripcion || ''
});

export const mapearProducto = (producto) => {
  const crudos = (producto.specifications && typeof producto.specifications === 'object' && !Array.isArray(producto.specifications))
    ? { ...producto.specifications }
    : {};
  const tipoSeccion = crudos[CLAVE_SECCION] || 'general';
  const fechaFinOferta = crudos[CLAVE_FIN_OFERTA] || null;
  delete crudos[CLAVE_SECCION];
  delete crudos[CLAVE_FIN_OFERTA];

  const slugCategoria = producto.category?.slug || producto.categoria || producto.categoriaSlug || '';
  const nombreCategoria = producto.category?.name || producto.categoriaNombre || slugCategoria;

  return {
    id: producto.id,
    slug: producto.slug,
    nombre: producto.name || producto.nombre || '',
    categoria: slugCategoria,
    categoriaNombre: nombreCategoria,
    categoriaId: producto.categoryId || producto.category?.id || producto.categoriaId || '',
    categoriaSlug: slugCategoria,
    precio: aNumero(producto.price ?? producto.precio),
    precioAnterior: producto.previousPrice != null || producto.precioAnterior != null
      ? aNumero(producto.previousPrice ?? producto.precioAnterior, null)
      : null,
    rating: aNumero(producto.rating, 0),
    totalReviews: aNumero(producto.reviewCount ?? producto.totalReviews, 0),
    badge: producto.badge || null,
    tipoSeccion,
    fechaFinOferta,
    imagen: producto.image || producto.imagen || '',
    descripcion: producto.description || producto.descripcion || '',
    especificaciones: crudos,
    stock: aNumero(producto.stock, 0),
    stockMinimo: aNumero(producto.minimumStock ?? producto.stockMinimo, 0),
    isActive: producto.isActive !== false
  };
};

const construirEspecificaciones = (especificaciones = {}, tipoSeccion, fechaFinOferta) => {
  const specs = { ...especificaciones };
  if (tipoSeccion) specs[CLAVE_SECCION] = tipoSeccion;
  if (fechaFinOferta) specs[CLAVE_FIN_OFERTA] = fechaFinOferta;
  else delete specs[CLAVE_FIN_OFERTA];
  return specs;
};

const resolverCategoriaId = (datos, categorias = []) => {
  if (datos.categoriaId && categorias.some((cat) => cat.id === datos.categoriaId)) return datos.categoriaId;
  const clave = datos.categoria || datos.categoriaSlug || datos.categoriaNombre || '';
  const encontrada = categorias.find((cat) =>
    cat.id === clave ||
    cat.slug === clave ||
    cat.nombre?.toLowerCase() === String(clave).toLowerCase()
  );
  return encontrada?.id || datos.categoriaId || null;
};

export const aDtoProducto = (datos, categorias = [], productoActual = null) => {
  const dto = {};
  if (datos.nombre !== undefined) dto.name = String(datos.nombre).trim();
  if (datos.slug !== undefined) dto.slug = datos.slug;
  if (datos.descripcion !== undefined) dto.description = datos.descripcion;
  if (datos.imagen !== undefined) dto.image = datos.imagen;
  if (datos.precio !== undefined) dto.price = aNumero(datos.precio);
  if (datos.precioAnterior !== undefined) dto.previousPrice = datos.precioAnterior === null || datos.precioAnterior === '' ? null : aNumero(datos.precioAnterior);
  if (datos.stock !== undefined) dto.stock = aNumero(datos.stock, 0);
  if (datos.stockMinimo !== undefined) dto.minimumStock = aNumero(datos.stockMinimo, 0);
  if (datos.rating !== undefined) dto.rating = aNumero(datos.rating, 0);
  if (datos.totalReviews !== undefined) dto.reviewCount = aNumero(datos.totalReviews, 0);
  if (datos.badge !== undefined) dto.badge = datos.badge || null;

  const categoryId = resolverCategoriaId(datos, categorias);
  if (categoryId) dto.categoryId = categoryId;

  const debeEnviarSpecs = datos.especificaciones !== undefined || datos.tipoSeccion !== undefined || datos.fechaFinOferta !== undefined;
  if (debeEnviarSpecs) {
    dto.specifications = construirEspecificaciones(
      datos.especificaciones !== undefined ? datos.especificaciones : (productoActual?.especificaciones || {}),
      datos.tipoSeccion !== undefined ? datos.tipoSeccion : (productoActual?.tipoSeccion || 'general'),
      datos.fechaFinOferta !== undefined ? datos.fechaFinOferta : (productoActual?.fechaFinOferta || null)
    );
  }

  return dto;
};

export const aDtoCategoria = (datos) => ({
  name: String(datos.nombre || datos.name || '').trim(),
  slug: datos.slug,
  icon: datos.icono || datos.icon,
  description: datos.descripcion || datos.description
});
