"use client";

import { NegocioProvider } from "@/modules/negocio/NegocioProvider";
import { CarritoProvider } from "@/modules/carrito/CarritoProvider";
import { ClickSonido } from "@/components/ui/ClickSonido";
// El cliente eligió la propuesta B: se oculta el navbar de propuestas (A/B/C)
// hasta confirmar la eliminación definitiva de las otras. El componente y las
// rutas se conservan por si hay que revertir.
// import { PropuestasNav } from "@/components/ui/PropuestasNav";

// Providers globales client-side. El layout (server) los envuelve alrededor de
// children para que catálogo, carrito y admin compartan el mismo estado.
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
