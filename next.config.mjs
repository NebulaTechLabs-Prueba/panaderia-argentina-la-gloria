/** @type {import('next').NextConfig} */

// En GitHub Pages el sitio se sirve bajo /<nombre-repo>/.
// En dev (next dev) queremos basePath vacío. El workflow de deploy
// exporta NEXT_PUBLIC_BASE_PATH="/panaderia-argentina-la-gloria".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig = {
  // Export estático: GitHub Pages solo sirve HTML/CSS/JS (sin servidor Node).
  // Esto deshabilita Server Actions, cookies(), route handlers dinámicos, etc.
  output: "export",

  // GH Pages sirve directorios; trailingSlash genera /ruta/index.html.
  trailingSlash: true,

  // Subpath del repo en producción (condicional para no romper `next dev`).
  basePath,
  assetPrefix: basePath || undefined,

  images: {
    // Sin servidor de optimización: Supabase Storage ya entrega URLs públicas.
    unoptimized: true,
  },
};

export default nextConfig;
