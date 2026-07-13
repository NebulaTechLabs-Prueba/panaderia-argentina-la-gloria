// Datos mock de ajustes del negocio. Coincide con la fila única de `business_settings`.
// El número de WhatsApp es un PLACEHOLDER: reemplazar por el real del cliente.
export const ajustesMock = {
  nombre_negocio: "Panadería Argentina La Gloria",
  whatsapp_numero: "+15715804516", // número real del local
  moneda: "USD",
  moneda_simbolo: "$",
  mensaje_bienvenida:
    "Panadería, pastelería, pastas, pizzas y empanadas argentinas. Y los domingos, ¡parrilla libre! Armá tu pedido y lo coordinamos por WhatsApp.",
  // Plantilla del mensaje. {items}, {personas} y {total} se reemplazan al armar
  // el pedido. {personas} sólo aparece cuando son 2 o más comensales.
  mensaje_pedido_template:
    "¡Hola, familia de La Gloria! 🧡🥐\n\nMe encantaría encargarles lo siguiente:\n\n{items}\n\n{personas}🧾 Total: {total}\n\n¿Me confirman si está todo disponible y cómo hacemos con la entrega? ¡Mil gracias y sigan amasando con tanto cariño! 🇦🇷",
  portada_url: null,
  logo_url: "/logo.png", // logo oficial (extraído del manual de identidad)
  instagram_url: "https://instagram.com/panaderia.argentina_la.gloria_",
  tiktok_url: "https://www.tiktok.com/@panaderia_la.gloria",
  facebook_url: "https://www.facebook.com/p/Panadería-Argentina-La-Gloria-61552555974825/",
  direccion: "6100 Richmond Hwy, Alexandria, VA 22303",
  // Link de "¿Cómo llegar?" (configurable desde el admin). Si queda vacío, se arma
  // solo a partir de `direccion`.
  maps_url: "https://maps.app.goo.gl/PX1cBQu6r1MNXwm99",
  tagline: "Un cachito de Argentina, recién horneado.",
  horarios: {
    lun: "Cerrado",
    mar: "Cerrado",
    mie: "Cerrado",
    jue: "07:00–16:00",
    vie: "07:00–16:00",
    sab: "07:00–16:00",
    dom: "07:00–16:00",
  },
};
