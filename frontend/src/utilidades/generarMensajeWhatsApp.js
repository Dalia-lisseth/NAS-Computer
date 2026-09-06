import { formatearPrecio } from './formatearPrecio';

const NUMERO_WHATSAPP_NAS = "593960466181"; // Número oficial de WhatsApp de NAS Computer (+593 96 046 6181)

/**
 * Genera el enlace y mensaje de WhatsApp para cotizar o realizar una consulta
 * @param {Array} itemsSeleccionados - Lista de productos en la selección
 * @param {number} total - Monto total
 * @returns {string} - URL completa de WhatsApp
 */
export function generarEnlaceWhatsAppCotizacion(itemsSeleccionados = [], total = 0) {
  let mensaje = "¡Hola *NAS Computer*! 🦁💻\n\n";

  if (itemsSeleccionados.length > 0) {
    mensaje += "Me gustaría solicitar una cotización para los siguientes productos de mi selección:\n\n";
    itemsSeleccionados.forEach((item, index) => {
      mensaje += `*${index + 1}.* ${item.nombre}\n`;
      mensaje += `   • Cantidad: ${item.cantidad || 1}\n`;
      mensaje += `   • Precio unitario: ${formatearPrecio(item.precio)}\n`;
      mensaje += `   • Subtotal: ${formatearPrecio((item.precio || 0) * (item.cantidad || 1))}\n\n`;
    });

    mensaje += `*TOTAL ESTIMADO:* ${formatearPrecio(total)}\n\n`;
    mensaje += "¿Tienen disponibilidad inmediata y cuáles son los métodos de entrega/pago?";
  } else {
    mensaje += "Quisiera recibir asesoría personalizada sobre sus equipos y soluciones tecnológicas NAS.";
  }

  const mensajeCodificado = encodeURIComponent(mensaje);
  return `https://wa.me/${NUMERO_WHATSAPP_NAS}?text=${mensajeCodificado}`;
}

export function abrirWhatsApp(itemsSeleccionados = [], total = 0) {
  const url = generarEnlaceWhatsAppCotizacion(itemsSeleccionados, total);
  window.open(url, '_blank', 'noopener,noreferrer');
}
