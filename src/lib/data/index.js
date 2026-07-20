// ────────────────────────────────────────────────────────────────────────────
// CAPA DE ACCESO A DATOS
// El resto de la app SOLO importa desde acá. Lee de Supabase (client-side).
// Si Supabase falla (red/keys), cae a los datos mock para no romper el sitio.
// ────────────────────────────────────────────────────────────────────────────

import { getSupabase } from "@/lib/supabase/client";
import { categoriasMock } from "./mock/categorias";
import { productosMock } from "./mock/productos";
import { ajustesMock } from "./mock/ajustes";
import { IDS_CON_FOTO } from "./imagenesLocales";
import { asset } from "@/lib/config/constants";

// Fallback: asigna la foto local a los productos mock que la tienen.
function conImagenesLocales(productos) {
  return productos.map((p) => {
    if (p.imagen_url) return p;
    if (IDS_CON_FOTO.has(p.id)) return { ...p, imagen_url: asset(`/img/productos/${p.id}.jpg`) };
    return p;
  });
}

// Solo categorías activas, ordenadas (lo que vería el público).
export async function getCategorias() {
  try {
    const { data, error } = await getSupabase()
      .from("categories")
      .select("*")
      .eq("activa", true)
      .order("orden");
    if (error) throw error;
    // ref_keyword (DB) → refKeyword (UI, legado).
    return data.map((c) => ({ ...c, refKeyword: c.ref_keyword }));
  } catch (e) {
    console.warn("getCategorias → fallback mock:", e?.message);
    return categoriasMock.filter((c) => c.activa).sort((a, b) => a.orden - b.orden);
  }
}

// Productos del catálogo público: incluye no disponibles (se muestran "agotado").
export async function getProductos() {
  try {
    const { data, error } = await getSupabase()
      .from("products")
      .select("*")
      .order("orden");
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn("getProductos → fallback mock:", e?.message);
    return conImagenesLocales([...productosMock].sort((a, b) => a.orden - b.orden));
  }
}

// ── Analítica real (a partir de la tabla `events`) ──────────────────────────
function resumirEventos(ev, dias, nombre, nombrePromo = {}) {
  const sesiones = new Set(), sesArmaron = new Set(), sesEnviaron = new Set();
  let visitas = 0, verP = 0, agg = 0, wa = 0, ingresos = 0, sumItems = 0;
  const vistos = {}, agregados = {}, promoClicks = {};
  const tamanos = { chicas: 0, medianas: 0, grandes: 0 };
  const porDia = {}, porDiaSes = {};
  const dow = [0, 0, 0, 0, 0, 0, 0]; // getDay(): 0=Dom … 6=Sáb
  for (const e of ev) {
    const dia = (e.created_at || "").slice(0, 10);
    if (e.session_id) {
      sesiones.add(e.session_id);
      if (!porDiaSes[dia]) porDiaSes[dia] = new Set();
      porDiaSes[dia].add(e.session_id);
    }
    if (e.tipo === "page_view") { visitas++; porDia[dia] = (porDia[dia] || 0) + 1; dow[new Date(e.created_at).getDay()]++; }
    else if (e.tipo === "ver_producto") { verP++; if (e.producto_id) vistos[e.producto_id] = (vistos[e.producto_id] || 0) + 1; }
    else if (e.tipo === "agregar_carrito") { agg++; if (e.session_id) sesArmaron.add(e.session_id); if (e.producto_id) agregados[e.producto_id] = (agregados[e.producto_id] || 0) + 1; }
    else if (e.tipo === "enviar_whatsapp") {
      wa++;
      ingresos += Number(e.meta?.total_centavos || 0);
      const it = Number(e.meta?.items || 0);
      sumItems += it;
      if (it <= 2) tamanos.chicas++; else if (it <= 4) tamanos.medianas++; else tamanos.grandes++;
      if (e.session_id) sesEnviaron.add(e.session_id);
    } else if (e.tipo === "promo_click") {
      const pid = e.meta?.promo_id || "?";
      promoClicks[pid] = (promoClicks[pid] || 0) + 1;
    }
  }
  const top = (obj, dic) =>
    Object.entries(obj).map(([id, valor]) => ({ id, label: (dic[id] || id), valor }))
      .sort((a, b) => b.valor - a.valor).slice(0, 6);
  const serie = [], serieSesiones = [];
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    serie.push({ dia: d, valor: porDia[d] || 0 });
    serieSesiones.push({ dia: d, valor: porDiaSes[d] ? porDiaSes[d].size : 0 });
  }
  return {
    serie,
    serieSesiones,
    sesiones: sesiones.size,
    visitas,
    whatsapp: wa,
    conversion: sesiones.size ? (wa / sesiones.size) * 100 : 0,
    embudo: { ver: verP, carrito: agg, whatsapp: wa },
    topVistos: top(vistos, nombre),
    topAgregados: top(agregados, nombre),
    promoClicks: top(promoClicks, nombrePromo),
    ticket_centavos: wa ? Math.round(ingresos / wa) : 0,
    items_por_pedido: wa ? sumItems / wa : 0,
    carritos_armados: sesArmaron.size,
    carritos_enviaron: sesEnviaron.size,
    tamanos,
    porDiaSemana: [1, 2, 3, 4, 5, 6, 0].map((d, i) => ({ label: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"][i], valor: dow[d] })),
    ingresos_centavos: ingresos,
    totalEventos: ev.length,
  };
}

// Serie diaria (vistas y sesiones) de una ventana previa, alineada a `dias` puntos
// para poder superponerla como "período anterior".
function seriePrevias(evPrev, dias, ahora) {
  const vis = {}, ses = {};
  for (const e of evPrev || []) {
    const dia = (e.created_at || "").slice(0, 10);
    if (e.tipo === "page_view") vis[dia] = (vis[dia] || 0) + 1;
    if (e.session_id) { if (!ses[dia]) ses[dia] = new Set(); ses[dia].add(e.session_id); }
  }
  const seriePrevia = [], serieSesionesPrevia = [];
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(ahora - (dias + i) * 86400000).toISOString().slice(0, 10);
    seriePrevia.push(vis[d] || 0);
    serieSesionesPrevia.push(ses[d] ? ses[d].size : 0);
  }
  return { seriePrevia, serieSesionesPrevia };
}

// Métricas reales de los últimos `dias` días (solo super-admin puede leer events).
// Incluye la serie del período anterior (los `dias` previos) para comparar.
export async function getMetricas(dias = 30) {
  const ahora = Date.now();
  const desde = new Date(ahora - dias * 86400000).toISOString();
  const desdePrev = new Date(ahora - 2 * dias * 86400000).toISOString();
  try {
    const [{ data: ev, error }, { data: evPrev }, prods, { data: promos }] = await Promise.all([
      getSupabase().from("events").select("tipo, producto_id, session_id, meta, created_at").gte("created_at", desde).order("created_at").limit(50000),
      getSupabase().from("events").select("tipo, session_id, created_at").gte("created_at", desdePrev).lt("created_at", desde).limit(50000),
      getProductos(),
      getSupabase().from("promos").select("id, nombre"),
    ]);
    if (error) throw error;
    const nombre = Object.fromEntries((prods || []).map((p) => [p.id, p.nombre]));
    const nombrePromo = Object.fromEntries((promos || []).map((p) => [p.id, p.nombre]));
    return { ...resumirEventos(ev || [], dias, nombre, nombrePromo), ...seriePrevias(evPrev, dias, ahora) };
  } catch (e) {
    console.warn("getMetricas:", e?.message);
    return { ...resumirEventos([], dias, {}, {}), seriePrevia: [], serieSesionesPrevia: [] };
  }
}

// Ajustes del negocio (fila única id=1).
export async function getAjustes() {
  try {
    const { data, error } = await getSupabase()
      .from("business_settings")
      .select("*")
      .eq("id", 1)
      .single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn("getAjustes → fallback mock:", e?.message);
    return {
      ...ajustesMock,
      logo_url: ajustesMock.logo_url ? asset(ajustesMock.logo_url) : null,
    };
  }
}
