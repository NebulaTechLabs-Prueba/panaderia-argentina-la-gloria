// Productos reales del menú de La Gloria (DEMO).
// ⚠ TODOS los `precio_centavos` son PLACEHOLDER (el menú no trae precios). Se
//   muestran con un aviso de "precios de muestra" en la UI. Cargar los reales.
// `etiqueta` (opcional) pinta un badge, p. ej. "Orden previa". Sería una columna
//   más en la tabla `products` de Supabase.
export const productosMock = [
  // ── Cafetería ──────────────────────────────────────────────────────────────
  { id: "p-cafe-expresso", categoria_id: "cat-cafeteria", nombre: "Café expresso", descripcion: "", precio_centavos: 200, imagen_url: null, disponible: true, destacado: false, orden: 1, etiqueta: null },
  { id: "p-cafe-leche", categoria_id: "cat-cafeteria", nombre: "Café con leche", descripcion: "", precio_centavos: 250, imagen_url: null, disponible: true, destacado: false, orden: 2, etiqueta: null },
  { id: "p-latte", categoria_id: "cat-cafeteria", nombre: "Latte", descripcion: "", precio_centavos: 300, imagen_url: null, disponible: true, destacado: false, orden: 3, etiqueta: null },
  { id: "p-capuchino", categoria_id: "cat-cafeteria", nombre: "Capuchino", descripcion: "", precio_centavos: 300, imagen_url: null, disponible: true, destacado: false, orden: 4, etiqueta: null },
  { id: "p-chocolatada", categoria_id: "cat-cafeteria", nombre: "Chocolatada", descripcion: "", precio_centavos: 300, imagen_url: null, disponible: true, destacado: false, orden: 5, etiqueta: null },
  { id: "p-te", categoria_id: "cat-cafeteria", nombre: "Té", descripcion: "", precio_centavos: 180, imagen_url: null, disponible: true, destacado: false, orden: 6, etiqueta: null },
  { id: "p-mate-cocido", categoria_id: "cat-cafeteria", nombre: "Mate cocido", descripcion: "", precio_centavos: 180, imagen_url: null, disponible: true, destacado: false, orden: 7, etiqueta: null },
  { id: "p-tostadas", categoria_id: "cat-cafeteria", nombre: "Porción de tostadas", descripcion: "Con dulce de leche o manteca.", precio_centavos: 280, imagen_url: null, disponible: true, destacado: false, orden: 8, etiqueta: null },

  // ── Bebidas ────────────────────────────────────────────────────────────────
  { id: "p-jugo", categoria_id: "cat-bebidas", nombre: "Jugo", descripcion: "", precio_centavos: 250, imagen_url: null, disponible: true, destacado: false, orden: 1, etiqueta: null },
  { id: "p-agua", categoria_id: "cat-bebidas", nombre: "Agua embotellada", descripcion: "", precio_centavos: 150, imagen_url: null, disponible: true, destacado: false, orden: 2, etiqueta: null },
  { id: "p-agua-perrier", categoria_id: "cat-bebidas", nombre: "Agua Perrier", descripcion: "", precio_centavos: 350, imagen_url: null, disponible: true, destacado: false, orden: 3, etiqueta: null },
  { id: "p-soda", categoria_id: "cat-bebidas", nombre: "Soda", descripcion: "", precio_centavos: 150, imagen_url: null, disponible: true, destacado: false, orden: 4, etiqueta: null },

  // ── Milanesas y Sándwiches ───────────────────────────────────────────────────
  { id: "p-milanesa", categoria_id: "cat-milanesas", nombre: "Milanesa", descripcion: "Milanesa de carne o pollo con papas fritas.", precio_centavos: 950, imagen_url: null, disponible: true, destacado: true, orden: 1, etiqueta: null },
  { id: "p-milanesa-napo", categoria_id: "cat-milanesas", nombre: "Milanesa Napolitana", descripcion: "Carne o pollo con salsa de tomate, jamón, queso. Con papas fritas o ensalada mixta.", precio_centavos: 1150, imagen_url: null, disponible: true, destacado: true, orden: 2, etiqueta: null },
  { id: "p-sandwich-mila", categoria_id: "cat-milanesas", nombre: "Sándwich de Milanesa", descripcion: "Milanesa de carne o pollo, mozzarella, jamón, lechuga, tomate y huevo frito.", precio_centavos: 900, imagen_url: null, disponible: true, destacado: false, orden: 3, etiqueta: null },
  { id: "p-choripan", categoria_id: "cat-milanesas", nombre: "Choripán", descripcion: "Chorizo, chimichurri, lechuga, tomate y salsa criolla.", precio_centavos: 650, imagen_url: null, disponible: true, destacado: false, orden: 4, etiqueta: null },
  { id: "p-pan-frances", categoria_id: "cat-milanesas", nombre: "Pan Francés", descripcion: "Jamón crudo o cocido y queso.", precio_centavos: 600, imagen_url: null, disponible: true, destacado: false, orden: 5, etiqueta: null },
  { id: "p-sandwich-miga", categoria_id: "cat-milanesas", nombre: "Sándwich de Miga", descripcion: "Surtidos.", precio_centavos: 500, imagen_url: null, disponible: true, destacado: false, orden: 6, etiqueta: "Orden previa" },

  // ── Pastelería y Postres ─────────────────────────────────────────────────────
  { id: "p-alfajor-maizena", categoria_id: "cat-pasteleria", nombre: "Alfajores de Maizena", descripcion: "Alfajor de maicena relleno con dulce de leche.", precio_centavos: 150, imagen_url: null, disponible: true, destacado: true, orden: 1, etiqueta: null },
  { id: "p-alfajor-choco", categoria_id: "cat-pasteleria", nombre: "Alfajor de Chocolate", descripcion: "Relleno de dulce de leche, pistacho, frutos rojos, matecol, o ron y nuez.", precio_centavos: 200, imagen_url: null, disponible: true, destacado: false, orden: 2, etiqueta: null },
  { id: "p-conito", categoria_id: "cat-pasteleria", nombre: "Conito", descripcion: "Relleno de dulce de leche, cubierto en chocolate.", precio_centavos: 180, imagen_url: null, disponible: true, destacado: false, orden: 3, etiqueta: null },
  { id: "p-pastafrola-g", categoria_id: "cat-pasteleria", nombre: "Pastafrola (Grande)", descripcion: "Membrillo o batata.", precio_centavos: 1200, imagen_url: null, disponible: true, destacado: false, orden: 4, etiqueta: null },
  { id: "p-pastafrola-p", categoria_id: "cat-pasteleria", nombre: "Pastafrola (Pequeña)", descripcion: "Membrillo o batata.", precio_centavos: 700, imagen_url: null, disponible: true, destacado: false, orden: 5, etiqueta: null },
  { id: "p-tarta-ricotta", categoria_id: "cat-pasteleria", nombre: "Tarta de Ricotta", descripcion: "Nuestra tradicional tarta de ricotta.", precio_centavos: 1300, imagen_url: null, disponible: true, destacado: true, orden: 6, etiqueta: null },
  { id: "p-facturas", categoria_id: "cat-pasteleria", nombre: "Facturas", descripcion: "Crema pastelera, dulce de leche o membrillo.", precio_centavos: 110, imagen_url: null, disponible: true, destacado: false, orden: 7, etiqueta: null },
  { id: "p-milhojas", categoria_id: "cat-pasteleria", nombre: "Milhojas / Chajá / Brazo Gitano", descripcion: "", precio_centavos: 1500, imagen_url: null, disponible: true, destacado: false, orden: 8, etiqueta: "Orden previa" },
  { id: "p-churros", categoria_id: "cat-pasteleria", nombre: "Churros y Bolas de Fraile", descripcion: "Azucarados o rellenos con dulce de leche.", precio_centavos: 120, imagen_url: null, disponible: true, destacado: false, orden: 9, etiqueta: null },
  { id: "p-pepas", categoria_id: "cat-pasteleria", nombre: "Pepas", descripcion: "Membrillo o batata.", precio_centavos: 90, imagen_url: null, disponible: true, destacado: false, orden: 10, etiqueta: null },
  { id: "p-torta-cumple", categoria_id: "cat-pasteleria", nombre: "Torta de Cumpleaños", descripcion: "A pedido, según ocasión.", precio_centavos: 4500, imagen_url: null, disponible: true, destacado: false, orden: 11, etiqueta: "Orden previa" },

  // ── Pastas ───────────────────────────────────────────────────────────────────
  { id: "p-canelones", categoria_id: "cat-pastas", nombre: "Canelones", descripcion: "Canelones de pollo y ricotta en salsa bolognesa.", precio_centavos: 1400, imagen_url: null, disponible: true, destacado: true, orden: 1, etiqueta: null },
  { id: "p-noquis", categoria_id: "cat-pastas", nombre: "Ñoquis", descripcion: "Ñoquis de papa con salsa bolognesa.", precio_centavos: 1200, imagen_url: null, disponible: true, destacado: false, orden: 2, etiqueta: null },
  { id: "p-ravioles", categoria_id: "cat-pastas", nombre: "Ravioles", descripcion: "Ravioles cuatro quesos con salsa bolognesa.", precio_centavos: 1300, imagen_url: null, disponible: true, destacado: false, orden: 3, etiqueta: null },

  // ── Pizzas ────────────────────────────────────────────────────────────────────
  { id: "p-pizza-margarita", categoria_id: "cat-pizzas", nombre: "Margarita", descripcion: "Masa casera, salsa de tomate, jamón, queso, rodajas de tomate, aceitunas y salsa verde (perejil, ajo, albahaca).", precio_centavos: 1600, imagen_url: null, disponible: true, destacado: true, orden: 1, etiqueta: null },
  { id: "p-pizza-especial", categoria_id: "cat-pizzas", nombre: "Especial", descripcion: "Masa casera, salsa de tomate, jamón, queso, morrón, aceituna y huevo picado.", precio_centavos: 1800, imagen_url: null, disponible: true, destacado: false, orden: 2, etiqueta: null },
  { id: "p-pizza-fugazzeta", categoria_id: "cat-pizzas", nombre: "Fugazzeta", descripcion: "Masa casera, cebolla frita y topping a elección.", precio_centavos: 1700, imagen_url: null, disponible: true, destacado: false, orden: 3, etiqueta: null },
  { id: "p-pizza-queso", categoria_id: "cat-pizzas", nombre: "Solo Queso", descripcion: "Masa casera, salsa de tomate y queso.", precio_centavos: 1400, imagen_url: null, disponible: true, destacado: false, orden: 4, etiqueta: null },

  // ── Empanadas ─────────────────────────────────────────────────────────────────
  { id: "p-emp-carne", categoria_id: "cat-empanadas", nombre: "Empanada de Carne", descripcion: "Carne, cebolla, huevo y aceituna.", precio_centavos: 250, imagen_url: null, disponible: true, destacado: true, orden: 1, etiqueta: null },
  { id: "p-emp-espinaca", categoria_id: "cat-empanadas", nombre: "Empanada de Espinaca", descripcion: "Espinaca, salsa blanca y queso.", precio_centavos: 250, imagen_url: null, disponible: true, destacado: false, orden: 2, etiqueta: null },
  { id: "p-emp-jq", categoria_id: "cat-empanadas", nombre: "Empanada de Jamón y Queso", descripcion: "Jamón y queso.", precio_centavos: 250, imagen_url: null, disponible: true, destacado: false, orden: 3, etiqueta: null },
  { id: "p-emp-pollo", categoria_id: "cat-empanadas", nombre: "Empanada de Pollo", descripcion: "Pollo, cebolla, huevo y aceitunas.", precio_centavos: 250, imagen_url: null, disponible: true, destacado: false, orden: 4, etiqueta: null },

  // ── Parrilla Libre de los Domingos ──────────────────────────────────────────────
  { id: "p-parrilla-adulto", categoria_id: "cat-parrilla", nombre: "Parrilla Libre — Adulto", descripcion: "Almuerzo por persona: empanada, ensalada rusa, ensalada mixta, berenjenas en escabeche, pan casero, parrillada libre y bebida libre.", precio_centavos: 3500, imagen_url: null, disponible: true, destacado: true, orden: 1, etiqueta: "Solo domingos" },
  { id: "p-parrilla-nino", categoria_id: "cat-parrilla", nombre: "Parrilla Libre — Niño", descripcion: "Menores de 12 años. Mismo almuerzo por persona. El buffet se cobra a todos los ocupantes de la mesa salvo que pidan otro menú.", precio_centavos: 2000, imagen_url: null, disponible: true, destacado: false, orden: 2, etiqueta: "Solo domingos" },
  { id: "p-pollo-asador", categoria_id: "cat-parrilla", nombre: "Pollo al asador", descripcion: "Pollo entero dorado al asador.", precio_centavos: 1800, imagen_url: null, disponible: true, destacado: false, orden: 3, etiqueta: "Por encargo" },
  { id: "p-lechon-asador", categoria_id: "cat-parrilla", nombre: "Lechón al asador", descripcion: "Lechón crocante al asador, para celebrar.", precio_centavos: 6500, imagen_url: null, disponible: true, destacado: false, orden: 4, etiqueta: "Por encargo" },

  // ── Productos nuevos (material 2024–2026) ────────────────────────────────────────
  { id: "p-rogel", categoria_id: "cat-pasteleria", nombre: "Rogel", descripcion: "Capas finas crocantes, mucho dulce de leche y merengue.", precio_centavos: 3200, imagen_url: null, disponible: true, destacado: true, orden: 12, etiqueta: null },
  { id: "p-alfajor-santafesino", categoria_id: "cat-pasteleria", nombre: "Alfajor Santafesino", descripcion: "Tapas hojaldradas, dulce de leche y glasé.", precio_centavos: 200, imagen_url: null, disponible: true, destacado: false, orden: 13, etiqueta: null },
  { id: "p-masitas-finas", categoria_id: "cat-pasteleria", nombre: "Masitas finas", descripcion: "Surtido de masas secas finas para la mesa.", precio_centavos: 1400, imagen_url: null, disponible: true, destacado: false, orden: 14, etiqueta: null },
  { id: "p-cremona", categoria_id: "cat-pasteleria", nombre: "Cremona", descripcion: "Hojaldrada y crocante, clásica de panadería.", precio_centavos: 160, imagen_url: null, disponible: true, destacado: false, orden: 15, etiqueta: null },
  { id: "p-panettone", categoria_id: "cat-pasteleria", nombre: "Pan dulce (Panettone)", descripcion: "Artesanal, con frutas y nueces.", precio_centavos: 2200, imagen_url: null, disponible: true, destacado: false, orden: 16, etiqueta: "De temporada" },
  { id: "p-super-sandwich-mila", categoria_id: "cat-milanesas", nombre: "Súper Sándwich de Milanesa", descripcion: "La versión XL: milanesa, queso, jamón, lechuga, tomate y huevo.", precio_centavos: 1300, imagen_url: null, disponible: true, destacado: true, orden: 7, etiqueta: null },
  { id: "p-super-choripan", categoria_id: "cat-milanesas", nombre: "Súper Choripán", descripcion: "Choripán XL con chimichurri y salsa criolla.", precio_centavos: 950, imagen_url: null, disponible: true, destacado: false, orden: 8, etiqueta: null },
];
