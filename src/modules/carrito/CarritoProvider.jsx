"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { CART_STORAGE_KEY } from "@/lib/config/constants";
import { totalCentavos } from "@/lib/money/formatCentavos";

// Estado del carrito: lista de líneas. Cada línea guarda lo mínimo para mostrar
// y para armar el mensaje de WhatsApp, sin depender de que el producto siga
// existiendo en el catálogo.
const CarritoContext = createContext(null);

const estadoInicial = { items: [] };

function reducer(state, action) {
  switch (action.type) {
    case "HIDRATAR":
      return { items: action.items ?? [] };

    case "AGREGAR": {
      const { producto, cantidad = 1 } = action;
      const existe = state.items.find((i) => i.id === producto.id);
      if (existe) {
        return {
          items: state.items.map((i) =>
            i.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            id: producto.id,
            nombre: producto.nombre,
            precio_centavos: producto.precio_centavos,
            imagen_url: producto.imagen_url ?? null,
            cantidad,
          },
        ],
      };
    }

    case "FIJAR_CANTIDAD": {
      const cantidad = Math.max(0, action.cantidad);
      if (cantidad === 0) {
        return { items: state.items.filter((i) => i.id !== action.id) };
      }
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, cantidad } : i
        ),
      };
    }

    case "QUITAR":
      return { items: state.items.filter((i) => i.id !== action.id) };

    case "VACIAR":
      return { items: [] };

    default:
      return state;
  }
}

export function CarritoProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, estadoInicial);

  // Hidratar desde localStorage al montar (solo en navegador).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) dispatch({ type: "HIDRATAR", items: JSON.parse(raw) });
    } catch {
      // localStorage no disponible o JSON inválido: arrancamos vacío.
    }
  }, []);

  // Persistir en cada cambio.
  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* ignorar */
    }
  }, [state.items]);

  const value = useMemo(() => {
    const cantidadTotal = state.items.reduce((acc, i) => acc + i.cantidad, 0);
    return {
      items: state.items,
      cantidadTotal,
      totalCentavos: totalCentavos(state.items),
      estaVacio: state.items.length === 0,
      agregar: (producto, cantidad) => dispatch({ type: "AGREGAR", producto, cantidad }),
      fijarCantidad: (id, cantidad) => dispatch({ type: "FIJAR_CANTIDAD", id, cantidad }),
      quitar: (id) => dispatch({ type: "QUITAR", id }),
      vaciar: () => dispatch({ type: "VACIAR" }),
    };
  }, [state.items]);

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  return ctx;
}
