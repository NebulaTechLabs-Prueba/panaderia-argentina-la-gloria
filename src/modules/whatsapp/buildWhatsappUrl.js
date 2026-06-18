// Construye la URL de WhatsApp (wa.me) con el mensaje del pedido ya codificado.
// wa.me requiere el número en formato internacional SIN "+", espacios ni guiones.
export function buildWhatsappUrl(numero, mensaje) {
  const numeroLimpio = String(numero || "").replace(/[^\d]/g, "");
  const texto = encodeURIComponent(mensaje || "");
  return `https://wa.me/${numeroLimpio}?text=${texto}`;
}
