"use client";

import { NegocioProvider } from "@/modules/negocio/NegocioProvider";
import { CarritoProvider } from "@/modules/carrito/CarritoProvider";

// Providers globales client-side. El layout (server) los envuelve alrededor de
// children para que catálogo, carrito y admin compartan el mismo estado.
export function Providers({ children }) {
  return (
    <NegocioProvider>
      <CarritoProvider>{children}</CarritoProvider>
    </NegocioProvider>
  );
}
