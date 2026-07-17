// Genera el SQL de seed para Supabase a partir de los mocks. Imprime a stdout.
// Uso: node scripts/gen-seed-sql.mjs
import { productosMock } from "../src/lib/data/mock/productos.js";
import { categoriasMock } from "../src/lib/data/mock/categorias.js";
import { ajustesMock } from "../src/lib/data/mock/ajustes.js";
import { IDS_CON_FOTO } from "../src/lib/data/imagenesLocales.js";

const q = (v) => (v === null || v === undefined ? "null" : "'" + String(v).replace(/'/g, "''") + "'");
const jb = (v) => (v === null || v === undefined ? "null" : "'" + JSON.stringify(v).replace(/'/g, "''") + "'::jsonb");
const b = (v) => (v ? "true" : "false");
const n = (v) => (v === null || v === undefined ? "0" : Number(v));

const out = [];

// categories
out.push("insert into public.categories (id,nombre,slug,orden,activa,slogan,texto,color,icono,ref_keyword) values");
out.push(
  categoriasMock
    .map((c) => `(${q(c.id)},${q(c.nombre)},${q(c.slug)},${n(c.orden)},${b(c.activa)},${q(c.slogan)},${q(c.texto)},${q(c.color)},${q(c.icono)},${q(c.refKeyword)})`)
    .join(",\n") + ";\n"
);

// products
out.push("insert into public.products (id,categoria_id,nombre,descripcion,precio_centavos,unidad,estimado,consultar,nota,variantes,imagen_url,disponible,destacado,orden,etiqueta) values");
out.push(
  productosMock
    .map((p) => {
      const img = IDS_CON_FOTO.has(p.id) ? `/img/productos/${p.id}.jpg` : null;
      return `(${q(p.id)},${q(p.categoria_id)},${q(p.nombre)},${q(p.descripcion)},${n(p.precio_centavos)},${q(p.unidad)},${b(p.estimado)},${b(p.consultar)},${q(p.nota)},${jb(p.variantes)},${q(img)},${b(p.disponible)},${b(p.destacado)},${n(p.orden)},${q(p.etiqueta)})`;
    })
    .join(",\n") + ";\n"
);

// business_settings (fila única id=1)
const a = ajustesMock;
out.push("insert into public.business_settings (id,nombre_negocio,whatsapp_numero,moneda,moneda_simbolo,mensaje_bienvenida,mensaje_pedido_template,portada_url,logo_url,instagram_url,tiktok_url,facebook_url,direccion,maps_url,tagline,horarios) values");
out.push(
  `(1,${q(a.nombre_negocio)},${q(a.whatsapp_numero)},${q(a.moneda)},${q(a.moneda_simbolo)},${q(a.mensaje_bienvenida)},${q(a.mensaje_pedido_template)},${q(a.portada_url)},${q(a.logo_url)},${q(a.instagram_url)},${q(a.tiktok_url)},${q(a.facebook_url)},${q(a.direccion)},${q(a.maps_url)},${q(a.tagline)},${jb(a.horarios)});\n`
);

// promos (seed único)
const promo = {
  id: "promo-facturas-cafe",
  nombre: "Facturas + café",
  descripcion: "Llevá 2 facturas y el café con leche va de regalo ☕",
  activa: true,
  vigencia: null,
  condicion: { tipo: "productos", productos: [{ producto_id: "p-facturas", cantidad: 2 }], monto_centavos: 0 },
  premio: [{ producto_id: "p-cafe-leche", cantidad: 1 }],
};
out.push("insert into public.promos (id,nombre,descripcion,activa,vigencia,condicion,premio,orden) values");
out.push(`(${q(promo.id)},${q(promo.nombre)},${q(promo.descripcion)},${b(promo.activa)},${jb(promo.vigencia)},${jb(promo.condicion)},${jb(promo.premio)},0);`);

console.log(out.join("\n"));
