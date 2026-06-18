// El precio SIEMPRE se almacena como entero en centavos en la DB.
// Estas utilidades convierten/formatean para mostrar y para sumar el carrito.

// Convierte centavos (int) a número decimal de unidades. 1599 -> 15.99
export function centavosAUnidades(centavos) {
  return (Number(centavos) || 0) / 100;
}

// Formatea centavos a string legible según la moneda del negocio.
// Ej: formatCentavos(1599, { simbolo: "$" }) -> "$15.99"
export function formatCentavos(centavos, { simbolo = "$", moneda = "USD" } = {}) {
  const unidades = centavosAUnidades(centavos);
  // Intl da el separador de miles/decimales correcto; anteponemos el símbolo
  // del negocio para no depender de la configuración regional del navegador.
  const numero = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(unidades);
  return `${simbolo}${numero}`;
}

// Suma una lista de líneas del carrito ({ precio_centavos, cantidad }) en centavos.
export function totalCentavos(items) {
  return items.reduce(
    (acc, item) => acc + (Number(item.precio_centavos) || 0) * (Number(item.cantidad) || 0),
    0
  );
}
