// Cliente Supabase para el NAVEGADOR. La app es client-side: todas las
// lecturas/escrituras ocurren en el browser y la seguridad real la imponen las
// políticas RLS de la base.
//
// La URL y la PUBLISHABLE KEY son públicas por diseño (van al bundle del
// navegador). Se pueden overridear por env vars; si no, usan estos valores.
import { createBrowserClient } from "@supabase/ssr";

const URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hiwfupqzkrrqanpufezp.supabase.co";
const KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_8jP8m_7YqqJbtMqN-UeP-w_Je2KxyxM";

let _client = null;

// Singleton perezoso.
export function getSupabase() {
  if (!_client) _client = createBrowserClient(URL, KEY);
  return _client;
}
