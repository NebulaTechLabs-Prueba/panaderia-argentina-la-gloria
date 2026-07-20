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

// Cada carga de pantalla cuenta como una visita (page view): abrir la home, ir
// al menú o recargar. La sesión (sessionId, por pestaña) agrupa todas las visitas
// de una misma tanda de navegación → así "Visitas" (cargas) y "Sesiones" (personas)
// son métricas distintas y tiene sentido el promedio de visitas por sesión.
export function trackVisita(path) {
  track("page_view", { meta: { path } });
}
