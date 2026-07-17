"use client";

// Tracking de eventos propios → tabla `events` en Supabase. Es "fire & forget":
// nunca bloquea ni rompe la UI (los errores se ignoran). Alimenta el dashboard
// real (embudo ver producto → carrito → WhatsApp).
import { getSupabase } from "@/lib/supabase/client";

// Id de sesión (por pestaña) para contar visitas/sesiones sin cookies.
function sessionId() {
  if (typeof window === "undefined") return null;
  try {
    let id = sessionStorage.getItem("la-gloria:sid");
    if (!id) {
      id = (crypto?.randomUUID?.() || String(Math.random()).slice(2));
      sessionStorage.setItem("la-gloria:sid", id);
    }
    return id;
  } catch {
    return null;
  }
}

export function track(tipo, { producto_id = null, meta = null } = {}) {
  try {
    getSupabase()
      .from("events")
      .insert({ tipo, producto_id, meta, session_id: sessionId() })
      .then(
        () => {},
        () => {}
      );
  } catch {
    /* nunca romper la UI por el tracking */
  }
}

// Una visita por sesión (para no inflar con recargas dentro de la misma pestaña).
export function trackVisita(path) {
  try {
    if (sessionStorage.getItem("la-gloria:pv")) return;
    sessionStorage.setItem("la-gloria:pv", "1");
  } catch {}
  track("page_view", { meta: { path } });
}
