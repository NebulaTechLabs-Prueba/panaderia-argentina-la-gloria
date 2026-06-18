"use client";

import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCarrito } from "./CarritoProvider";

// Botón flotante del carrito (esquina inferior derecha). Muestra la cantidad
// total y abre el drawer. Se oculta si el carrito está vacío para no estorbar.
export function CartButton({ onAbrir }) {
  const { cantidadTotal, estaVacio } = useCarrito();

  return (
    <AnimatePresence>
      {!estaVacio && (
        <motion.button
          type="button"
          onClick={onAbrir}
          aria-label={`Ver pedido (${cantidadTotal} ítems)`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 0.94 }}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-marca px-5 py-3.5 text-cream shadow-lg shadow-black/20 ring-1 ring-black/5"
        >
          <ShoppingBag className="h-5 w-5" strokeWidth={2.2} />
          <span className="font-semibold">Mi pedido</span>
          <motion.span
            key={cantidadTotal}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            className="ml-1 grid h-6 min-w-6 place-items-center rounded-full bg-cream px-1.5 text-sm font-bold text-marca"
          >
            {cantidadTotal}
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
