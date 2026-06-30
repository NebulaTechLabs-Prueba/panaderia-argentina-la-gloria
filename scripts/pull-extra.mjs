// Pull de fotos reales nuevas: productos nuevos + ambiente (para el hero cinemático).
// Uso: node scripts/pull-extra.mjs
import sharp from "sharp";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const RAW = path.resolve("material-interno/C.P Panaderia Argentina la Gloria");
const OUT_PROD = path.resolve("public/img/productos");
const OUT_AMB = path.resolve("public/img/ambiente");
mkdirSync(OUT_AMB, { recursive: true });

// destino, fuente (relativa a RAW), tipo (prod 4:3 / amb 16:9)
const TAREAS = [
  // Productos nuevos (foto real)
  ["p-rogel", "Panaderia La Gloria/Rogel/WhatsApp Image 2025-10-23 at 3.25.23 PM.jpeg", "prod"],
  ["p-alfajor-santafesino", "Panaderia La Gloria/MATERIAL AGOSTO 2024/Santafesinos/ALFAJORES SANTAFESINOS.jpg", "prod"],
  ["p-masitas-finas", "Panaderia La Gloria/Masitas finas/WhatsApp Image 2025-10-16 at 10.08.59 AM (2).jpeg", "prod"],
  ["p-super-sandwich-mila", "Súper Sandwich de milanesa y  súper choripan/WhatsApp Image 2026-04-23 at 9.18.09 PM (1).jpeg", "prod"],
  ["p-pollo-asador", "Material Panaderia Diciembre 2025 Pollos/WhatsApp Image 2025-12-08 at 3.36.23 PM.jpeg", "prod"],
  // Ambiente (montaje del hero)
  ["amb-local", "Panaderia La Gloria/Nuevo local/466145881_10161903474656182_4183766466063416481_n.jpg", "amb"],
  ["amb-local2", "Panaderia La Gloria/Nuevo local/466164071_10161903474706182_3283728285587462873_n.jpg", "amb"],
  ["amb-asado", "Asado Fotos/WhatsApp Image 2025-06-23 at 3.46.44 PM.jpeg", "amb"],
  ["amb-inicios", "Panaderia La Gloria/Inicios de La Gloria/WhatsApp Image 2025-08-01 at 12.05.31 PM.jpeg", "amb"],
  ["amb-pizza", "Panaderia La Gloria/Pizzas/WhatsApp Image 2025-07-07 at 11.20.02 AM (1).jpeg", "amb"],
];

let ok = 0, fail = 0;
for (const [id, rel, tipo] of TAREAS) {
  const src = path.join(RAW, rel);
  if (!existsSync(src)) { console.log(`✗ FALTA: ${id} <- ${rel}`); fail++; continue; }
  const esProd = tipo === "prod";
  const out = path.join(esProd ? OUT_PROD : OUT_AMB, `${id}.jpg`);
  const [w, h] = esProd ? [1000, 750] : [1600, 900];
  try {
    const info = await sharp(src).rotate().resize(w, h, { fit: "cover", position: "attention" })
      .jpeg({ quality: esProd ? 78 : 72, mozjpeg: true }).toFile(out);
    console.log(`✓ ${tipo}/${id}.jpg (${Math.round(info.size / 1024)} KB)`); ok++;
  } catch (e) { console.log(`✗ ERROR ${id}: ${e.message}`); fail++; }
}
console.log(`\n${ok} ok, ${fail} con problema.`);
