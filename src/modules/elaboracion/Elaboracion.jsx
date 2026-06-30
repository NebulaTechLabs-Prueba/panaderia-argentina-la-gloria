"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { Plus, Check, ChevronDown, ShoppingBag } from "lucide-react";
import { getCategorias, getProductos } from "@/lib/data";
import { useNegocio, useMoneda } from "@/modules/negocio/NegocioProvider";
import { useCarrito } from "@/modules/carrito/CarritoProvider";
import { formatCentavos } from "@/lib/money/formatCentavos";
import { EscenaModal } from "./EscenaModal";
import { CartButton } from "@/modules/carrito/CartButton";
import { CartDrawer } from "@/modules/carrito/CartDrawer";
import { SiteFooter } from "@/modules/negocio/SiteFooter";
import { asset } from "@/lib/config/constants";
import { playHover } from "@/lib/sound/ding";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Partículas de harina en el hero (WebGL), diferido y sin SSR.
const Particles3D = dynamic(() => import("./Particles3D"), { ssr: false, loading: () => null });

// Fondos de producción (amasado, harina, horno, panadería) para las escenas.
const PROD = ["prod-1", "prod-2", "prod-3", "prod-5", "prod-6", "prod-7", "prod-8", "prod-9"];

function AddBtn({ producto }) {
  const { agregar } = useCarrito();
  const [ok, setOk] = useState(false);
  if (!producto.disponible) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        agregar(producto, 1);
        setOk(true);
        setTimeout(() => setOk(false), 1100);
      }}
      aria-label={`Agregar ${producto.nombre}`}
      className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cream text-cacao shadow-lg transition hover:scale-110 active:scale-90"
    >
      {ok ? <Check className="h-5 w-5" /> : <Plus className="h-6 w-6" strokeWidth={2.6} />}
    </button>
  );
}

// Propuesta D: "La Elaboración" — showcase cinematográfico, una escena por producto.
export function Elaboracion() {
  const ajustes = useNegocio();
  const moneda = useMoneda();
  const root = useRef(null);
  const lenisRef = useRef(null);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [detalle, setDetalle] = useState(null);

  // Scroll suave (Lenis) sincronizado con ScrollTrigger.
  useEffect(() => {
    let lenis;
    let raf;
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      raf = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    });
    return () => {
      if (raf) gsap.ticker.remove(raf);
      if (lenis) lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

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

  // Solo productos CON imagen (cada uno es una escena exclusiva).
  const escenas = useMemo(() => productos.filter((p) => p.imagen_url), [productos]);
  const nombreCat = (id) => categorias.find((c) => c.id === id)?.nombre ?? "";
  const catDetalle = categorias.find((c) => c.id === detalle?.categoria_id);

  useGSAP(
    () => {
      if (cargando) return;
      const splits = [];

      // Hero
      const htl = gsap.timeline({ defaults: { ease: "power3.out" } });
      const hs = new SplitType(".hero-title", { types: "words, chars" });
      splits.push(hs);
      htl
        .from(".hero-kicker", { y: 20, opacity: 0, duration: 0.6 })
        .from(hs.chars, { yPercent: 120, opacity: 0, stagger: 0.025, duration: 0.7 }, "-=0.2")
        .from(".hero-sub", { y: 20, opacity: 0, duration: 0.6 }, "-=0.3")
        .from(".hero-hint", { opacity: 0, y: -8, duration: 0.5 }, "-=0.1");
      gsap.to(".hero-content", {
        yPercent: -30,
        opacity: 0,
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-bg", {
        scale: 1.25,
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });

      // Escenas
      gsap.utils.toArray(".escena").forEach((sec) => {
        // fondo: parallax + zoom suave
        gsap.fromTo(
          sec.querySelector(".escena-bg"),
          { yPercent: -8, scale: 1.12 },
          {
            yPercent: 8,
            scale: 1.18,
            ease: "none",
            scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
        // media del producto: aparece y crece atado al scroll
        const media = sec.querySelector(".escena-media");
        if (media) {
          gsap.fromTo(
            media,
            { y: 80, opacity: 0, scale: 0.8, rotate: -3 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotate: 0,
              ease: "power2.out",
              scrollTrigger: { trigger: sec, start: "top 80%", end: "top 35%", scrub: true },
            }
          );
        }
        // título letra por letra
        const titulo = sec.querySelector(".escena-title");
        if (titulo) {
          const s = new SplitType(titulo, { types: "words, chars" });
          splits.push(s);
          gsap.from(s.chars, {
            yPercent: 110,
            opacity: 0,
            stagger: 0.02,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: sec, start: "top 70%" },
          });
        }
        // textos / acciones
        gsap.from(sec.querySelectorAll(".escena-rev"), {
          y: 30,
          opacity: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: sec, start: "top 65%" },
        });
      });

      ScrollTrigger.refresh();
      return () => splits.forEach((s) => s.revert());
    },
    { scope: root, dependencies: [cargando] }
  );

  return (
    <div ref={root} className="relative bg-cacao text-cream">
      {/* ── HERO ── */}
      <section className="hero relative flex h-screen items-center justify-center overflow-hidden">
        <div className="hero-bg absolute inset-0">
          {/* Video de elaboración (cuando exista el mp4); si no, muestra el poster */}
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={asset("/img/produccion/prod-4.jpg")}
          >
            <source src={asset("/video/elaboracion-hero.mp4")} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-cacao/55" />
          <div className="absolute inset-0 bg-linear-to-t from-cacao via-cacao/30 to-cacao/70" />
        </div>
        {/* partículas de harina (WebGL) */}
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <Particles3D />
        </div>

        <div className="hero-content relative z-10 px-6 text-center">
          <p className="hero-kicker font-display text-sm font-bold uppercase tracking-[0.35em] text-cream/60">
            Panadería argentina · {ajustes?.direccion ?? "Woodbridge, VA"}
          </p>
          <h1 className="hero-title mt-4 font-display text-5xl font-extrabold leading-[0.95] sm:text-8xl">
            Hecho a mano,
            <br />
            todos los días
          </h1>
          <p className="hero-sub mx-auto mt-6 max-w-xl text-lg text-cream/80">
            De la masa al mostrador: mirá nacer cada producto de La Gloria.
          </p>
          <div className="hero-hint mt-12 flex flex-col items-center gap-1 text-cream/60">
            <span className="text-xs uppercase tracking-widest">Bajá</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── ESCENAS (una por producto con foto) ── */}
      {cargando ? (
        <div className="flex h-[40vh] items-center justify-center text-cream/50">Calentando el horno…</div>
      ) : (
        escenas.map((p, i) => {
          const mediaDer = i % 2 === 1;
          const bg = PROD[i % PROD.length];
          return (
            <section key={p.id} className="escena relative flex min-h-screen items-center overflow-hidden">
              {/* fondo de producción */}
              <div className="escena-bg absolute inset-0 -z-10">
                <img src={asset(`/img/produccion/${bg}.jpg`)} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 -z-10 bg-cacao/55" />
              {/* funde arriba y abajo hacia el fondo: sin líneas entre escenas */}
              <div className="absolute inset-0 -z-10 bg-linear-to-b from-cacao via-transparent to-cacao" />

              <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-6 py-20 md:grid-cols-2 md:gap-12">
                {/* media del producto */}
                <div className={`escena-media ${mediaDer ? "md:order-2" : ""}`}>
                  <div
                    onClick={() => setDetalle(p)}
                    onMouseEnter={playHover}
                    className="group relative aspect-square cursor-pointer overflow-hidden rounded-4xl shadow-2xl ring-1 ring-white/10"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.imagen_url}
                      alt={p.nombre}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-cacao/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </div>

                {/* texto */}
                <div className={mediaDer ? "md:order-1" : ""}>
                  <p className="escena-rev font-display text-sm font-bold uppercase tracking-[0.2em] text-cream/50">
                    {String(i + 1).padStart(2, "0")} · {nombreCat(p.categoria_id)}
                  </p>
                  <h2 className="escena-title mt-2 font-display text-4xl font-extrabold leading-[1.02] sm:text-6xl">
                    {p.nombre}
                  </h2>
                  {p.descripcion && (
                    <p className="escena-rev mt-4 max-w-md text-lg leading-relaxed text-cream/75">
                      {p.descripcion}
                    </p>
                  )}
                  <div className="escena-rev mt-7 flex items-center gap-5">
                    <span className="font-display text-3xl font-extrabold text-cream">
                      {formatCentavos(p.precio_centavos, moneda)}
                    </span>
                    <AddBtn producto={p} />
                  </div>
                </div>
              </div>
            </section>
          );
        })
      )}

      {/* ── CIERRE ── */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-24 text-center">
        <div className="absolute inset-0 -z-10">
          <img src={asset("/img/produccion/prod-1.jpg")} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-b from-cacao via-cacao/65 to-cacao" />
        </div>
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-4xl font-extrabold sm:text-6xl">Del horno, a tu mesa</h2>
          <p className="mt-4 text-cream/80">Armá tu pedido y mandanos el WhatsApp, que te lo dejamos listo 🧉</p>
          <button
            type="button"
            onClick={() => lenisRef.current?.scrollTo(0, { duration: 1.4 })}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-7 py-4 font-bold text-cacao shadow-xl transition hover:bg-white active:scale-95"
          >
            <ShoppingBag className="h-5 w-5" /> Empezá tu pedido
          </button>
        </div>
      </section>

      {/* feather hacia el footer */}
      <div aria-hidden="true" className="h-24 bg-linear-to-b from-cacao to-marca" />

      <SiteFooter />

      <CartButton />
      <CartDrawer />
      <EscenaModal producto={detalle} categoria={catDetalle} onCerrar={() => setDetalle(null)} />
    </div>
  );
}
