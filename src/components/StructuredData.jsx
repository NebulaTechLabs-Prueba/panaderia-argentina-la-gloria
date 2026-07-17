// Datos estructurados (JSON-LD, schema.org Bakery) para SEO local. Server
// component: lee business_settings de Supabase (lectura pública) en el servidor
// y los deja en el HTML inicial. Revalida cada hora.
const SB = "https://hiwfupqzkrrqanpufezp.supabase.co";
const KEY = "sb_publishable_8jP8m_7YqqJbtMqN-UeP-w_Je2KxyxM";
const BASE = "https://panaderia-lagloria.com";
const DIAS = { lun: "Monday", mar: "Tuesday", mie: "Wednesday", jue: "Thursday", vie: "Friday", sab: "Saturday", dom: "Sunday" };

async function getSettings() {
  try {
    const res = await fetch(`${SB}/rest/v1/business_settings?id=eq.1&select=*`, {
      headers: { apikey: KEY },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const [s] = await res.json();
    return s || null;
  } catch {
    return null;
  }
}

function parseAddr(dir) {
  if (!dir) return undefined;
  const p = dir.split(",").map((s) => s.trim());
  const addr = { "@type": "PostalAddress", addressCountry: "US" };
  if (p[0]) addr.streetAddress = p[0];
  if (p[1]) addr.addressLocality = p[1];
  if (p[2]) {
    const m = p[2].match(/([A-Z]{2})\s*(\d{5})?/);
    if (m) { addr.addressRegion = m[1]; if (m[2]) addr.postalCode = m[2]; }
  }
  return addr;
}

function horariosSpec(horarios) {
  if (!horarios) return undefined;
  const spec = [];
  for (const [k, v] of Object.entries(horarios)) {
    if (!v || /cerrado/i.test(v) || !DIAS[k]) continue;
    const [opens, closes] = v.split(/[–-]/).map((x) => x.trim());
    if (opens && closes) spec.push({ "@type": "OpeningHoursSpecification", dayOfWeek: DIAS[k], opens, closes });
  }
  return spec.length ? spec : undefined;
}

export async function StructuredData() {
  const s = await getSettings();
  const sameAs = [s?.instagram_url, s?.tiktok_url, s?.facebook_url].filter(Boolean);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: s?.nombre_negocio || "Panadería Argentina La Gloria",
    description: s?.mensaje_bienvenida || "Panadería y pastelería argentina.",
    image: `${BASE}/logo.png`,
    url: BASE,
    telephone: s?.whatsapp_numero || undefined,
    priceRange: "$$",
    servesCuisine: "Argentine",
    address: parseAddr(s?.direccion),
    hasMap: s?.maps_url || undefined,
    openingHoursSpecification: horariosSpec(s?.horarios),
    sameAs: sameAs.length ? sameAs : undefined,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
