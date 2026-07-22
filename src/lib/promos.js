"use client";

import { getSupabase } from "@/lib/supabase/client";

// Promos gestionadas en Supabase (tabla `promos`). Lectura pública; escritura
// solo super-admin (RLS). El carrito las aplica solo.
//   condicion.tipo = "productos" → lista de productos (todos) con cantidad mínima.
//   condicion.tipo = "monto"     → consumo mínimo (monto_centavos).
//   premio = lista de productos gratis.

// Normaliza una fila (tolera formas viejas).
//   premio = lista [{producto_id, cantidad}]  → productos gratis
//   premio = { tipo:"descuento", modo:"porcentaje"|"monto", valor_pct, valor_centavos }
export function normalizar(p) {
  const cond = p.condicion || {};
  const condicion = cond.tipo
    ? { monto_centavos: 0, productos: [], ...cond }
    : { tipo: "productos", productos: [], monto_centavos: 0 };
  const premio = Array.isArray(p.premio)
    ? p.premio
    : (p.premio && p.premio.tipo === "descuento" ? p.premio : []);
  return { ...p, activa: p.activa ?? true, condicion, premio, vigencia: p.vigencia ?? null };
}

// Día de la semana (0=Dom … 6=Sáb) en la hora del negocio (Virginia, EE. UU.).
function diaSemanaNegocio() {
  try {
    const wd = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short" }).format(new Date());
    return { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[wd] ?? new Date().getDay();
  } catch {
    return new Date().getDay();
  }
}

// ¿La promo está vigente ahora? activa + dentro de la ventana de fechas (si tiene)
// + hoy es uno de los días elegidos (si tiene). `dias` vacío = todos los días.
// (las fechas y los días son independientes: ambas condiciones deben cumplirse).
export function promoVigente(promo) {
  if (!promo.activa) return false;
  const v = promo.vigencia || {};
  const now = new Date();
  if (v.desde && now < new Date(v.desde + "T00:00:00")) return false;
  if (v.hasta && now > new Date(v.hasta + "T23:59:59")) return false;
  if (Array.isArray(v.dias) && v.dias.length && !v.dias.includes(diaSemanaNegocio())) return false;
  return true;
}

// Lee todas las promos de Supabase (normalizadas).
export async function getPromos() {
  try {
    const { data, error } = await getSupabase().from("promos").select("*").order("orden");
    if (error) throw error;
    return (data || []).map(normalizar);
  } catch (e) {
    console.warn("getPromos:", e?.message);
    return [];
  }
}

// Alta/edición (super-admin). Emite evento para refrescar carrito/menú.
export async function guardarPromo(row) {
  const { error } = await getSupabase().from("promos").upsert(row);
  if (!error) notificarPromos();
  return { error };
}

export async function eliminarPromo(id) {
  const { error } = await getSupabase().from("promos").delete().eq("id", id);
  if (!error) notificarPromos();
  return { error };
}

export function notificarPromos() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("la-gloria:promos"));
}

// ¿Cuántas veces se cumple la condición de la promo con el carrito actual?
function vecesCondicion(cond = {}, items, total) {
  if (cond.tipo === "monto") return cond.monto_centavos > 0 && total >= cond.monto_centavos ? 1 : 0;
  const reqs = (cond.productos || []).filter((r) => r.producto_id);
  if (!reqs.length) return 0;
  let veces = Infinity;
  for (const r of reqs) {
    const enCarrito = items.find((i) => i.id === r.producto_id);
    const tiene = enCarrito ? Math.floor(enCarrito.cantidad / (r.cantidad || 1)) : 0;
    veces = Math.min(veces, tiene);
  }
  return isFinite(veces) ? veces : 0;
}

const idBase = (id) => String(id).split("::")[0];

// Calcula los REGALOS (productos gratis) que corresponden según el carrito.
export function calcularRegalos(items, promos = [], nombrePorId = {}) {
  const regalos = [];
  const total = items.reduce((a, i) => a + i.precio_centavos * i.cantidad, 0);
  for (const promo of promos) {
    if (!promoVigente(promo)) continue;
    if (!Array.isArray(promo.premio)) continue; // los descuentos van por calcularDescuento
    const veces = vecesCondicion(promo.condicion, items, total);
    if (veces < 1) continue;
    for (const pr of promo.premio) {
      const nombre = nombrePorId[pr.producto_id];
      if (!nombre) continue;
      regalos.push({ id: `regalo-${promo.id}-${pr.producto_id}`, nombre, cantidad: (pr.cantidad || 1) * veces, promo: promo.nombre });
    }
  }
  return regalos;
}

// Calcula el DESCUENTO total (monto fijo o %) que corresponde según el carrito.
// El descuento puede aplicar sobre TODO el carrito o sobre productos específicos.
export function calcularDescuento(items, promos = []) {
  const subtotal = items.reduce((a, i) => a + i.precio_centavos * i.cantidad, 0);
  let total = 0;
  const aplicados = [];
  for (const promo of promos) {
    if (!promoVigente(promo)) continue;
    const prem = promo.premio;
    if (!prem || Array.isArray(prem) || prem.tipo !== "descuento") continue;
    if (vecesCondicion(promo.condicion, items, subtotal) < 1) continue;
    // Base sobre la que se calcula: todo el carrito o solo ciertos productos.
    let base = subtotal;
    if (prem.alcance === "productos") {
      const ids = new Set(prem.productos || []);
      base = items.filter((i) => ids.has(idBase(i.id))).reduce((a, i) => a + i.precio_centavos * i.cantidad, 0);
    }
    if (base <= 0) continue;
    const desc = prem.modo === "porcentaje"
      ? Math.round((base * (Number(prem.valor_pct) || 0)) / 100)
      : Math.min(Number(prem.valor_centavos) || 0, base);
    if (desc > 0) {
      total += desc;
      aplicados.push({ promo: promo.nombre, centavos: desc, modo: prem.modo, valor_pct: prem.valor_pct, alcance: prem.alcance });
    }
  }
  return { descuentoCentavos: Math.min(total, subtotal), aplicados };
}
