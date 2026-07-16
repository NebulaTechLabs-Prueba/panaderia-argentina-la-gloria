// Genera los iconos de la app (favicon de pestaña + apple-icon) a partir del
// logo oficial public/logo.png, centrado en un lienzo cuadrado para que NO
// quede desplazado.  Uso: node scripts/gen-favicon.mjs
import sharp from "sharp";

const SRC = "public/logo.png";

const PNG_OPTS = { compressionLevel: 9, palette: true, quality: 90 };

// Favicon de la pestaña: logo centrado, fondo transparente, con un pequeño
// margen para que el círculo no toque los bordes. 256px alcanza de sobra
// para la pestaña (incluso en retina) y mantiene el archivo liviano.
await sharp(SRC)
  .resize(232, 232, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .extend({ top: 12, bottom: 12, left: 12, right: 12, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png(PNG_OPTS)
  .toFile("src/app/icon.png");

// apple-icon (home de iOS): tamaño estándar 180px. iOS no respeta
// transparencia (la vuelve negra), así que aplanamos sobre blanco.
await sharp(SRC)
  .resize(172, 172, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .extend({ top: 4, bottom: 4, left: 4, right: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .flatten({ background: "#ffffff" })
  .png(PNG_OPTS)
  .toFile("src/app/apple-icon.png");

console.log("OK: icon.png + apple-icon.png regenerados desde el logo oficial");
