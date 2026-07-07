"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Layers, LayoutGrid, Palette } from "lucide-react";

const PROPS = [
  { href: "/", label: "A", title: "Experiencia" },
  { href: "/menu", label: "B", title: "Menú" },
  { href: "/experiencia", label: "C", title: "Elaboración" },
];

const KEY = "la-gloria:nav-min";

// Control segmentado para el desplegable de la propuesta C.
function Seg({ icon: Icon, label, options, value, onPick }) {
  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-cream/70">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <div className="flex gap-1 rounded-full bg-black/25 p-1">
        {options.map(([v, l]) => (
          <button
            key={v}
            type="button"
            data-silencio
            onClick={() => onPick(v)}
            className={`flex-1 rounded-full px-2 py-1 text-xs font-semibold transition ${
              value === v ? "bg-corteza text-cacao" : "text-cream/80 hover:bg-white/10"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

// Mini-navbar para saltar entre propuestas (A/B/C) y, al pasar el mouse por la
// C, configurar la propuesta D (distribución y colores). Minimizable.
export function PropuestasNav() {
  const pathname = usePathname();
  const [min, setMin] = useState(false);
  const [montado, setMontado] = useState(false);
  const [dmodo, setDmodo] = useState("cine");
  const [dtema, setDtema] = useState("oscuro");

  useEffect(() => {
    setMontado(true);
    try {
      setMin(window.localStorage.getItem(KEY) === "1");
      const m = window.localStorage.getItem("la-gloria:d-modo");
      const t = window.localStorage.getItem("la-gloria:d-tema");
      if (m === "cine" || m === "galeria") setDmodo(m);
      if (t === "oscuro" || t === "marca") setDtema(t);
    } catch {}
  }, []);

  const minimizar = (v) => {
    setMin(v);
    try {
      window.localStorage.setItem(KEY, v ? "1" : "0");
    } catch {}
  };

  // Aplica preferencias de D y avisa en vivo a la página por evento.
  const setPref = (modo, tema) => {
    setDmodo(modo);
    setDtema(tema);
    try {
      window.localStorage.setItem("la-gloria:d-modo", modo);
      window.localStorage.setItem("la-gloria:d-tema", tema);
    } catch {}
    window.dispatchEvent(new CustomEvent("la-gloria:d-prefs", { detail: { modo, tema } }));
  };

  if (!montado) return null;
  const path = (pathname || "/").replace(/\/+$/, "") || "/";
  if (path.startsWith("/admin")) return null; // el panel de gestión no muestra el nav de propuestas

  if (min) {
    return (
      <button
        type="button"
        data-silencio
        onClick={() => minimizar(false)}
        aria-label="Mostrar propuestas"
        className="fixed left-3 top-3 z-60 grid h-9 w-9 place-items-center rounded-full bg-marca/90 text-cream shadow-lg ring-1 ring-white/15 backdrop-blur transition hover:bg-marca"
      >
        <Layers className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="fixed left-3 top-3 z-60 flex items-center gap-1 rounded-full bg-marca/90 p-1 pl-3 text-cream shadow-lg ring-1 ring-white/15 backdrop-blur">
      <span className="text-[11px] font-bold uppercase tracking-wide text-cream/70">Propuesta</span>
      {PROPS.map((p) => {
        const href = p.href.replace(/\/+$/, "") || "/";
        const active = path === href;
        const link = (
          <Link
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

        // La C es clickeable (navega) y al hover ofrece las opciones de D.
        if (p.label !== "C") return <span key={p.href}>{link}</span>;
        return (
          <div key={p.href} className="group relative">
            {link}
            <div className="invisible absolute left-1/2 top-full z-10 -translate-x-1/2 pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="w-60 rounded-2xl bg-marca/95 p-3 text-cream shadow-xl ring-1 ring-white/15 backdrop-blur">
                <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-wide text-cream/60">
                  Propuesta C · opciones
                </p>
                <Seg
                  icon={LayoutGrid}
                  label="Distribución"
                  options={[["cine", "Cine"], ["galeria", "Galería"]]}
                  value={dmodo}
                  onPick={(v) => setPref(v, dtema)}
                />
                <div className="mt-2">
                  <Seg
                    icon={Palette}
                    label="Colores"
                    options={[["oscuro", "Cine"], ["marca", "Marca"]]}
                    value={dtema}
                    onPick={(v) => setPref(dmodo, v)}
                  />
                </div>
              </div>
            </div>
          </div>
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
