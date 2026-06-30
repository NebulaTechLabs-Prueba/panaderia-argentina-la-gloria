"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, MessageCircle, Utensils, ShoppingBag } from "lucide-react";
import { useCarrito } from "@/modules/carrito/CarritoProvider";
import { useNegocio, useMoneda } from "@/modules/negocio/NegocioProvider";
import { formatCentavos } from "@/lib/money/formatCentavos";
import { buildMensajePedido } from "@/modules/whatsapp/buildMensajePedido";
import { buildWhatsappUrl } from "@/modules/whatsapp/buildWhatsappUrl";
import {
  playEnviar, playVaciar, playMas, playMenos, playQuitar, playAbrir, playCerrar,
} from "@/lib/sound/ding";

// Carrito PROPIO de la Propuesta D: misma lógica/estado que el compartido, pero
// en la paleta oscura (cacao + cream) para no romper el lenguaje cinematográfico.

export function EscenaCartButton() {
  const { cantidadTotal, estaVacio, drawerAbierto, abrirCarrito } = useCarrito();
  const visible = !estaVacio && !drawerAbierto;
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => {
            playAbrir();
            abrirCarrito();
          }}
          aria-label={`Ver pedido (${cantidadTotal} ítems)`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-cream px-5 py-3.5 text-cacao shadow-xl ring-1 ring-black/10"
        >
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-cream/40" />
          <ShoppingBag className="h-5 w-5" strokeWidth={2.2} />
          <span className="font-semibold">Mi pedido</span>
          <motion.span
            key={cantidadTotal}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            className="ml-1 grid h-6 min-w-6 place-items-center rounded-full bg-cacao px-1.5 text-sm font-bold text-cream"
          >
            {cantidadTotal}
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function EscenaCartDrawer() {
  const {
    items, totalCentavos, estaVacio, fijarCantidad, quitar, vaciar,
    drawerAbierto, cerrarCarrito,
  } = useCarrito();
  const ajustes = useNegocio();
  const moneda = useMoneda();
  const [personas, setPersonas] = useState(1);

  function enviarPorWhatsapp() {
    if (estaVacio || !ajustes) return;
    playEnviar();
    const mensaje = buildMensajePedido(items, ajustes, { personas });
    const url = buildWhatsappUrl(ajustes.whatsapp_numero, mensaje);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const cerrar = () => {
    playCerrar();
    cerrarCarrito();
  };

  return (
    <AnimatePresence>
      {drawerAbierto && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrar}
          />
          <motion.aside
            role="dialog"
            aria-label="Tu pedido"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cacao text-cream shadow-2xl ring-1 ring-white/10"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={(_, info) => {
              if (info.offset.x > 90 || info.velocity.x > 600) cerrar();
            }}
          >
            <div aria-hidden="true" className="absolute left-1.5 top-1/2 h-14 w-1.5 -translate-y-1/2 rounded-full bg-white/15" />

            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="font-display text-xl font-bold">Tu pedido</h2>
              <button
                type="button"
                onClick={cerrar}
                aria-label="Seguir eligiendo"
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-cream/70 transition hover:bg-white/10 hover:text-cream"
              >
                <X className="h-4 w-4" /> Seguir eligiendo
              </button>
            </header>

            {estaVacio ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-cream/55">
                <span className="text-4xl">🧺</span>
                <p>Tu pedido está vacío.</p>
                <p className="text-sm">Agregá productos para empezar.</p>
              </div>
            ) : (
              <ul className="flex-1 divide-y divide-white/10 overflow-y-auto px-5">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{item.nombre}</p>
                      <p className="text-sm text-cream/55">{formatCentavos(item.precio_centavos, moneda)} c/u</p>
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
                      <button
                        type="button"
                        onClick={() => { playMenos(); fijarCantidad(item.id, item.cantidad - 1); }}
                        aria-label="Quitar uno"
                        className="grid h-7 w-7 place-items-center rounded-full text-cream transition hover:bg-white/15"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold tabular-nums">{item.cantidad}</span>
                      <button
                        type="button"
                        onClick={() => { playMas(); fijarCantidad(item.id, item.cantidad + 1); }}
                        aria-label="Agregar uno"
                        className="grid h-7 w-7 place-items-center rounded-full text-cream transition hover:bg-white/15"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <span className="w-20 text-right font-semibold">
                      {formatCentavos(item.precio_centavos * item.cantidad, moneda)}
                    </span>

                    <button
                      type="button"
                      onClick={() => { playQuitar(); quitar(item.id); }}
                      aria-label={`Quitar ${item.nombre}`}
                      className="rounded-full p-1.5 text-cream/40 transition hover:bg-white/10 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {!estaVacio && (
              <footer className="space-y-3 border-t border-white/10 px-5 py-4">
                <div className="flex items-center justify-between">
                  {/* Vaciar: pill notorio */}
                  <button
                    type="button"
                    onClick={() => { playVaciar(); vaciar(); }}
                    className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-cream/70 transition hover:bg-white/20 hover:text-cream"
                  >
                    <Trash2 className="h-4 w-4" /> Vaciar
                  </button>
                  <div className="text-right">
                    <span className="block text-xs uppercase tracking-wide text-cream/50">Total</span>
                    <span className="font-display text-2xl font-bold">{formatCentavos(totalCentavos, moneda)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
                  <span className="flex items-center gap-2 text-sm font-medium text-cream/80">
                    <Utensils className="h-4 w-4 text-cream/55" />
                    Comensales en la mesa
                    <span className="text-xs text-cream/40">(opcional)</span>
                  </span>
                  <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
                    <button
                      type="button"
                      onClick={() => { if (personas > 1) { playMenos(); setPersonas(personas - 1); } }}
                      aria-label="Menos personas"
                      disabled={personas <= 1}
                      className="grid h-7 w-7 place-items-center rounded-full text-cream transition hover:bg-white/15 disabled:opacity-30"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold tabular-nums">{personas}</span>
                    <button
                      type="button"
                      onClick={() => { playMas(); setPersonas(Math.min(50, personas + 1)); }}
                      aria-label="Más personas"
                      className="grid h-7 w-7 place-items-center rounded-full text-cream transition hover:bg-white/15"
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
                <p className="text-center text-xs text-cream/45">
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
