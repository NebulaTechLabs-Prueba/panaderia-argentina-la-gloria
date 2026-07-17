/** @type {import('next').NextConfig} */

// Desplegado en Vercel como app Next.js normal (SSG/SSR gestionado por la
// plataforma). Ya NO usamos export estático ni basePath de subdirectorio:
// el sitio se sirve desde la raíz del dominio.
const ADMIN_HOST = "admin.panaderia-lagloria.com";

const nextConfig = {
  // GH Pages requería directorios; lo conservamos para mantener las URLs con
  // barra final estables (evita redirecciones al cambiar de hosting).
  trailingSlash: true,

  images: {
    // Por ahora sin optimización de imágenes (las servimos ya listas desde
    // /public). Se puede activar más adelante en Vercel.
    unoptimized: true,
  },

  // Panel de gestión servido desde su propio subdominio (admin.panaderia-lagloria.com).
  // Se resuelve con rewrites en la capa de routing (NO middleware), así el edge
  // reescribe la raíz del subdominio hacia el árbol /admin sin invocar función.
  //   admin.host/        → /admin
  //   admin.host/login   → /admin/login
  // Se excluyen _next, /admin ya prefijado y archivos con extensión (assets).
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: ADMIN_HOST }],
          destination: "/admin",
        },
        {
          source: "/:path((?!_next|admin|.*\\.).*)",
          has: [{ type: "host", value: ADMIN_HOST }],
          destination: "/admin/:path",
        },
      ],
    };
  },
};

export default nextConfig;
