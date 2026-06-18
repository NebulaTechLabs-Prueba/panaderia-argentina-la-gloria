// Cliente Supabase para el NAVEGADOR. En export estático (GitHub Pages) no hay
// servidor: todas las lecturas/escrituras de Supabase ocurren client-side y la
// seguridad real la imponen las políticas RLS en la base.
//
// ⚠ Aún NO está cableado: la app usa datos mock vía lib/data. Cuando se conecte
// Supabase, lib/data/index.js usará este cliente. Requiere variables de entorno:
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY
import { createBrowserClient } from "@supabase/ssr";

let _client = null;

// Singleton perezoso: no rompe el build si las env vars todavía no existen.
export function getSupabase() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
  _client = createBrowserClient(url, anonKey);
  return _client;
}
