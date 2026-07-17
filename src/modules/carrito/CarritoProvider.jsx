"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { CART_STORAGE_KEY } from "@/lib/config/constants";
import { totalCentavos } from "@/lib/money/formatCentavos";
import { calcularRegalos, getPromos } from "@/lib/promos";
import { getProductos } from "@/lib/data";
import { track } from "@/lib/track";
import { playDing } from "@/lib/sound/ding";

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
            consultar: !!(producto.consultar || producto.unidad === "variable"),
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

    // Saca del carrito los productos que ya no existen en el catálogo (borrados
    // en el admin). Las variantes tienen id compuesto "base::formato" → se valida
    // el id base.
    case "RECONCILIAR":
      return { items: state.items.filter((i) => action.validos.has(String(i.id).split("::")[0])) };

    default:
      return state;
  }
}

export function CarritoProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, estadoInicial);
  // Estado de UI del drawer (carrito desplegado o minimizado).
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  // Promos (Supabase) + nombres de productos para resolver los premios.
  const [promos, setPromos] = useState([]);
  const [nombrePorId, setNombrePorId] = useState({});

  const cargarPromos = useCallback(async () => {
    const [ps, prods] = await Promise.all([getPromos(), getProductos()]);
    setPromos(ps);
    const lista = prods || [];
    setNombrePorId(Object.fromEntries(lista.map((p) => [p.id, p.nombre])));
    // Reconciliar el carrito con el catálogo real (quita productos borrados).
    if (lista.length) dispatch({ type: "RECONCILIAR", validos: new Set(lista.map((p) => p.id)) });
  }, []);

  // Cargar al montar y recargar cuando el panel edita una promo.
  useEffect(() => {
    cargarPromos();
    const h = () => cargarPromos();
    window.addEventListener("la-gloria:promos", h);
    return () => window.removeEventListener("la-gloria:promos", h);
  }, [cargarPromos]);

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
      regalos: calcularRegalos(state.items, promos, nombrePorId),
      cantidadTotal,
      totalCentavos: totalCentavos(state.items),
      estaVacio: state.items.length === 0,
      agregar: (producto, cantidad) => {
        // Al agregar el PRIMER producto, el carrito se abre solo.
        if (state.items.length === 0) setDrawerAbierto(true);
        dispatch({ type: "AGREGAR", producto, cantidad });
        track("agregar_carrito", { producto_id: String(producto.id).split("::")[0], meta: { cantidad: cantidad || 1 } });
        playDing(); // campanita de mostrador
      },
      fijarCantidad: (id, cantidad) => dispatch({ type: "FIJAR_CANTIDAD", id, cantidad }),
      quitar: (id) => dispatch({ type: "QUITAR", id }),
      vaciar: () => dispatch({ type: "VACIAR" }),
      // UI del drawer: abrir (desplegar) / cerrar (minimizar).
      drawerAbierto,
      abrirCarrito: () => setDrawerAbierto(true),
      cerrarCarrito: () => setDrawerAbierto(false),
    };
  }, [state.items, drawerAbierto, promos, nombrePorId]);

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  return ctx;
}
