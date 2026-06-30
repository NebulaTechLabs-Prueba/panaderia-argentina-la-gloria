"use client";

import { useEffect } from "react";
import { playTap } from "@/lib/sound/ding";

// Reproduce un "tap" sutil al hacer click en cualquier botón o enlace.
// Los botones con sonido propio (agregar, enviar, etc.) igual suenan; este tap
// es apenas perceptible. Marcá un elemento con data-silencio para excluirlo.
export function ClickSonido() {
  useEffect(() => {
    const handler = (e) => {
      const el = e.target?.closest?.("button, a, [role='button']");
      if (el && !el.dataset.silencio) playTap();
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);
  return null;
}
