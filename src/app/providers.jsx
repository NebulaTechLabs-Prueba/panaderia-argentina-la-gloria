"use client";

import { NegocioProvider } from "@/modules/negocio/NegocioProvider";
import { CarritoProvider } from "@/modules/carrito/CarritoProvider";
import { ClickSonido } from "@/components/ui/ClickSonido";

// Providers globales client-side. El layout (server) los envuelve alrededor de
// children para que catálogo, carrito y admin compartan el mismo estado.
// (El cliente eligió la propuesta B; las propuestas A/C y su navbar se eliminaron.)
export function Providers({ children }) {
  return (
    <NegocioProvider>
      <CarritoProvider>
        {children}
        <ClickSonido />
      </CarritoProvider>
    </NegocioProvider>
  );
}
