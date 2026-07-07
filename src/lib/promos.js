import { productosMock } from "@/lib/data/mock/productos";

// Promos SIMULADAS (sin backend). El carrito las aplica solo; el panel las edita.
// Modelo:
//   condicion.tipo = "productos"  → requiere una LISTA de productos (todos) con su
//                                    cantidad mínima. Ej: pan + café + asado.
//   condicion.tipo = "monto"      → requiere un consumo mínimo (monto_centavos).
//   premio = LISTA de productos gratis. Ej: cremona + choripán.
export const PROMOS_SEED = [
  {
    id: "promo-facturas-cafe",
    nombre: "Facturas + café",
    descripcion: "Llevá 2 facturas y el café con leche va de regalo ☕",
    activa: true,
    condicion: { tipo: "productos", productos: [{ producto_id: "p-facturas", cantidad: 2 }], monto_centavos: 0 },
    premio: [{ producto_id: "p-cafe-leche", cantidad: 1 }],
  },
];

const KEY = "la-gloria:promos";

// Acepta promos con el modelo viejo (1 producto → 1 premio) y las normaliza.
function normalizar(p) {
  const cond = p.condicion || {};
  let condicion;
  if (cond.tipo) condicion = { monto_centavos: 0, productos: [], ...cond };
  else if (cond.producto_id)
    condicion = { tipo: "productos", productos: [{ producto_id: cond.producto_id, cantidad: cond.cantidad || 1 }], monto_centavos: 0 };
  else condicion = { tipo: "productos", productos: [], monto_centavos: 0 };

  let premio = p.premio;
  if (!Array.isArray(premio))
    premio = premio?.producto_id ? [{ producto_id: premio.producto_id, cantidad: premio.cantidad || 1 }] : [];

  return { activa: true, ...p, condicion, premio };
}

export function getPromos() {
  let promos = PROMOS_SEED;
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) promos = JSON.parse(raw);
    } catch {}
  }
  return promos.map(normalizar);
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
  const total = items.reduce((a, i) => a + i.precio_centavos * i.cantidad, 0);

  for (const promo of promos) {
    if (!promo.activa) continue;
    const cond = promo.condicion || {};
    let veces = 0;

    if (cond.tipo === "monto") {
      veces = cond.monto_centavos > 0 && total >= cond.monto_centavos ? 1 : 0;
    } else {
      const reqs = (cond.productos || []).filter((r) => r.producto_id);
      if (!reqs.length) continue;
      veces = Infinity;
      for (const r of reqs) {
        const enCarrito = items.find((i) => i.id === r.producto_id);
        const tiene = enCarrito ? Math.floor(enCarrito.cantidad / (r.cantidad || 1)) : 0;
        veces = Math.min(veces, tiene);
      }
      if (!isFinite(veces)) veces = 0;
    }

    if (veces < 1) continue;
    for (const pr of promo.premio || []) {
      const p = prod(pr.producto_id);
      if (!p) continue;
      regalos.push({
        id: `regalo-${promo.id}-${pr.producto_id}`,
        nombre: p.nombre,
        cantidad: (pr.cantidad || 1) * veces,
        promo: promo.nombre,
      });
    }
  }
  return regalos;
}
