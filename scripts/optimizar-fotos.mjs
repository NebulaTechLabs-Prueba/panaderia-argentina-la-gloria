// Procesa las mejores fotos reales del catálogo: recorte inteligente a 1000×750,
// JPEG optimizado, y las guarda como public/productos/p-<id>.jpg.
// Fuente: carpeta de material crudo (gitignorada). Uso: node scripts/optimizar-fotos.mjs
import sharp from "sharp";
import { existsSync } from "node:fs";
import path from "node:path";

const SRC = path.resolve(
  "public/productos/MATERIAL FAN PAGE-20260629T132148Z-3-001/MATERIAL FAN PAGE"
);
const OUT = path.resolve("public/productos");

// id de producto -> archivo fuente (basename) elegido por los clasificadores.
const MAPA = {
  "p-facturas": "Copia de DSC_5750-Enhanced-NR.jpg",
  "p-alfajor-maizena": "Copia de WhatsApp Image 2025-02-24 at 6.55.47 PM.jpeg",
  "p-alfajor-choco": "Copia de ALFAJORES CUBIERTOS DE CHOCOLATE.jpg",
  "p-churros": "Copia de IMG_20240302_122138_617.jpg",
  "p-pastafrola-g": "Copia de WhatsApp Image 2026-03-02 at 3.00.06 PM (2).jpeg",
  "p-pastafrola-p": "Copia de IMG_20240302_122140_197.jpg",
  "p-milanesa-napo": "Copia de photo_2025-01-21_11-13-18.jpg",
  "p-sandwich-mila": "Copia de WhatsApp Image 2026-04-23 at 9.18.09 PM.jpeg",
  "p-pan-frances": "Copia de WhatsApp Image 2025-07-02 at 9.37.39 AM (2).jpeg",
  "p-choripan": "Copia de WhatsApp Image 2026-04-23 at 9.18.37 PM.jpeg",
  "p-emp-carne": "Copia de WhatsApp Image 2025-07-02 at 9.46.13 AM.jpeg",
  "p-emp-espinaca": "Copia de unnamed (27).jpg",
  "p-emp-jq": "Copia de WhatsApp Image 2025-07-27 at 8.29.01 PM (2).jpeg",
  "p-pizza-margarita": "Copia de WhatsApp Image 2025-07-07 at 11.20.02 AM (2).jpeg",
  "p-pizza-especial": "Copia de WhatsApp Image 2025-07-07 at 11.20.02 AM.jpeg",
  "p-pizza-queso": "Copia de unnamed (4).jpg",
  "p-ravioles": "Copia de photo_2025-01-21_11-13-19.jpg",
  "p-parrilla-adulto": "Copia de unnamed (12).jpg",
  "p-parrilla-nino": "Copia de unnamed (3).jpg",
  "p-milhojas": "Copia de WhatsApp Image 2025-02-24 at 7.08.33 PM.jpeg",
  "p-torta-cumple": "Copia de WhatsApp Image 2025-06-30 at 2.42.12 PM.jpeg",
};

let ok = 0;
let fail = 0;
for (const [id, archivo] of Object.entries(MAPA)) {
  const src = path.join(SRC, archivo);
  if (!existsSync(src)) {
    console.log(`✗ FALTA fuente: ${id}  <-  ${archivo}`);
    fail++;
    continue;
  }
  const out = path.join(OUT, `${id}.jpg`);
  try {
    const info = await sharp(src)
      .rotate() // respeta orientación EXIF
      .resize(1000, 750, { fit: "cover", position: "attention" })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(out);
    console.log(`✓ ${id}.jpg  (${Math.round(info.size / 1024)} KB)`);
    ok++;
  } catch (e) {
    console.log(`✗ ERROR ${id}: ${e.message}`);
    fail++;
  }
}
console.log(`\nListo: ${ok} ok, ${fail} con problema.`);
