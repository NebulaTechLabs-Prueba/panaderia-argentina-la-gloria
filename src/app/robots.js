const BASE = "https://panaderia-lagloria.com";

// robots.txt: permitir el sitio público, bloquear el panel de gestión.
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/admin/"] }],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
