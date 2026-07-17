"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { ProductImage } from "./ProductImage";
import { formatCentavos } from "@/lib/money/formatCentavos";
import { unidadSufijo } from "@/lib/unidades";
import { useCarrito } from "@/modules/carrito/CarritoProvider";
import { useMoneda } from "@/modules/negocio/NegocioProvider";
import { playMas, playMenos } from "@/lib/sound/ding";

// Detalle de producto como modal (sin ruta propia: compatible con export estático).
export function ProductModal({ producto, categoria, onCerrar }) {
  const { agregar } = useCarrito();
  const moneda = useMoneda();
  const [cantidad, setCantidad] = useState(1);
  // Productos con precio por formato (unidad / ½ docena / docena, etc.).
  const hayVariantes = Array.isArray(producto?.variantes) && producto.variantes.length > 0;
  const [variante, setVariante] = useState(null);
  const ocultarPrecio = !hayVariantes && (producto?.consultar || producto?.unidad === "variable");
  const precioActivo = hayVariantes && variante ? variante.precio_centavos : producto?.precio_centavos;

  // Reiniciar cantidad y variante cada vez que se abre un producto distinto.
  useEffect(() => {
    setCantidad(1);
    // Arranca en la variante más barata (coincide con el "desde $X" de la tarjeta).
    setVariante(
      hayVariantes
        ? producto.variantes.reduce((a, b) => (b.precio_centavos < a.precio_centavos ? b : a))
        : null
    );
  }, [producto?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function agregarAlPedido() {
    if (hayVariantes && variante) {
      // Cada formato es una línea propia en el carrito (id compuesto).
      agregar(
        {
          ...producto,
          id: `${producto.id}::${variante.etiqueta}`,
          nombre: `${producto.nombre} · ${variante.etiqueta}`,
          precio_centavos: variante.precio_centavos,
          unidad: "uni",
          consultar: false,
        },
        cantidad
      );
    } else {
      agregar(producto, cantidad);
    }
    onCerrar();
  }

  return (
    <AnimatePresence>
      {producto && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.div
            className="absolute inset-0 bg-cacao/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCerrar}
          />
          <motion.div
            role="dialog"
            aria-label={producto.nombre}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-t-3xl bg-cream shadow-2xl sm:rounded-3xl"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            <button
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar"
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-cream/90 text-cacao shadow transition hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="aspect-16/10 w-full overflow-hidden">
              <ProductImage
                src={producto.imagen_url}
                alt={producto.nombre}
                color={categoria?.color}
                icono={categoria?.icono}
              />
            </div>

            <div className="p-5">
              {producto.etiqueta && (
                <span className="mb-2 inline-block rounded-full bg-corteza px-2.5 py-1 text-xs font-bold text-cacao">
                  {producto.etiqueta}
                </span>
              )}
              <h2 className="font-display text-2xl font-bold text-cacao">{producto.nombre}</h2>
              <p className="mt-2 text-cacao/70">{producto.descripcion}</p>

              {producto.nota && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-corteza/20 px-3 py-1.5 text-sm font-semibold text-cacao ring-1 ring-corteza/40">
                  🎨 {producto.nota}
                </p>
              )}

              {hayVariantes && (
                <div className="mt-4">
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-cacao/50">Elegí el formato</p>
                  <div className="grid grid-cols-3 gap-2">
                    {producto.variantes.map((v) => {
                      const activa = variante?.etiqueta === v.etiqueta;
                      return (
                        <button
                          key={v.etiqueta}
                          type="button"
                          onClick={() => setVariante(v)}
                          className={`flex flex-col items-center rounded-2xl border-2 px-2 py-2.5 transition ${activa ? "border-marca bg-marca/10" : "border-cacao/10 bg-white/60 hover:border-marca/40"}`}
                        >
                          <span className="text-xs font-bold text-cacao">{v.etiqueta}</span>
                          <span className="mt-0.5 font-display text-sm font-extrabold text-marca">{formatCentavos(v.precio_centavos, moneda)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div className="leading-tight">
                  <span className={`font-display text-2xl font-bold ${producto.estimado ? "text-marca/70" : "text-marca"}`}>
                    {ocultarPrecio ? "Consultar" : formatCentavos(precioActivo, moneda)}
                  </span>
                  {!hayVariantes && unidadSufijo(producto.unidad) && (
                    <span className="ml-1 text-sm font-semibold text-cacao/45">{unidadSufijo(producto.unidad)}</span>
                  )}
                  {producto.estimado && (
                    <span className="block text-[11px] font-bold uppercase tracking-wide text-amber-600">
                      ≈ precio aprox. (a confirmar)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 rounded-full bg-masa p-1">
                  <button
                    type="button"
                    onClick={() => { playMenos(); setCantidad((c) => Math.max(1, c - 1)); }}
                    aria-label="Quitar uno"
                    className="grid h-9 w-9 place-items-center rounded-full text-cacao transition hover:bg-cream"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-semibold text-cacao">{cantidad}</span>
                  <button
                    type="button"
                    onClick={() => { playMas(); setCantidad((c) => c + 1); }}
                    aria-label="Agregar uno"
                    className="grid h-9 w-9 place-items-center rounded-full text-cacao transition hover:bg-cream"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {producto.disponible ? (
                <button
                  type="button"
                  onClick={agregarAlPedido}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-marca px-5 py-4 font-semibold text-cream shadow-md transition hover:brightness-110 active:scale-[0.99]"
                >
                  <ShoppingBag className="h-5 w-5" strokeWidth={2.2} />
                  {ocultarPrecio
                    ? `Agregar ${cantidad > 1 ? `${cantidad} ` : ""}al pedido · a consultar`
                    : `Agregar ${cantidad > 1 ? `${cantidad} ` : ""}al pedido · ${formatCentavos(precioActivo * cantidad, moneda)}`}
                </button>
              ) : (
                <p className="mt-5 rounded-2xl bg-masa px-5 py-4 text-center font-medium text-cacao/60">
                  Por ahora no está disponible
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
