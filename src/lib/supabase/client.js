// Cliente Supabase para el NAVEGADOR. La app es client-side: todas las
// lecturas/escrituras ocurren en el browser y la seguridad real la imponen las
// políticas RLS de la base.
//
// Usamos el cliente estándar de supabase-js con sesión en localStorage: adjunta
// el token de auth a TODAS las requests (DB, Storage, Auth) de forma confiable,
// también en el subdominio del admin. La URL y la PUBLISHABLE KEY son públicas
// por diseño; se pueden overridear por env vars.
import { createClient } from "@supabase/supabase-js";

const URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hiwfupqzkrrqanpufezp.supabase.co";
const KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_8jP8m_7YqqJbtMqN-UeP-w_Je2KxyxM";

let _client = null;

// Singleton perezoso.
export function getSupabase() {
  if (!_client) {
    _client = createClient(URL, KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // necesario para el link de recuperación (/reset)
        storageKey: "la-gloria-auth",
      },
    });
  }
  return _client;
}
