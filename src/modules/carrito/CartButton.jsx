"use client";

import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCarrito } from "./CarritoProvider";
import { playAbrir } from "@/lib/sound/ding";

// Botón flotante del carrito (carrito minimizado). Llamativo: anillo "ping" +
// pulso continuo. Reaparece cuando el drawer está cerrado y hay productos.
export function CartButton() {
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
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-marca px-5 py-3.5 text-cream shadow-xl shadow-marca/30 ring-2 ring-corteza"
        >
          {/* anillo "ping" para llamar la atención */}
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-corteza/50" />
          {/* pulso sutil continuo */}
          <motion.span
            className="absolute inset-0 -z-10 rounded-full bg-marca"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <ShoppingBag className="h-5 w-5" strokeWidth={2.2} />
          <span className="font-semibold">Mi pedido</span>
          <motion.span
            key={cantidadTotal}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            className="ml-1 grid h-6 min-w-6 place-items-center rounded-full bg-corteza px-1.5 text-sm font-bold text-cacao"
          >
            {cantidadTotal}
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
