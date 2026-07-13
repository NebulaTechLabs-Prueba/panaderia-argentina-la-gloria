"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Kaushan_Script } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, MapPin, Gift, ChevronDown } from "lucide-react";
import { getCategorias, getProductos } from "@/lib/data";
import { ES_DEMO } from "@/lib/config/constants";
import { useNegocio, useMoneda } from "@/modules/negocio/NegocioProvider";
import { useCarrito } from "@/modules/carrito/CarritoProvider";
import { formatCentavos } from "@/lib/money/formatCentavos";
import { unidadSufijo } from "@/lib/unidades";
import { estiloBadge } from "@/lib/badges";
import { getPromos, promoVigente } from "@/lib/promos";
import { ProductImage } from "./ProductImage";
import { IconoCategoria } from "./IconoCategoria";
import { header as headerColor } from "./catColors";
import { CartButton } from "@/modules/carrito/CartButton";
import { CartDrawer } from "@/modules/carrito/CartDrawer";
import { ProductModal } from "./ProductModal";
import { LogoLaGloria } from "@/components/ui/LogoLaGloria";
import { SiteFooter } from "@/modules/negocio/SiteFooter";

// Tipografía manuscrita para los títulos, al estilo del menú impreso de La Gloria.
const script = Kaushan_Script({ weight: "400", subsets: ["latin"] });

// Cintas onduladas de marca (naranja/celeste), con deriva lenta e infinita.
function Cintas() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.svg
        className="absolute -top-10 left-0 h-[140%] w-[120%] opacity-[0.13]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        animate={{ x: [0, -40, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M0 180 C 300 80, 600 280, 1200 140 L1200 260 C600 400, 300 200, 0 320 Z" fill="#F5A623" />
        <path d="M0 520 C 350 420, 650 620, 1200 480 L1200 600 C650 740, 350 540, 0 660 Z" fill="#29ABE2" />
      </motion.svg>
    </div>
  );
}

// Animaciones reutilizables (reveal al entrar en viewport + stagger).
const contenedor = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", damping: 22, stiffness: 220 } },
};

// Fila de producto: imagen grande + nombre + descripción + precio + agregar.
function FilaProducto({ producto, categoria, moneda, onAbrir }) {
  const { agregar } = useCarrito();
  const [ok, setOk] = useState(false);
  const disp = producto.disponible;
  const ocultarPrecio = producto.consultar || producto.unidad === "variable"; // precio a consultar: no se agrega

  function add(e) {
    e.stopPropagation();
    if (!disp) return;
    agregar(producto, 1);
    setOk(true);
    setTimeout(() => setOk(false), 1100);
  }

  return (
    <motion.li
      variants={item}
      onClick={() => onAbrir(producto)}
      whileHover={{ x: 4 }}
      className={`group flex cursor-pointer items-center gap-4 rounded-2xl bg-white/80 p-3 ring-1 ring-cacao/8 backdrop-blur-sm transition-shadow hover:bg-white hover:shadow-lg ${
        disp ? "" : "opacity-60"
      }`}
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
        <ProductImage
          src={producto.imagen_url}
          alt={producto.nombre}
          color={categoria?.color}
          icono={categoria?.icono}
          className="transition-transform duration-500 group-hover:scale-110"
        />
        {producto.etiqueta && disp && (
          <span
            className={`absolute left-1 top-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold shadow ${
              estiloBadge(producto.etiqueta).solido
            }`}
          >
            {producto.etiqueta}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-corteza" />
          <h3 className="truncate font-display text-base font-bold text-cacao sm:text-lg">
            {producto.nombre}
          </h3>
        </div>
        {producto.descripcion && (
          <p className="mt-0.5 line-clamp-2 pl-[18px] text-sm text-cacao/55">{producto.descripcion}</p>
        )}
        {!disp && <span className="pl-[18px] text-xs font-semibold text-cacao/50">Agotado</span>}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <div className="text-right leading-tight">
          <span className={`font-display text-lg font-extrabold ${ocultarPrecio ? "text-marca" : producto.estimado ? "text-cacao/60" : "text-cacao"}`}>
            {ocultarPrecio ? "Consultar" : formatCentavos(producto.precio_centavos, moneda)}
          </span>
          {!ocultarPrecio && unidadSufijo(producto.unidad) && (
            <span className="ml-0.5 text-xs font-semibold text-cacao/45">{unidadSufijo(producto.unidad)}</span>
          )}
          {producto.estimado && (
            <span className="block text-[10px] font-bold uppercase tracking-wide text-amber-600">≈ aprox.</span>
          )}
        </div>
        {ocultarPrecio ? (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-cacao/40">Consultá</span>
        ) : (
          <button
            type="button"
            onClick={add}
            disabled={!disp}
            aria-label={`Agregar ${producto.nombre}`}
            className="grid h-10 w-10 place-items-center rounded-full bg-marca text-cream shadow transition hover:bg-corteza hover:text-cacao active:scale-90 disabled:opacity-40"
          >
            {ok ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" strokeWidth={2.6} />}
          </button>
        )}
      </div>
    </motion.li>
  );
}

// Vista alternativa "menú digital": fiel al menú impreso (títulos manuscritos,
// barras de color, cintas) con foco en el producto y animaciones de scroll.
export function MenuLaGloria() {
  const ajustes = useNegocio();
  const moneda = useMoneda();
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [detalle, setDetalle] = useState(null);
  const [promos, setPromos] = useState([]);
  // Categorías colapsadas (default: vacío = todas desplegadas).
  const [colapsadas, setColapsadas] = useState(() => new Set());
  const toggleCategoria = (id) =>
    setColapsadas((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  useEffect(() => setPromos(getPromos().filter(promoVigente)), []);

  useEffect(() => {
    let activo = true;
    Promise.all([getCategorias(), getProductos()])
      .then(([c, p]) => {
        if (!activo) return;
        setCategorias(c);
        setProductos(p);
      })
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, []);

  const porCategoria = useMemo(() => {
    const map = {};
    for (const p of productos) (map[p.categoria_id] ||= []).push(p);
    return map;
  }, [productos]);

  const catDetalle = categorias.find((c) => c.id === detalle?.categoria_id);
  const mapsUrl =
    ajustes?.maps_url ||
    (ajustes?.direccion
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ajustes.direccion)}`
      : null);

  // Navegación por categorías (clave en móvil): chips fijos que saltan a cada
  // sección y se resaltan según lo que estás viendo.
  const catsConItems = useMemo(
    () => categorias.filter((c) => (porCategoria[c.id]?.length ?? 0) > 0),
    [categorias, porCategoria]
  );
  const [activa, setActiva] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    if (!catsConItems.length) return;
    const secs = catsConItems.map((c) => document.getElementById(`sec-${c.id}`)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiva(e.target.id.replace("sec-", ""))),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    secs.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [catsConItems]);

  useEffect(() => {
    if (!activa || !navRef.current) return;
    navRef.current
      .querySelector(`[data-cat="${activa}"]`)
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activa]);

  const irACategoria = (id) =>
    document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Clic en el banner de promo: carga al carrito los productos de la condición
  // (así el cliente no los busca uno por uno). El carrito detecta la promo y
  // ofrece el premio solo. Emite un evento para métricas de promoción.
  const { agregar } = useCarrito();
  const agregarPromo = (promo) => {
    window.dispatchEvent(new CustomEvent("la-gloria:promo-click", { detail: { id: promo.id } }));
    if (promo.condicion?.tipo !== "productos") return;
    for (const req of promo.condicion.productos || []) {
      const p = productos.find((x) => x.id === req.producto_id);
      if (p) agregar(p, req.cantidad || 1);
    }
  };

  return (
    <div className="relative min-h-full bg-cream">
      <Cintas />

      {/* Encabezado / portada del menú */}
      <header className="mx-auto max-w-4xl px-5 pb-6 pt-8 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 160 }}
          className="mx-auto w-fit"
        >
          <LogoLaGloria src={ajustes?.logo_url} className="h-24 w-24 drop-shadow-lg" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`${script.className} mt-4 text-4xl text-marca sm:text-6xl`}
        >
          Nuestro Menú
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-medium text-cacao/60"
        >
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-celeste" />
            {ajustes?.nombre_negocio ?? "Panadería Argentina La Gloria"}
          </span>
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-marca ring-1 ring-cacao/10 transition hover:bg-white"
            >
              ¿Cómo llegar? →
            </a>
          )}
        </motion.p>

        {ES_DEMO && (
          <p className="mt-3 inline-block rounded-full bg-corteza/20 px-3 py-1 text-xs font-semibold text-cacao ring-1 ring-corteza/40">
            ⚠ Algunas fotos son de muestra · los precios con ≈ son tentativos
          </p>
        )}
      </header>

      {/* Promos activas (clic = carga los productos de la promo al carrito) */}
      {promos.length > 0 && (
        <div className="mx-auto max-w-4xl space-y-2.5 px-5 pb-1">
          {promos.map((p) => {
            const clickable = p.condicion?.tipo === "productos";
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={clickable ? () => agregarPromo(p) : undefined}
                role={clickable ? "button" : undefined}
                tabIndex={clickable ? 0 : undefined}
                onKeyDown={
                  clickable
                    ? (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), agregarPromo(p))
                    : undefined
                }
                className={`group relative flex items-center gap-3.5 overflow-hidden rounded-2xl bg-white/80 py-3 pl-5 pr-4 shadow-md ring-1 ring-corteza/25 backdrop-blur-sm ${
                  clickable ? "cursor-pointer transition hover:shadow-lg hover:ring-corteza/50" : ""
                }`}
              >
                <span className="absolute inset-y-0 left-0 w-1.5 bg-linear-to-b from-corteza to-celeste" />
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-corteza text-cacao shadow-sm">
                  <Gift className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-corteza">Promo</p>
                  <p className="truncate text-sm font-semibold text-cacao sm:text-base">{p.descripcion}</p>
                </div>
                {clickable ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-marca px-3 py-1.5 text-xs font-bold text-cream transition group-hover:bg-corteza group-hover:text-cacao">
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.6} /> Agregar
                  </span>
                ) : (
                  <span className="shrink-0 text-xs font-semibold text-cacao/50">al llegar al mínimo</span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Navegación por categorías (fija al hacer scroll) */}
      {!cargando && catsConItems.length > 0 && (
        <nav className="sticky top-0 z-30 border-b border-cacao/10 bg-cream/95 backdrop-blur">
          <div className="relative mx-auto max-w-4xl">
            <div ref={navRef} className="flex gap-2 overflow-x-auto px-5 py-2.5 scrollbar-none">
              {catsConItems.map((c) => {
                const on = activa === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    data-cat={c.id}
                    onClick={() => irACategoria(c.id)}
                    className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                      on ? "bg-marca text-cream shadow" : "bg-white/80 text-cacao/70 ring-1 ring-cacao/10 hover:text-cacao"
                    }`}
                  >
                    {c.nombre}
                  </button>
                );
              })}
            </div>
            {/* fade en los laterales para difuminar el corte del scroll */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-linear-to-r from-cream to-transparent" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-cream to-transparent" />
          </div>
        </nav>
      )}

      {/* Secciones del menú */}
      <main className="mx-auto max-w-4xl space-y-12 px-5 pb-16 pt-6">
        {cargando ? (
          <p className="py-20 text-center text-cacao/50">Calentando el horno…</p>
        ) : (
          categorias.map((cat) => {
            const items = porCategoria[cat.id] ?? [];
            if (items.length === 0) return null;
            const colapsada = colapsadas.has(cat.id);
            return (
              <section key={cat.id} id={`sec-${cat.id}`} className="scroll-mt-24">
                {/* Barra de título = toggle (desplegar / retraer) */}
                <motion.button
                  type="button"
                  onClick={() => toggleCategoria(cat.id)}
                  aria-expanded={!colapsada}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ type: "spring", damping: 20, stiffness: 200 }}
                  className={`flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-4xl px-4 py-3 text-left shadow-md sm:px-6 ${headerColor(cat.color)}`}
                >
                  <h2 className={`${script.className} text-3xl leading-tight sm:text-4xl`}>{cat.nombre}</h2>
                  <span className="flex items-center gap-2 text-sm font-semibold italic opacity-90">
                    {cat.slogan}
                    <IconoCategoria icono={cat.icono} className="h-5 w-5" />
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 transition-transform duration-300 ${colapsada ? "-rotate-90" : ""}`}
                    />
                  </span>
                </motion.button>

                {/* Productos (colapsables) */}
                <AnimatePresence initial={false}>
                  {!colapsada && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <motion.ul
                        variants={contenedor}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-60px" }}
                        className="mt-4 grid gap-3 sm:grid-cols-2"
                      >
                        {items.map((p) => (
                          <FilaProducto key={p.id} producto={p} categoria={cat} moneda={moneda} onAbrir={setDetalle} />
                        ))}
                      </motion.ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            );
          })
        )}
      </main>

      <SiteFooter />

      <CartButton />
      <CartDrawer />
      <ProductModal producto={detalle} categoria={catDetalle} onCerrar={() => setDetalle(null)} />
    </div>
  );
}
