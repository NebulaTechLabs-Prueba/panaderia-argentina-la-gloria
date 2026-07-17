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
