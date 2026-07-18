import { getSettingsServer } from "./settings";

const BASE = "https://panaderia-lagloria.com";

// Metadata SEO de las páginas PÚBLICAS (no del admin). Incluye la verificación
// de Search Console si está cargada en Ajustes.
export async function metadataPublica(canonical = "/") {
  const s = await getSettingsServer();
  const codigo = s?.google_site_verification?.trim();
  return {
    metadataBase: new URL(BASE),
    title: "Panadería Argentina La Gloria — facturas, empanadas y parrilla · Alexandria, VA",
    description:
      "Panadería y pastelería argentina en Alexandria/Woodbridge, VA. Facturas, medialunas, alfajores, empanadas, milanesas, pizzas y parrilla los domingos. Armá tu pedido y lo coordinamos por WhatsApp.",
    keywords: [
      "panadería argentina", "facturas", "medialunas", "empanadas argentinas", "alfajores",
      "milanesas", "pizza argentina", "parrilla", "Alexandria VA", "Woodbridge VA",
      "comida argentina", "pastelería",
    ],
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "es_AR",
      url: `${BASE}${canonical}`,
      siteName: "Panadería Argentina La Gloria",
      title: "Panadería Argentina La Gloria — Alexandria/Woodbridge, VA",
      description: "Facturas, empanadas, milanesas, pizzas y parrilla argentina. Armá tu pedido por WhatsApp.",
      images: [{ url: "/logo.png", width: 389, height: 384, alt: "Panadería Argentina La Gloria" }],
    },
    twitter: {
      card: "summary",
      title: "Panadería Argentina La Gloria — Alexandria/Woodbridge, VA",
      description: "Facturas, empanadas, milanesas, pizzas y parrilla argentina. Pedí por WhatsApp.",
      images: ["/logo.png"],
    },
    verification: codigo ? { google: codigo } : undefined,
  };
}
