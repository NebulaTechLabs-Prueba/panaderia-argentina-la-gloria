"use client";

import { getSupabase } from "@/lib/supabase/client";

// Promos gestionadas en Supabase (tabla `promos`). Lectura pública; escritura
// solo super-admin (RLS). El carrito las aplica solo.
//   condicion.tipo = "productos" → lista de productos (todos) con cantidad mínima.
//   condicion.tipo = "monto"     → consumo mínimo (monto_centavos).
//   premio = lista de productos gratis.

// Normaliza una fila (tolera formas viejas).
export function normalizar(p) {
  const cond = p.condicion || {};
  const condicion = cond.tipo
    ? { monto_centavos: 0, productos: [], ...cond }
    : { tipo: "productos", productos: [], monto_centavos: 0 };
  const premio = Array.isArray(p.premio) ? p.premio : [];
  return { ...p, activa: p.activa ?? true, condicion, premio, vigencia: p.vigencia ?? null };
}

// ¿La promo está vigente ahora? (activa + dentro de la ventana de fechas, si tiene).
export function promoVigente(promo) {
  if (!promo.activa) return false;
  const v = promo.vigencia;
  if (!v || (!v.desde && !v.hasta)) return true;
  const now = new Date();
  if (v.desde && now < new Date(v.desde + "T00:00:00")) return false;
  if (v.hasta && now > new Date(v.hasta + "T23:59:59")) return false;
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

// Calcula los REGALOS que corresponden según el carrito y las promos.
// `nombrePorId`: mapa { producto_id → nombre } para resolver los premios.
export function calcularRegalos(items, promos = [], nombrePorId = {}) {
  const regalos = [];
  const total = items.reduce((a, i) => a + i.precio_centavos * i.cantidad, 0);

  for (const promo of promos) {
    if (!promoVigente(promo)) continue;
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
      const nombre = nombrePorId[pr.producto_id];
      if (!nombre) continue;
      regalos.push({
        id: `regalo-${promo.id}-${pr.producto_id}`,
        nombre,
        cantidad: (pr.cantidad || 1) * veces,
        promo: promo.nombre,
      });
    }
  }
  return regalos;
}
