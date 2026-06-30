"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Layers } from "lucide-react";

const PROPS = [
  { href: "/", label: "A", title: "Catálogo" },
  { href: "/menu", label: "B", title: "Menú" },
  { href: "/experiencia", label: "C", title: "Experiencia" },
];

const KEY = "la-gloria:nav-min";

// Mini-navbar sutil para saltar entre propuestas (A/B/C). Minimizable: se colapsa
// a una pestañita y recuerda el estado. Aparece en todas las propuestas.
export function PropuestasNav() {
  const pathname = usePathname();
  const [min, setMin] = useState(false);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
    try {
      setMin(window.localStorage.getItem(KEY) === "1");
    } catch {}
  }, []);

  const minimizar = (v) => {
    setMin(v);
    try {
      window.localStorage.setItem(KEY, v ? "1" : "0");
    } catch {}
  };

  if (!montado) return null;
  const path = (pathname || "/").replace(/\/+$/, "") || "/";

  if (min) {
    return (
      <button
        type="button"
        data-silencio
        onClick={() => minimizar(false)}
        aria-label="Mostrar propuestas"
        className="fixed left-3 top-3 z-[60] grid h-9 w-9 place-items-center rounded-full bg-marca/90 text-cream shadow-lg ring-1 ring-white/15 backdrop-blur transition hover:bg-marca"
      >
        <Layers className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="fixed left-3 top-3 z-[60] flex items-center gap-1 rounded-full bg-marca/90 p-1 pl-3 text-cream shadow-lg ring-1 ring-white/15 backdrop-blur">
      <span className="text-[11px] font-bold uppercase tracking-wide text-cream/70">Propuesta</span>
      {PROPS.map((p) => {
        const href = p.href.replace(/\/+$/, "") || "/";
        const active = path === href;
        return (
          <Link
            key={p.href}
            href={p.href}
            title={p.title}
            aria-current={active ? "page" : undefined}
            className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold transition ${
              active ? "bg-corteza text-cacao" : "text-cream hover:bg-white/15"
            }`}
          >
            {p.label}
          </Link>
        );
      })}
      <button
        type="button"
        data-silencio
        onClick={() => minimizar(true)}
        aria-label="Minimizar"
        className="grid h-8 w-8 place-items-center rounded-full text-cream/70 transition hover:bg-white/15 hover:text-cream"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    </div>
  );
}
