/** @type {import('next').NextConfig} */

// Desplegado en Vercel como app Next.js normal (SSG/SSR gestionado por la
// plataforma). Ya NO usamos export estático ni basePath de subdirectorio:
// el sitio se sirve desde la raíz del dominio.
const nextConfig = {
  // GH Pages requería directorios; lo conservamos para mantener las URLs con
  // barra final estables (evita redirecciones al cambiar de hosting).
  trailingSlash: true,

  images: {
    // Por ahora sin optimización de imágenes (las servimos ya listas desde
    // /public). Se puede activar más adelante en Vercel.
    unoptimized: true,
  },
};

export default nextConfig;
