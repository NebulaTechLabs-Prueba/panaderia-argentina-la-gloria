"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Kaushan_Script } from "next/font/google";
import { motion } from "framer-motion";
import { Plus, Check, MapPin, ArrowLeft } from "lucide-react";
import { getCategorias, getProductos } from "@/lib/data";
import { ES_DEMO } from "@/lib/config/constants";
import { useNegocio, useMoneda } from "@/modules/negocio/NegocioProvider";
import { useCarrito } from "@/modules/carrito/CarritoProvider";
import { formatCentavos } from "@/lib/money/formatCentavos";
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
          <span className="absolute left-1 top-1 rounded-full bg-corteza px-1.5 py-0.5 text-[10px] font-bold text-cacao">
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
        <span className="font-display text-lg font-extrabold text-cacao">
          {formatCentavos(producto.precio_centavos, moneda)}
        </span>
        <button
          type="button"
          onClick={add}
          disabled={!disp}
          aria-label={`Agregar ${producto.nombre}`}
          className="grid h-9 w-9 place-items-center rounded-full bg-marca text-cream shadow transition hover:bg-corteza hover:text-cacao active:scale-90 disabled:opacity-40"
        >
          {ok ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" strokeWidth={2.6} />}
        </button>
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
  const [carrito, setCarrito] = useState(false);

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

  return (
    <div className="relative min-h-full bg-cream">
      <Cintas />

      {/* Cambiar de propuesta */}
      <div className="mx-auto max-w-4xl px-5 pt-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-cacao/70 ring-1 ring-cacao/10 backdrop-blur transition hover:text-cacao"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Propuesta A (catálogo)
        </Link>
      </div>

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
          className={`${script.className} mt-4 text-5xl text-marca sm:text-6xl`}
        >
          Nuestro Menú
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 flex items-center justify-center gap-1.5 text-sm font-medium text-cacao/60"
        >
          <MapPin className="h-4 w-4 text-celeste" />
          {ajustes?.nombre_negocio ?? "Panadería Argentina La Gloria"} · {ajustes?.direccion ?? "Woodbridge, VA"}
        </motion.p>

        {ES_DEMO && (
          <p className="mt-3 inline-block rounded-full bg-corteza/20 px-3 py-1 text-xs font-semibold text-cacao ring-1 ring-corteza/40">
            ⚠ Precios y fotos de muestra (demo)
          </p>
        )}
      </header>

      {/* Secciones del menú */}
      <main className="mx-auto max-w-4xl space-y-12 px-5 pb-16">
        {cargando ? (
          <p className="py-20 text-center text-cacao/50">Calentando el horno…</p>
        ) : (
          categorias.map((cat) => {
            const items = porCategoria[cat.id] ?? [];
            if (items.length === 0) return null;
            return (
              <section key={cat.id} className="scroll-mt-6">
                {/* Barra de título estilo menú (manuscrita + slogan) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ type: "spring", damping: 20, stiffness: 200 }}
                  className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-[1.75rem] px-6 py-3 shadow-md ${headerColor(cat.color)}`}
                >
                  <h2 className={`${script.className} text-3xl leading-tight sm:text-4xl`}>
                    {cat.nombre}
                  </h2>
                  <span className="flex items-center gap-2 text-sm font-semibold italic opacity-90">
                    {cat.slogan}
                    <IconoCategoria icono={cat.icono} className="h-5 w-5" />
                  </span>
                </motion.div>

                {/* Productos con reveal + stagger */}
                <motion.ul
                  variants={contenedor}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  className="mt-4 grid gap-3 sm:grid-cols-2"
                >
                  {items.map((p) => (
                    <FilaProducto
                      key={p.id}
                      producto={p}
                      categoria={cat}
                      moneda={moneda}
                      onAbrir={setDetalle}
                    />
                  ))}
                </motion.ul>
              </section>
            );
          })
        )}
      </main>

      <SiteFooter />

      <CartButton onAbrir={() => setCarrito(true)} />
      <CartDrawer abierto={carrito} onCerrar={() => setCarrito(false)} />
      <ProductModal producto={detalle} categoria={catDetalle} onCerrar={() => setDetalle(null)} />
    </div>
  );
}
