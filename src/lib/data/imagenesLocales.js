// Productos que YA tienen foto real propia en /public/img/productos/p-<id>.jpg
// (procesadas con scripts/optimizar-fotos.mjs). El resto queda sin foto y la UI
// muestra el placeholder de marca con "Próximamente".
export const IDS_CON_FOTO = new Set([
  "p-facturas",
  "p-alfajor-maizena",
  "p-alfajor-choco",
  "p-churros",
  "p-pastafrola-g",
  "p-pastafrola-p",
  "p-milanesa-napo",
  "p-sandwich-mila",
  "p-pan-frances",
  "p-choripan",
  "p-emp-carne",
  "p-emp-espinaca",
  "p-emp-jq",
  "p-pizza-margarita",
  "p-pizza-especial",
  "p-pizza-queso",
  "p-ravioles",
  "p-parrilla-adulto",
  "p-parrilla-nino",
  "p-milhojas",
  "p-torta-cumple",
  // Nuevo lote de material (jul 2026): fotos reales
  "p-sandwich-miga",
  "p-pepas",
  "p-emp-pollo",
  // Extras del POS con foto real
  "p-super-sandwich-mila",
  "p-cremona",
  // Imágenes generadas con IA (jul 2026), watermark recortado
  "p-cafe-expresso", "p-cafe-leche", "p-latte", "p-capuchino", "p-chocolatada", "p-te", "p-mate-cocido", "p-tostadas",
  "p-jugo", "p-agua", "p-agua-perrier", "p-soda",
  "p-milanesa",
  "p-tarta-ricotta", "p-cremona-chica",
  "p-canelones", "p-noquis",
  "p-pizza-fugazzeta", "p-pizza-individual", "p-pre-pizza",
  "p-ensalada-mixta", "p-ensalada-rusa", "p-papas-fritas", "p-huevo-frito", "p-pan", "p-matambre",
  "p-conito",
]);
