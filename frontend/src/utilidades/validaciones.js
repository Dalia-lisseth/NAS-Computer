/**
 * Validaciones comunes de datos
 */

export function esEmailValido(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function esTelefonoValido(telefono) {
  const re = /^\+?[\d\s-]{7,15}$/;
  return re.test(String(telefono));
}
