// Categorías reales del menú de La Gloria (DEMO). La forma coincide 1:1 con la
// tabla `categories` de Supabase, así el reemplazo posterior no toca la UI.
//
// `slogan`     → subtítulo corto de la sección (eyebrow). Los marcados (real) son
//                textos PROPIOS del menú del local; el resto es copy editable.
// `texto`      → frase cálida/familiar (modismo leve) para la tarjeta de capítulo.
// `color`      → identidad de color: "naranja" | "celeste" | "carbon".
// `icono`      → clave del ícono de línea para el fallback (ver IconoCategoria).
// `refKeyword` → ⚠ legado (ya no se usa): keyword para fotos de referencia.
export const categoriasMock = [
  { id: "cat-cafeteria", nombre: "Cafetería", slug: "cafeteria", orden: 1, activa: true, slogan: "Recién hecho, como en el café de la esquina", texto: "Para arrancar el día como Dios manda, con olorcito a recién hecho.", color: "carbon", icono: "cafe", refKeyword: "coffee" },
  { id: "cat-bebidas", nombre: "Bebidas", slug: "bebidas", orden: 2, activa: true, slogan: "Para acompañar tu pedido", texto: "Algo fresquito para bajar todo, que nunca viene mal.", color: "celeste", icono: "bebida", refKeyword: "soda" },
  { id: "cat-milanesas", nombre: "Milanesas y Sándwiches", slug: "milanesas-sandwiches", orden: 3, activa: true, slogan: "Bien argentinas, bien servidas", texto: "De esas que llenan el alma (y la panza). Bien nuestras.", color: "naranja", icono: "sandwich", refKeyword: "schnitzel" },
  { id: "cat-pasteleria", nombre: "Pastelería y Postres", slug: "pasteleria-postres", orden: 4, activa: true, slogan: "Dulce de leche en todo lo que se pueda", texto: "El cierre dulce que no puede faltar. Pecá tranquilo, que vale la pena.", color: "celeste", icono: "factura", refKeyword: "croissant" },
  { id: "cat-pastas", nombre: "Pastas", slug: "pastas", orden: 5, activa: true, slogan: "El rincón del buen sabor", texto: "Como las de la nona, para la mesa del domingo en familia.", color: "carbon", icono: "pasta", refKeyword: "pasta" },
  { id: "cat-pizzas", nombre: "Pizzas", slug: "pizzas", orden: 6, activa: true, slogan: "Masa crocante y calentita", texto: "Masa casera y mucho mozzarella. Una pizza bien nuestra, ponele.", color: "naranja", icono: "pizza", refKeyword: "pizza" },
  { id: "cat-empanadas", nombre: "Empanadas", slug: "empanadas", orden: 7, activa: true, slogan: "Las joyitas de la corona", texto: "Jugosas y recién horneadas. De esas que pedís de a docenas.", color: "celeste", icono: "empanada", refKeyword: "empanada" },
  { id: "cat-parrilla", nombre: "Parrilla Libre (Domingos)", slug: "parrilla-libre", orden: 8, activa: true, slogan: "Todos los domingos, en familia", texto: "El ritual del domingo: fuego, asado y sobremesa bien larga.", color: "carbon", icono: "parrilla", refKeyword: "barbecue" },
];
