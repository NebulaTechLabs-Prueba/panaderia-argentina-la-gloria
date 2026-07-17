// Procesa el lote "Nuevo lote de cambios" (jul 2026) al formato del catálogo:
// 1000×750 cover, JPEG mozjpeg q78 → public/img/productos/p-<id>.jpg.
// Uso: node scripts/procesar-lote-cambios.mjs
import sharp from "sharp";
import { existsSync } from "node:fs";
import path from "node:path";

const SRC = path.resolve("material-interno/Nuevo lote de cambios");
const OUT = path.resolve("public/img/productos");

// archivo fuente -> id de producto destino
const MAPA = {
  "cuernito.jpeg": "p-cuernitos", // alta
  "sándwich de miga jamón y queso.jpeg": "p-sandwich-miga-jyq", // alta
  "churros.jpeg": "p-churros", // reemplazo (foto era bolas de fraile)
  "conito.jpeg": "p-conito", // reemplazo
  "pan casero.jpeg": "p-pan", // reemplazo
  "pastralofa grande.jpeg": "p-pastafrola-g", // reemplazo
};

let ok = 0, fail = 0;
for (const [archivo, id] of Object.entries(MAPA)) {
  const src = path.join(SRC, archivo);
  if (!existsSync(src)) { console.log(`✗ FALTA: ${archivo}`); fail++; continue; }
  try {
    const info = await sharp(src)
      .rotate()
      .resize(1000, 750, { fit: "cover", position: "attention" })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(path.join(OUT, `${id}.jpg`));
    console.log(`✓ ${id}.jpg  (${Math.round(info.size / 1024)} KB)`);
    ok++;
  } catch (e) { console.log(`✗ ERROR ${id}: ${e.message}`); fail++; }
}
console.log(`\nListo: ${ok} ok, ${fail} con problema.`);
