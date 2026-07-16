// Genera los iconos de la app (favicon de pestaña + apple-icon) a partir del
// logo oficial public/logo.png, centrado en un lienzo cuadrado para que NO
// quede desplazado.  Uso: node scripts/gen-favicon.mjs
import sharp from "sharp";

const SRC = "public/logo.png";

// Favicon de la pestaña: logo centrado, fondo transparente, con un pequeño
// margen para que el círculo no toque los bordes.
await sharp(SRC)
  .resize(480, 480, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .extend({ top: 16, bottom: 16, left: 16, right: 16, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile("src/app/icon.png");

// apple-icon (home de iOS): iOS no respeta transparencia (la vuelve negra),
// así que aplanamos sobre blanco.
await sharp(SRC)
  .resize(496, 496, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .extend({ top: 8, bottom: 8, left: 8, right: 8, background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .flatten({ background: "#ffffff" })
  .png()
  .toFile("src/app/apple-icon.png");

console.log("OK: icon.png + apple-icon.png regenerados desde el logo oficial");
