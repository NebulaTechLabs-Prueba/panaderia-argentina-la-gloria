// Mapeo color de categoría → clases estáticas de Tailwind (no dinámicas, para
// que el motor las detecte). "naranja" | "celeste" | "carbon".

// Tile del placeholder de producto: fondo + color del ícono + color del patrón.
export const TILE = {
  naranja: { bg: "bg-corteza", icono: "text-cacao/75", patron: "text-cacao/10" },
  celeste: { bg: "bg-celeste", icono: "text-white", patron: "text-white/25" },
  carbon: { bg: "bg-marca", icono: "text-corteza", patron: "text-white/10" },
};

// Barra/chip de encabezado de sección.
export const HEADER = {
  naranja: "bg-corteza text-cacao",
  celeste: "bg-celeste text-white",
  carbon: "bg-marca text-cream",
};

export function tile(color) {
  return TILE[color] ?? TILE.naranja;
}
export function header(color) {
  return HEADER[color] ?? HEADER.naranja;
}
