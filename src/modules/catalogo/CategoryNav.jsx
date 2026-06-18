"use client";

import { Sparkles } from "lucide-react";
import { IconoCategoria } from "./IconoCategoria";

// Navegación de categorías (chips). Sticky bajo el header. "Todo" muestra
// el catálogo completo agrupado por categoría.
export function CategoryNav({ categorias, activa, onSeleccionar }) {
  return (
    <nav className="sticky top-0 z-30 border-b border-cacao/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Chip "Todo" */}
        <button
          type="button"
          onClick={() => onSeleccionar("todo")}
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
            activa === "todo"
              ? "bg-marca text-cream shadow"
              : "bg-white text-cacao/70 ring-1 ring-cacao/10 hover:bg-masa"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Todo
        </button>

        {categorias.map((cat) => {
          const seleccionada = activa === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSeleccionar(cat.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                seleccionada
                  ? "bg-marca text-cream shadow"
                  : "bg-white text-cacao/70 ring-1 ring-cacao/10 hover:bg-masa"
              }`}
            >
              <IconoCategoria icono={cat.icono} className="h-4 w-4" />
              {cat.nombre}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
