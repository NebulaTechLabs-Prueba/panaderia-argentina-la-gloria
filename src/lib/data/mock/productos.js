// Productos del menú de La Gloria.
// `precio_centavos`: precio real del POS (jul 2026). `estimado: true` = no figuraba
//   en el POS, precio tentativo a confirmar (se distingue en la UI).
// `unidad`: cómo se cobra — "uni" | "porcion" | "media-docena" | "docena" | "lb" |
//   "variable". Se muestra como sufijo del precio.
export const productosMock = [
  // ── Cafetería ──────────────────────────────────────────────────────────────
  { id: "p-cafe-expresso", categoria_id: "cat-cafeteria", nombre: "Café expresso", descripcion: "", precio_centavos: 500, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 1, etiqueta: null },
  { id: "p-cafe-leche", categoria_id: "cat-cafeteria", nombre: "Café con leche", descripcion: "", precio_centavos: 600, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 2, etiqueta: null },
  { id: "p-latte", categoria_id: "cat-cafeteria", nombre: "Latte", descripcion: "", precio_centavos: 600, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 3, etiqueta: null },
  { id: "p-capuchino", categoria_id: "cat-cafeteria", nombre: "Capuchino", descripcion: "", precio_centavos: 600, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 4, etiqueta: null },
  { id: "p-chocolatada", categoria_id: "cat-cafeteria", nombre: "Chocolatada", descripcion: "", precio_centavos: 600, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 5, etiqueta: null },
  { id: "p-te", categoria_id: "cat-cafeteria", nombre: "Té", descripcion: "", precio_centavos: 300, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 6, etiqueta: null },
  { id: "p-mate-cocido", categoria_id: "cat-cafeteria", nombre: "Mate cocido", descripcion: "", precio_centavos: 300, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 7, etiqueta: null },
  { id: "p-tostadas", categoria_id: "cat-cafeteria", nombre: "Porción de tostadas", descripcion: "Con dulce de leche o manteca.", precio_centavos: 300, unidad: "porcion", estimado: true, imagen_url: null, disponible: true, destacado: false, orden: 8, etiqueta: null },

  // ── Bebidas ────────────────────────────────────────────────────────────────
  { id: "p-jugo", categoria_id: "cat-bebidas", nombre: "Jugo", descripcion: "", precio_centavos: 300, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 1, etiqueta: null },
  { id: "p-agua", categoria_id: "cat-bebidas", nombre: "Agua embotellada", descripcion: "", precio_centavos: 200, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 2, etiqueta: null },
  { id: "p-agua-perrier", categoria_id: "cat-bebidas", nombre: "Agua Perrier", descripcion: "", precio_centavos: 450, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 3, etiqueta: null },
  { id: "p-soda", categoria_id: "cat-bebidas", nombre: "Soda", descripcion: "", precio_centavos: 300, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 4, etiqueta: null },

  // ── Milanesas y Sándwiches ───────────────────────────────────────────────────
  { id: "p-milanesa", categoria_id: "cat-milanesas", nombre: "Milanesa", descripcion: "Milanesa de carne o pollo con papas fritas. (Carne $19.99 / pollo $17.99).", precio_centavos: 1999, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: true, orden: 1, etiqueta: null },
  { id: "p-milanesa-napo", categoria_id: "cat-milanesas", nombre: "Milanesa Napolitana", descripcion: "Carne o pollo con salsa de tomate, jamón, queso. Con papas fritas o ensalada mixta.", precio_centavos: 2699, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: true, orden: 2, etiqueta: null },
  { id: "p-choripan", categoria_id: "cat-milanesas", nombre: "Choripán", descripcion: "Chorizo, chimichurri, lechuga, tomate y salsa criolla.", precio_centavos: 2000, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 4, etiqueta: null },
  { id: "p-pan-frances", categoria_id: "cat-milanesas", nombre: "Pan Francés", descripcion: "Jamón crudo o cocido y queso.", precio_centavos: 0, unidad: "uni", estimado: false, consultar: true, imagen_url: null, disponible: true, destacado: false, orden: 5, etiqueta: null },
  { id: "p-sandwich-miga", categoria_id: "cat-milanesas", nombre: "Sándwich de Miga Surtido", descripcion: "Surtidos. Unidad $3.50, ½ docena $20, docena $35.", precio_centavos: 350, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 6, etiqueta: "Orden previa" },

  // ── Pastelería y Postres ─────────────────────────────────────────────────────
  { id: "p-alfajor-maizena", categoria_id: "cat-pasteleria", nombre: "Alfajores de Maizena", descripcion: "Alfajor de maicena relleno con dulce de leche. (Grande $8).", precio_centavos: 350, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: true, orden: 1, etiqueta: null },
  { id: "p-alfajor-choco", categoria_id: "cat-pasteleria", nombre: "Alfajor de Chocolate", descripcion: "Relleno de dulce de leche, pistacho, frutos rojos, matecol, o ron y nuez.", precio_centavos: 800, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 2, etiqueta: null },
  { id: "p-conito", categoria_id: "cat-pasteleria", nombre: "Conito", descripcion: "Relleno de dulce de leche, cubierto en chocolate.", precio_centavos: 300, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 3, etiqueta: null },
  { id: "p-pastafrola-g", categoria_id: "cat-pasteleria", nombre: "Pastafrola (Grande)", descripcion: "Membrillo o batata.", precio_centavos: 2500, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 4, etiqueta: null },
  { id: "p-pastafrola-p", categoria_id: "cat-pasteleria", nombre: "Pastafrola (Pequeña)", descripcion: "Membrillo o batata.", precio_centavos: 700, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 5, etiqueta: null },
  { id: "p-tarta-ricotta", categoria_id: "cat-pasteleria", nombre: "Tarta de Ricotta", descripcion: "Nuestra tradicional tarta de ricotta.", precio_centavos: 2500, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: true, orden: 6, etiqueta: null },
  { id: "p-facturas", categoria_id: "cat-pasteleria", nombre: "Facturas", descripcion: "Crema pastelera, dulce de leche o membrillo. Unidad $2.75, ½ docena $14, docena $27.", precio_centavos: 275, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 7, etiqueta: null },
  { id: "p-milhojas", categoria_id: "cat-pasteleria", nombre: "Milhojas / Chajá / Brazo Gitano", descripcion: "Pedido mínimo: 2 porciones.", precio_centavos: 1000, unidad: "porcion", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 8, etiqueta: "Orden previa" },
  { id: "p-churros", categoria_id: "cat-pasteleria", nombre: "Churros y Bolas de Fraile", descripcion: "Azucarados o rellenos con dulce de leche.", precio_centavos: 275, unidad: "uni", estimado: true, imagen_url: null, disponible: true, destacado: false, orden: 9, etiqueta: null },
  { id: "p-pepas", categoria_id: "cat-pasteleria", nombre: "Pepas", descripcion: "Membrillo o batata.", precio_centavos: 100, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 10, etiqueta: null },
  { id: "p-torta-cumple", categoria_id: "cat-pasteleria", nombre: "Torta de Cumpleaños", descripcion: "A pedido, según ocasión. Pedido mínimo: 5 porciones.", precio_centavos: 1000, unidad: "porcion", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 11, etiqueta: "Orden previa" },

  // ── Pastas (por porción) ─────────────────────────────────────────────────────
  { id: "p-canelones", categoria_id: "cat-pastas", nombre: "Canelones", descripcion: "Canelones de pollo y ricotta en salsa bolognesa.", precio_centavos: 2900, unidad: "porcion", estimado: false, imagen_url: null, disponible: true, destacado: true, orden: 1, etiqueta: null },
  { id: "p-noquis", categoria_id: "cat-pastas", nombre: "Ñoquis", descripcion: "Ñoquis de papa con salsa bolognesa.", precio_centavos: 2599, unidad: "porcion", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 2, etiqueta: null },
  { id: "p-ravioles", categoria_id: "cat-pastas", nombre: "Ravioles", descripcion: "Ravioles cuatro quesos con salsa bolognesa.", precio_centavos: 2599, unidad: "porcion", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 3, etiqueta: null },

  // ── Pizzas ────────────────────────────────────────────────────────────────────
  { id: "p-pizza-margarita", categoria_id: "cat-pizzas", nombre: "Margarita", descripcion: "Masa casera, salsa de tomate, jamón, queso, rodajas de tomate, aceitunas y salsa verde (perejil, ajo, albahaca).", precio_centavos: 2699, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: true, orden: 1, etiqueta: null },
  { id: "p-pizza-especial", categoria_id: "cat-pizzas", nombre: "Especial", descripcion: "Masa casera, salsa de tomate, jamón, queso, morrón, aceituna y huevo picado.", precio_centavos: 2699, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 2, etiqueta: null },
  { id: "p-pizza-fugazzeta", categoria_id: "cat-pizzas", nombre: "Fugazzeta", descripcion: "Masa casera, cebolla frita y topping a elección.", precio_centavos: 2299, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 3, etiqueta: null },
  { id: "p-pizza-queso", categoria_id: "cat-pizzas", nombre: "Solo Queso", descripcion: "Masa casera, salsa de tomate y queso.", precio_centavos: 2299, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 4, etiqueta: null },

  // ── Empanadas (unidad $6 · docena $72) ───────────────────────────────────────
  { id: "p-emp-carne", categoria_id: "cat-empanadas", nombre: "Empanada de Carne", descripcion: "Carne, cebolla, huevo y aceituna. Docena $72.", precio_centavos: 600, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: true, orden: 1, etiqueta: null },
  { id: "p-emp-espinaca", categoria_id: "cat-empanadas", nombre: "Empanada de Espinaca", descripcion: "Espinaca, salsa blanca y queso. Docena $72.", precio_centavos: 600, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 2, etiqueta: null },
  { id: "p-emp-jq", categoria_id: "cat-empanadas", nombre: "Empanada de Jamón y Queso", descripcion: "Jamón y queso. Docena $72.", precio_centavos: 600, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 3, etiqueta: null },
  { id: "p-emp-pollo", categoria_id: "cat-empanadas", nombre: "Empanada de Pollo", descripcion: "Pollo, cebolla, huevo y aceitunas. Docena $72.", precio_centavos: 600, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 4, etiqueta: null },

  // ── Parrilla Libre de los Domingos ──────────────────────────────────────────────
  { id: "p-parrilla-adulto", categoria_id: "cat-parrilla", nombre: "Parrilla Libre — Adulto", descripcion: "Almuerzo por persona: empanada, ensalada rusa, ensalada mixta, berenjenas en escabeche, pan casero, parrillada libre y bebida libre.", precio_centavos: 3999, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: true, orden: 1, etiqueta: "Solo domingos" },
  { id: "p-parrilla-nino", categoria_id: "cat-parrilla", nombre: "Parrilla Libre — Niño", descripcion: "Menores de 12 años. Mismo almuerzo por persona. El buffet se cobra a todos los ocupantes de la mesa salvo que pidan otro menú.", precio_centavos: 1999, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 2, etiqueta: "Solo domingos" },

  // ── Extras del POS (no están en el menú 6-1/6-2, pero sí en la lista de precios) ──
  { id: "p-cremona", categoria_id: "cat-pasteleria", nombre: "Cremona", descripcion: "Hojaldrada y crocante, clásica de panadería.", precio_centavos: 1200, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 12, etiqueta: null },
  { id: "p-super-sandwich-mila", categoria_id: "cat-milanesas", nombre: "Súper Sándwich de Milanesa", descripcion: "Versión XL (POS: “Sandwich grande”): milanesa, queso, jamón, lechuga, tomate y huevo.", precio_centavos: 2699, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: true, orden: 7, etiqueta: null },

  // ── Ítems del POS que no están en el menú impreso (se agregan por ser fuente de verdad) ──
  { id: "p-pizza-individual", categoria_id: "cat-pizzas", nombre: "Pizza Individual", descripcion: "Pizza personal de masa casera.", precio_centavos: 1399, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 5, etiqueta: null },
  { id: "p-pre-pizza", categoria_id: "cat-pizzas", nombre: "Pre pizza", descripcion: "Base de masa casera prehorneada para armar en casa.", precio_centavos: 900, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 6, etiqueta: null },
  { id: "p-cremona-chica", categoria_id: "cat-pasteleria", nombre: "Cremona chica", descripcion: "Cremona pequeña, se vende por peso.", precio_centavos: 0, unidad: "variable", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 13, etiqueta: null },
  { id: "p-ensalada-mixta", categoria_id: "cat-guarniciones", nombre: "Ensalada mixta", descripcion: "Lechuga, tomate y cebolla.", precio_centavos: 500, unidad: "porcion", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 1, etiqueta: null },
  { id: "p-ensalada-rusa", categoria_id: "cat-guarniciones", nombre: "Ensalada rusa", descripcion: "Papa, zanahoria, arvejas y mayonesa.", precio_centavos: 750, unidad: "porcion", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 2, etiqueta: null },
  { id: "p-papas-fritas", categoria_id: "cat-guarniciones", nombre: "Papas fritas", descripcion: "Porción de papas fritas.", precio_centavos: 600, unidad: "porcion", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 3, etiqueta: null },
  { id: "p-huevo-frito", categoria_id: "cat-guarniciones", nombre: "Huevo frito", descripcion: "Para sumar a tu plato.", precio_centavos: 300, unidad: "uni", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 4, etiqueta: null },
  { id: "p-pan", categoria_id: "cat-guarniciones", nombre: "Pan casero", descripcion: "Pan casero, se vende por peso.", precio_centavos: 0, unidad: "variable", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 5, etiqueta: null },
  { id: "p-matambre", categoria_id: "cat-guarniciones", nombre: "Matambre", descripcion: "Matambre casero.", precio_centavos: 2500, unidad: "lb", estimado: false, imagen_url: null, disponible: true, destacado: false, orden: 6, etiqueta: null },

  // ── Alta pedida por el cliente ──────────────────────────────────────────────────
  { id: "p-rogel", categoria_id: "cat-pasteleria", nombre: "Rogel", descripcion: "Capas finas crocantes, mucho dulce de leche y merengue.", precio_centavos: 0, unidad: "uni", estimado: false, consultar: true, imagen_url: null, disponible: true, destacado: true, orden: 14, etiqueta: null },
];
