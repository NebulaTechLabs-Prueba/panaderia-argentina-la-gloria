// Constantes del negocio. La zona horaria es fija (AST, sin horario de verano).
export const TIMEZONE = "America/Puerto_Rico";

// DEMO: los precios son de muestra hasta cargar los reales. Activa el aviso.
export const ES_DEMO = true;

// Clave de persistencia del carrito en localStorage.
export const CART_STORAGE_KEY = "la-gloria:carrito:v1";

// Prefijo de assets estáticos (se ajusta solo según next.config / GH Pages).
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Resuelve una ruta de /public respetando el basePath de GitHub Pages.
export function asset(path) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${clean}`;
}
