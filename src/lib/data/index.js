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
function resumirEventos(ev, dias, nombre) {
  const sesiones = new Set();
  let visitas = 0, verP = 0, agg = 0, wa = 0, ingresos = 0;
  const vistos = {}, agregados = {};
  const porDia = {};
  for (const e of ev) {
    if (e.session_id) sesiones.add(e.session_id);
    const dia = (e.created_at || "").slice(0, 10);
    if (e.tipo === "page_view") { visitas++; porDia[dia] = (porDia[dia] || 0) + 1; }
    else if (e.tipo === "ver_producto") { verP++; if (e.producto_id) vistos[e.producto_id] = (vistos[e.producto_id] || 0) + 1; }
    else if (e.tipo === "agregar_carrito") { agg++; if (e.producto_id) agregados[e.producto_id] = (agregados[e.producto_id] || 0) + 1; }
    else if (e.tipo === "enviar_whatsapp") { wa++; ingresos += Number(e.meta?.total_centavos || 0); }
  }
  const top = (obj) =>
    Object.entries(obj).map(([id, valor]) => ({ producto_id: id, label: nombre[id] || id, valor }))
      .sort((a, b) => b.valor - a.valor).slice(0, 6);
  const serie = [];
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    serie.push({ dia: d, valor: porDia[d] || 0 });
  }
  return {
    sesiones: sesiones.size,
    visitas,
    whatsapp: wa,
    conversion: sesiones.size ? (wa / sesiones.size) * 100 : 0,
    embudo: { ver: verP, carrito: agg, whatsapp: wa },
    topVistos: top(vistos),
    topAgregados: top(agregados),
    serie,
    ingresos_centavos: ingresos,
    totalEventos: ev.length,
  };
}

// Métricas reales de los últimos `dias` días (solo super-admin puede leer events).
export async function getMetricas(dias = 30) {
  const desde = new Date(Date.now() - dias * 86400000).toISOString();
  try {
    const [{ data: ev, error }, prods] = await Promise.all([
      getSupabase().from("events").select("tipo, producto_id, session_id, meta, created_at").gte("created_at", desde).order("created_at").limit(50000),
      getProductos(),
    ]);
    if (error) throw error;
    const nombre = Object.fromEntries((prods || []).map((p) => [p.id, p.nombre]));
    return resumirEventos(ev || [], dias, nombre);
  } catch (e) {
    console.warn("getMetricas:", e?.message);
    return resumirEventos([], dias, {});
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
