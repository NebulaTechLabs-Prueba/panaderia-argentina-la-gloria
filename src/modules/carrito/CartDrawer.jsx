"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, MessageCircle, Utensils } from "lucide-react";
import { useCarrito } from "./CarritoProvider";
import { useNegocio, useMoneda } from "@/modules/negocio/NegocioProvider";
import { formatCentavos } from "@/lib/money/formatCentavos";
import { buildMensajePedido } from "@/modules/whatsapp/buildMensajePedido";
import { buildWhatsappUrl } from "@/modules/whatsapp/buildWhatsappUrl";

// Panel lateral con el detalle del pedido y el botón que redirige a WhatsApp.
// Estado (abierto/minimizado) controlado desde el contexto del carrito.
export function CartDrawer() {
  const {
    items, totalCentavos, estaVacio, fijarCantidad, quitar, vaciar,
    drawerAbierto, cerrarCarrito,
  } = useCarrito();
  const ajustes = useNegocio();
  const moneda = useMoneda();
  // Comensales: opcional, default 1. Sólo se incluye en el mensaje si es 2+.
  const [personas, setPersonas] = useState(1);

  function enviarPorWhatsapp() {
    if (estaVacio || !ajustes) return;
    const mensaje = buildMensajePedido(items, ajustes, { personas });
    const url = buildWhatsappUrl(ajustes.whatsapp_numero, mensaje);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <AnimatePresence>
      {drawerAbierto && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-cacao/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrarCarrito}
          />
          <motion.aside
            role="dialog"
            aria-label="Tu pedido"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <header className="flex items-center justify-between border-b border-corteza/20 px-5 py-4">
              <h2 className="font-display text-xl font-semibold text-cacao">Tu pedido</h2>
              <button
                type="button"
                onClick={cerrarCarrito}
                aria-label="Minimizar"
                title="Minimizar"
                className="rounded-full p-1.5 text-cacao/60 transition hover:bg-masa hover:text-cacao"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {estaVacio ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-cacao/60">
                <span className="text-4xl">🧺</span>
                <p>Tu pedido está vacío.</p>
                <p className="text-sm">Agregá productos del catálogo para empezar.</p>
              </div>
            ) : (
              <ul className="flex-1 divide-y divide-corteza/15 overflow-y-auto px-5">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-cacao">{item.nombre}</p>
                      <p className="text-sm text-cacao/60">
                        {formatCentavos(item.precio_centavos, moneda)} c/u
                      </p>
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-masa p-1">
                      <button
                        type="button"
                        onClick={() => fijarCantidad(item.id, item.cantidad - 1)}
                        aria-label="Quitar uno"
                        className="grid h-7 w-7 place-items-center rounded-full text-cacao transition hover:bg-cream"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-cacao">
                        {item.cantidad}
                      </span>
                      <button
                        type="button"
                        onClick={() => fijarCantidad(item.id, item.cantidad + 1)}
                        aria-label="Agregar uno"
                        className="grid h-7 w-7 place-items-center rounded-full text-cacao transition hover:bg-cream"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <span className="w-20 text-right font-semibold text-cacao">
                      {formatCentavos(item.precio_centavos * item.cantidad, moneda)}
                    </span>

                    <button
                      type="button"
                      onClick={() => quitar(item.id)}
                      aria-label={`Quitar ${item.nombre}`}
                      className="rounded-full p-1.5 text-cacao/40 transition hover:bg-masa hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {!estaVacio && (
              <footer className="space-y-3 border-t border-corteza/20 px-5 py-4">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={vaciar}
                    className="text-sm text-cacao/50 underline-offset-2 transition hover:text-cacao hover:underline"
                  >
                    Vaciar
                  </button>
                  <div className="text-right">
                    <span className="block text-xs uppercase tracking-wide text-cacao/50">
                      Total
                    </span>
                    <span className="font-display text-2xl font-bold text-cacao">
                      {formatCentavos(totalCentavos, moneda)}
                    </span>
                  </div>
                </div>

                {/* Comensales en la mesa (opcional). Default 1; sólo se notifica si es 2+. */}
                <div className="flex items-center justify-between rounded-2xl bg-masa/60 px-3 py-2">
                  <span className="flex items-center gap-2 text-sm font-medium text-cacao/80">
                    <Utensils className="h-4 w-4 text-cacao/60" />
                    Comensales en la mesa
                    <span className="text-xs text-cacao/45">(opcional)</span>
                  </span>
                  <div className="flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-cacao/10">
                    <button
                      type="button"
                      onClick={() => setPersonas((n) => Math.max(1, n - 1))}
                      aria-label="Menos personas"
                      disabled={personas <= 1}
                      className="grid h-7 w-7 place-items-center rounded-full text-cacao transition hover:bg-masa disabled:opacity-30"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold tabular-nums text-cacao">
                      {personas}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPersonas((n) => Math.min(50, n + 1))}
                      aria-label="Más personas"
                      className="grid h-7 w-7 place-items-center rounded-full text-cacao transition hover:bg-masa"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={enviarPorWhatsapp}
                  disabled={!ajustes}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-4 font-semibold text-white shadow-md transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
                >
                  <MessageCircle className="h-5 w-5" strokeWidth={2.2} />
                  Enviar pedido por WhatsApp
                </button>
                <p className="text-center text-xs text-cacao/50">
                  Se abre WhatsApp con el detalle. No se cobra en el sitio.
                </p>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
