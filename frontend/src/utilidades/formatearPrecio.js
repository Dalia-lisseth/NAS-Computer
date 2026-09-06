/**
 * Formatea un valor numérico como precio en dólares (USD)
 * Ejemplo: 1299 -> "$1,299.00"
 * @param {number} valor 
 * @returns {string}
 */
export function formatearPrecio(valor) {
  if (valor === undefined || valor === null || isNaN(valor)) {
    return '$0.00';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

export default formatearPrecio;
