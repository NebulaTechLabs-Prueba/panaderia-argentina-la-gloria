"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAjustes } from "@/lib/data";

// Ajustes del negocio (moneda, WhatsApp, textos) disponibles en toda la app.
// Se leen una vez client-side; cuando se conecte Supabase, lib/data los traerá
// desde la base sin cambiar este provider.
const NegocioContext = createContext(null);

export function NegocioProvider({ children }) {
  const [ajustes, setAjustes] = useState(null);

  useEffect(() => {
    let activo = true;
    getAjustes()
      .then((data) => activo && setAjustes(data))
      .catch(() => activo && setAjustes(null));
    return () => {
      activo = false;
    };
  }, []);

  return <NegocioContext.Provider value={ajustes}>{children}</NegocioContext.Provider>;
}

// Devuelve los ajustes (o null mientras cargan).
export function useNegocio() {
  return useContext(NegocioContext);
}

// Config de moneda lista para formatCentavos. Tiene defaults seguros.
export function useMoneda() {
  const ajustes = useNegocio();
  return {
    simbolo: ajustes?.moneda_simbolo ?? "$",
    moneda: ajustes?.moneda ?? "USD",
  };
}
