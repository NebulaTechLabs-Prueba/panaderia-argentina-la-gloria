// Sufijo a mostrar tras el precio según cómo se cobra el producto.
const SUFIJO = {
  porcion: "porción",
  "media-docena": "½ doc.",
  docena: "docena",
  lb: "lb",
  variable: "lb",
};

// "uni" o vacío → sin sufijo (se entiende por unidad).
export function unidadSufijo(unidad) {
  return unidad && SUFIJO[unidad] ? `/${SUFIJO[unidad]}` : "";
}

export const UNIDADES = [
  { valor: "uni", label: "Por unidad" },
  { valor: "porcion", label: "Por porción" },
  { valor: "media-docena", label: "Por ½ docena" },
  { valor: "docena", label: "Por docena" },
  { valor: "lb", label: "Por libra (lb)" },
  { valor: "variable", label: "Variable" },
];
