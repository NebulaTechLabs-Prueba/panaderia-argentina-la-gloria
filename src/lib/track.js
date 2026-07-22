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

// Atribución de campaña por sesión (first-touch): si la visita llega con UTM,
// se guarda para toda la tanda (sessionStorage) y se estampa en TODOS los eventos
// (ver producto, carrito, WhatsApp) → así cada dato queda ligado a la campaña que
// lo provocó, sin depender de re-cálculos por ventana de tiempo.
function campaniaSesion() {
  if (typeof window === "undefined") return null;
  try {
    const KEY = "la-gloria:utm";
    const q = new URLSearchParams(window.location.search);
    const utm = {};
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const v = q.get(k);
      if (v) utm[k] = v.slice(0, 60);
    }
    if (utm.utm_campaign && !sessionStorage.getItem(KEY)) sessionStorage.setItem(KEY, JSON.stringify(utm));
    const stored = sessionStorage.getItem(KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function track(tipo, { producto_id = null, meta = null } = {}) {
  try {
    const utm = campaniaSesion();
    const metaFull = utm ? { ...(meta || {}), ...utm } : meta;
    getSupabase()
      .from("events")
      .insert({ tipo, producto_id, meta: metaFull, session_id: sessionId() })
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
// El UTM de la campaña lo agrega `track()` (a todos los eventos de la sesión).
export function trackVisita(path) {
  track("page_view", { meta: { path } });
}
