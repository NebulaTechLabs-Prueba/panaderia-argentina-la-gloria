"use client";

import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { ProductImage } from "./ProductImage";
import { formatCentavos } from "@/lib/money/formatCentavos";
import { useCarrito } from "@/modules/carrito/CarritoProvider";
import { useMoneda } from "@/modules/negocio/NegocioProvider";

// Tarjeta de producto. Click en la tarjeta abre el detalle (modal); el botón "+"
// agrega directo al pedido sin abrir nada (camino de pocos clicks).
export function ProductCard({ producto, categoria, onAbrirDetalle }) {
  const { agregar } = useCarrito();
  const moneda = useMoneda();
  const [agregado, setAgregado] = useState(false);
  const disponible = producto.disponible;

  function agregarRapido(e) {
    e.stopPropagation();
    if (!disponible) return;
    agregar(producto, 1);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1100);
  }

  return (
    <motion.article
      layout
      onClick={() => onAbrirDetalle(producto)}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.99 }}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-[0_2px_0_rgba(0,0,0,0.04)] ring-1 ring-cacao/8 transition-shadow hover:shadow-xl hover:ring-corteza/40 ${
        disponible ? "" : "opacity-75"
      }`}
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <ProductImage
          src={producto.imagen_url}
          alt={producto.nombre}
          color={categoria?.color}
          icono={categoria?.icono}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {!disponible && (
          <span className="absolute left-3 top-3 rounded-full bg-cacao/85 px-2.5 py-1 text-xs font-semibold text-cream">
            Agotado
          </span>
        )}
        {disponible && producto.etiqueta && (
          <span className="absolute left-3 top-3 rounded-full bg-corteza px-2.5 py-1 text-xs font-bold text-cacao shadow-sm">
            {producto.etiqueta}
          </span>
        )}
        {producto.destacado && disponible && !producto.etiqueta && (
          <span className="absolute left-3 top-3 rounded-full bg-celeste px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            ★ Favorito
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-bold leading-tight text-cacao">
          {producto.nombre}
        </h3>
        {producto.descripcion && (
          <p className="mt-1 line-clamp-2 text-sm text-cacao/55">{producto.descripcion}</p>
        )}

        <div className="mt-3 flex items-end justify-between pt-1">
          <span className="rounded-xl bg-cream px-2.5 py-1 font-display text-xl font-extrabold text-cacao ring-1 ring-corteza/30">
            {formatCentavos(producto.precio_centavos, moneda)}
          </span>

          <button
            type="button"
            onClick={agregarRapido}
            disabled={!disponible}
            aria-label={`Agregar ${producto.nombre} al pedido`}
            className="grid h-11 w-11 place-items-center rounded-full bg-marca text-cream shadow-md transition hover:bg-corteza hover:text-cacao active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {agregado ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" strokeWidth={2.6} />}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
