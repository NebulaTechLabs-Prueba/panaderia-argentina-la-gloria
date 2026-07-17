// Lectura server-side de business_settings (lectura pública) para SEO/analytics.
// Next deduplica los fetch idénticos dentro de un mismo render, así que
// StructuredData, Analytics y generateMetadata comparten una sola llamada.
const SB = "https://hiwfupqzkrrqanpufezp.supabase.co";
const KEY = "sb_publishable_8jP8m_7YqqJbtMqN-UeP-w_Je2KxyxM";

export async function getSettingsServer() {
  try {
    const res = await fetch(`${SB}/rest/v1/business_settings?id=eq.1&select=*`, {
      headers: { apikey: KEY },
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const [s] = await res.json();
    return s || null;
  } catch {
    return null;
  }
}
