import { formatCentavos, totalCentavos } from "@/lib/money/formatCentavos";

// Arma el bloque de ítems del pedido, una línea por producto.
// Ej: "• 2× Medialuna de manteca — $1.80"
function lineasItems(items, monedaCfg) {
  return items
    .map((i) => {
      const detalle = i.consultar
        ? "a consultar"
        : formatCentavos(i.precio_centavos * i.cantidad, monedaCfg);
      return `• ${i.cantidad}× ${i.nombre} — ${detalle}`;
    })
    .join("\n");
}

// Construye el texto completo del pedido a partir de la plantilla del negocio.
// La plantilla admite los marcadores {items}, {personas} y {total}.
// `personas` = comensales en la mesa (opcional, default 1). Sólo se escribe si es
// 2 o más; se expresa como "Mesa para N" para que se entienda como tamaño de mesa
// (consumo en el local / parrilla) y NO como multiplicador del pedido.
export function buildMensajePedido(items, ajustes, { personas = 1, regalos = [], descuentoCentavos = 0 } = {}) {
  const monedaCfg = { simbolo: ajustes.moneda_simbolo, moneda: ajustes.moneda };
  const sub = totalCentavos(items);
  const total = formatCentavos(Math.max(0, sub - descuentoCentavos), monedaCfg);
  let bloqueItems = lineasItems(items, monedaCfg);
  if (regalos.length) {
    bloqueItems +=
      "\n" + regalos.map((r) => `🎁 ${r.cantidad}× ${r.nombre} — gratis (promo)`).join("\n");
  }
  if (descuentoCentavos > 0) {
    bloqueItems += `\n🏷️ Descuento — −${formatCentavos(descuentoCentavos, monedaCfg)} (promo)`;
  }
  const bloquePersonas = personas > 1 ? `🍽️ Mesa para ${personas} personas\n\n` : "";

  const plantilla =
    ajustes.mensaje_pedido_template ||
    "Hola, quiero este pedido:\n\n{items}\n\n{personas}Total: {total}";

  return plantilla
    .replace("{items}", bloqueItems)
    .replace("{personas}", bloquePersonas)
    .replace("{total}", total);
}
