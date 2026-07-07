// Estilos por etiqueta/badge de producto. `solido` para el sitio público (sobre la
// foto), `suave` para el panel (pill sobre fondo claro, con ring).
const MAPA = {
  promo: { solido: "bg-corteza text-cacao", suave: "bg-corteza/20 text-corteza ring-corteza/30" },
  nuevo: { solido: "bg-celeste text-white", suave: "bg-celeste/20 text-celeste ring-celeste/40" },
  "2x1": { solido: "bg-red-500 text-white", suave: "bg-red-100 text-red-600 ring-red-300" },
  destacado: { solido: "bg-marca text-cream", suave: "bg-marca/15 text-marca ring-marca/30" },
  "más pedido": { solido: "bg-green-600 text-white", suave: "bg-green-100 text-green-700 ring-green-300" },
  "mas pedido": { solido: "bg-green-600 text-white", suave: "bg-green-100 text-green-700 ring-green-300" },
  recomendado: { solido: "bg-amber-500 text-white", suave: "bg-amber-100 text-amber-700 ring-amber-300" },
};

const DEFECTO = { solido: "bg-corteza text-cacao", suave: "bg-corteza/20 text-corteza ring-corteza/30" };

export function estiloBadge(etiqueta) {
  if (!etiqueta) return DEFECTO;
  return MAPA[etiqueta.trim().toLowerCase()] || DEFECTO;
}
