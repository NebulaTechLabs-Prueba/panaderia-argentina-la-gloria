"use client";

import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { IconoCategoria } from "./IconoCategoria";
import { header as headerColor } from "./catColors";

// Grilla de productos. Si `agrupar` es true, muestra una sección por categoría
// (vista "Todo") con su slogan; si no, una sola grilla de la categoría elegida.
export function ProductGrid({ categorias, productos, agrupar, onAbrirDetalle }) {
  const catPorId = Object.fromEntries(categorias.map((c) => [c.id, c]));

  function grilla(lista) {
    return (
      <motion.div layout className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {lista.map((p) => (
          <ProductCard
            key={p.id}
            producto={p}
            categoria={catPorId[p.categoria_id]}
            onAbrirDetalle={onAbrirDetalle}
          />
        ))}
      </motion.div>
    );
  }

  if (!agrupar) return grilla(productos);

  return (
    <div className="space-y-12">
      {categorias.map((cat) => {
        const items = productos.filter((p) => p.categoria_id === cat.id);
        if (items.length === 0) return null;
        return (
          <section key={cat.id} id={cat.slug} className="scroll-mt-24">
            <div className="mb-5 flex items-center gap-3">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${headerColor(cat.color)}`}>
                <IconoCategoria icono={cat.icono} className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-extrabold leading-none text-cacao">
                  {cat.nombre}
                </h2>
                {cat.slogan && (
                  <p className="mt-0.5 text-sm font-medium italic text-corteza">{cat.slogan}</p>
                )}
              </div>
            </div>
            {grilla(items)}
          </section>
        );
      })}
    </div>
  );
}

// Esqueleto de carga mientras llegan los datos.
export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-3xl bg-white ring-1 ring-cacao/5">
          <div className="aspect-4/3 animate-pulse bg-masa" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-masa" />
            <div className="h-3 w-full animate-pulse rounded bg-masa" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-masa" />
          </div>
        </div>
      ))}
    </div>
  );
}
