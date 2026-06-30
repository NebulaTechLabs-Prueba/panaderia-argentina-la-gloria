"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCarrito } from "@/modules/carrito/CarritoProvider";
import { useMoneda } from "@/modules/negocio/NegocioProvider";
import { formatCentavos } from "@/lib/money/formatCentavos";
import { playMas, playMenos } from "@/lib/sound/ding";

// Detalle de producto PROPIO de la Propuesta D: oscuro, cinematográfico, con el
// color de la página (cacao + cream), sin los colores de marca. Distinto del
// modal compartido.
export function EscenaModal({ producto, categoria, onCerrar }) {
  const { agregar } = useCarrito();
  const moneda = useMoneda();
  const [cant, setCant] = useState(1);
  useEffect(() => setCant(1), [producto?.id]);

  function add() {
    agregar(producto, cant);
    onCerrar();
  }

  return (
    <AnimatePresence>
      {producto && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.div
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCerrar}
          />
          <motion.div
            role="dialog"
            aria-label={producto.nombre}
            className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden bg-cacao text-cream shadow-2xl ring-1 ring-white/10 sm:rounded-[2rem] md:flex-row"
            initial={{ y: 50, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
          >
            {/* media grande */}
            <div className="relative h-60 shrink-0 md:h-auto md:w-1/2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={producto.imagen_url} alt={producto.nombre} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-cacao via-transparent to-transparent md:bg-linear-to-r" />
            </div>

            {/* detalle */}
            <div className="relative flex flex-1 flex-col overflow-y-auto p-7 sm:p-9">
              <button
                type="button"
                onClick={onCerrar}
                aria-label="Cerrar"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-cream transition hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>

              <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-cream/45">
                {categoria?.nombre}
              </p>
              <h2 className="mt-1 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                {producto.nombre}
              </h2>
              {producto.descripcion && (
                <p className="mt-3 max-w-md leading-relaxed text-cream/70">{producto.descripcion}</p>
              )}

              <div className="mt-auto pt-8">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl font-extrabold">
                    {formatCentavos(producto.precio_centavos, moneda)}
                  </span>
                  <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (cant > 1) {
                          playMenos();
                          setCant(cant - 1);
                        }
                      }}
                      aria-label="Quitar uno"
                      className="grid h-9 w-9 place-items-center rounded-full text-cream transition hover:bg-white/15"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-semibold tabular-nums">{cant}</span>
                    <button
                      type="button"
                      onClick={() => {
                        playMas();
                        setCant(cant + 1);
                      }}
                      aria-label="Agregar uno"
                      className="grid h-9 w-9 place-items-center rounded-full text-cream transition hover:bg-white/15"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {producto.disponible ? (
                  <button
                    type="button"
                    onClick={add}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-cream px-5 py-4 font-bold text-cacao shadow-lg transition hover:bg-white active:scale-[0.99]"
                  >
                    <ShoppingBag className="h-5 w-5" strokeWidth={2.2} />
                    Agregar {cant > 1 ? `${cant} ` : ""}· {formatCentavos(producto.precio_centavos * cant, moneda)}
                  </button>
                ) : (
                  <p className="mt-5 rounded-2xl bg-white/10 px-5 py-4 text-center font-medium text-cream/60">
                    Por ahora no está disponible
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
