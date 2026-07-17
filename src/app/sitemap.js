const BASE = "https://panaderia-lagloria.com";

// sitemap.xml de las páginas públicas (con barra final, coincide con trailingSlash).
export default function sitemap() {
  return [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/menu/`, changeFrequency: "weekly", priority: 0.9 },
  ];
}
