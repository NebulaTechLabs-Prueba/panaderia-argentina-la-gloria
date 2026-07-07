import { productosMock } from "@/lib/data/mock/productos";

// Promos SIMULADAS (sin backend). tipo "regalo": comprando `condicion.cantidad`
// unidades del producto de condición, se suma GRATIS el producto premio. El
// carrito las aplica solo. El panel puede activarlas/desactivarlas (localStorage).
export const PROMOS_SEED = [
  {
    id: "promo-facturas-cafe",
    nombre: "Facturas + café",
    descripcion: "Llevá 2 facturas y el café con leche va de regalo ☕",
    tipo: "regalo",
    condicion: { producto_id: "p-facturas", cantidad: 2 },
    premio: { producto_id: "p-cafe-leche", cantidad: 1 },
    activa: true,
  },
];

const KEY = "la-gloria:promos";

export function getPromos() {
  if (typeof window === "undefined") return PROMOS_SEED;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return PROMOS_SEED;
}

export function guardarPromos(promos) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(promos));
  } catch {}
  window.dispatchEvent(new CustomEvent("la-gloria:promos"));
}

const prod = (id) => productosMock.find((p) => p.id === id);

// Calcula los REGALOS que corresponden según el carrito y las promos activas.
export function calcularRegalos(items, promos = getPromos()) {
  const regalos = [];
  for (const promo of promos) {
    if (!promo.activa || promo.tipo !== "regalo") continue;
    const enCarrito = items.find((i) => i.id === promo.condicion.producto_id);
    if (!enCarrito) continue;
    const veces = Math.floor(enCarrito.cantidad / promo.condicion.cantidad);
    if (veces < 1) continue;
    const p = prod(promo.premio.producto_id);
    if (!p) continue;
    regalos.push({
      id: `regalo-${promo.id}`,
      nombre: p.nombre,
      cantidad: promo.premio.cantidad * veces,
      promo: promo.nombre,
    });
  }
  return regalos;
}
