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
  // Productos nuevos con foto real
  "p-rogel",
  "p-alfajor-santafesino",
  "p-masitas-finas",
  "p-super-sandwich-mila",
  "p-pollo-asador",
]);
