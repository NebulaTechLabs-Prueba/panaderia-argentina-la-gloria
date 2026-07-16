// Genera el favicon PNG (fallback) y previews desde src/app/icon.svg.
// Uso: node scripts/gen-favicon.mjs
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const svg = await readFile("src/app/icon.svg");

// Fallback PNG de alta resolución (Next lo sirve para navegadores sin SVG).
await sharp(svg, { density: 384 }).resize(512, 512).png().toFile("src/app/icon.png");

// Previews para revisar legibilidad a tamaños reales de pestaña.
await sharp(svg, { density: 384 }).resize(96, 96).png().toFile("scripts/_preview-96.png");
await sharp(svg, { density: 384 }).resize(32, 32).png().toFile("scripts/_preview-32.png");
await sharp(svg, { density: 384 }).resize(16, 16).png().resize(96, 96, { kernel: "nearest" }).png().toFile("scripts/_preview-16-zoom.png");

console.log("OK: icon.png (512) + previews generados");
