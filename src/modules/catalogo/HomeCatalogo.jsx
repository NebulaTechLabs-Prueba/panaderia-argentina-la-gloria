"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { getCategorias, getProductos } from "@/lib/data";
import { ES_DEMO } from "@/lib/config/constants";
import { useNegocio } from "@/modules/negocio/NegocioProvider";
import { CategoryNav } from "./CategoryNav";
import { ProductGrid, ProductGridSkeleton } from "./ProductGrid";
import { ProductModal } from "./ProductModal";
import { CartButton } from "@/modules/carrito/CartButton";
import { CartDrawer } from "@/modules/carrito/CartDrawer";
import { LogoLaGloria } from "@/components/ui/LogoLaGloria";
import { SiteFooter } from "@/modules/negocio/SiteFooter";

// lucide-react v1 ya no incluye iconos de marca; SVG inline para Instagram.
function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// Sol de Mayo estilizado (motivo argentino) para decorar el hero.
function SolDeMayo({ className }) {
  const rayos = Array.from({ length: 16 });
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill="currentColor">
        {rayos.map((_, i) => (
          <rect key={i} x="48.5" y="2" width="3" height="20" rx="1.5" transform={`rotate(${i * 22.5} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="20" />
      </g>
    </svg>
  );
}

// Orquestador del catálogo público: trae datos client-side, maneja el filtro de
// categoría, el modal de detalle y el drawer del carrito. Es el corazón del SPA.
export function HomeCatalogo() {
  const ajustes = useNegocio();
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [catActiva, setCatActiva] = useState("todo");
  const [productoDetalle, setProductoDetalle] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  useEffect(() => {
    let activo = true;
    Promise.all([getCategorias(), getProductos()])
      .then(([cats, prods]) => {
        if (!activo) return;
        setCategorias(cats);
        setProductos(prods);
      })
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, []);

  const productosFiltrados = useMemo(() => {
    if (catActiva === "todo") return productos;
    return productos.filter((p) => p.categoria_id === catActiva);
  }, [productos, catActiva]);

  const categoriaDetalle = categorias.find((c) => c.id === productoDetalle?.categoria_id);

  return (
    <div className="min-h-full bg-cream">
      {/* ── Hero "barrio porteño": bloque carbón con sol de mayo y cintas ── */}
      <header className="relative overflow-hidden bg-marca text-cream">
        {/* Decoración de marca (estética, aria oculto) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <SolDeMayo className="absolute -right-10 -top-12 h-64 w-64 text-corteza/90" />
          <div className="absolute -bottom-24 -left-16 h-64 w-[140%] -rotate-6 rounded-[50%] bg-celeste/25" />
          <div className="absolute right-1/4 bottom-6 h-3 w-3 rounded-full bg-celeste" />
          <div className="absolute right-12 top-1/2 h-2 w-2 rounded-full bg-cream/60" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-14 sm:py-20">
          {/* Emblema de marca (recreación SVG hasta cargar el logo real) */}
          <LogoLaGloria src={ajustes?.logo_url} className="mb-6 h-24 w-24 drop-shadow-lg" />

          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-cream/80">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
              <MapPin className="h-3.5 w-3.5 text-celeste" />
              {ajustes?.direccion ?? "Woodbridge, VA"}
            </span>
            <span className="rounded-full bg-corteza px-3 py-1 text-cacao">Panadería argentina</span>
          </div>

          <h1 className="mt-4 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
            {ajustes?.nombre_negocio ?? "Panadería La Gloria"}
          </h1>

          <p className="mt-4 max-w-xl text-lg text-cream/85">
            {ajustes?.tagline ?? "Un cachito de Argentina, recién horneado."}{" "}
            {ajustes?.mensaje_bienvenida}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#catalogo"
              className="inline-flex items-center gap-2 rounded-full bg-corteza px-6 py-3 font-bold text-cacao shadow-lg transition hover:brightness-105 active:scale-95"
            >
              Armá tu pedido 👇
            </a>
            {ajustes?.instagram_url && (
              <a
                href={ajustes.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-medium text-cream ring-1 ring-white/20 transition hover:bg-white/20"
              >
                <InstagramIcon className="h-4 w-4" />
                Seguinos
              </a>
            )}
            {ES_DEMO && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-cream/80 ring-1 ring-white/15">
                ⚠ Precios de muestra (demo)
              </span>
            )}
          </div>

          <Link
            href="/menu"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-celeste underline-offset-4 transition hover:underline"
          >
            Ver Propuesta B · estilo menú <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <CategoryNav categorias={categorias} activa={catActiva} onSeleccionar={setCatActiva} />

      <main id="catalogo" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-8">
        {cargando ? (
          <ProductGridSkeleton />
        ) : (
          <ProductGrid
            categorias={categorias}
            productos={productosFiltrados}
            agrupar={catActiva === "todo"}
            onAbrirDetalle={setProductoDetalle}
          />
        )}
      </main>

      <SiteFooter />

      <CartButton onAbrir={() => setCarritoAbierto(true)} />
      <CartDrawer abierto={carritoAbierto} onCerrar={() => setCarritoAbierto(false)} />
      <ProductModal
        producto={productoDetalle}
        categoria={categoriaDetalle}
        onCerrar={() => setProductoDetalle(null)}
      />
    </div>
  );
}
