"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { ArrowLeft, ArrowRight, ChevronDown, Plus, Check, ShoppingBag } from "lucide-react";
import { getCategorias, getProductos } from "@/lib/data";
import { useNegocio, useMoneda } from "@/modules/negocio/NegocioProvider";
import { useCarrito } from "@/modules/carrito/CarritoProvider";
import { formatCentavos } from "@/lib/money/formatCentavos";
import { ProductImage } from "@/modules/catalogo/ProductImage";
import { ProductModal } from "@/modules/catalogo/ProductModal";
import { asset } from "@/lib/config/constants";
import { CartButton } from "@/modules/carrito/CartButton";
import { CartDrawer } from "@/modules/carrito/CartDrawer";
import { LogoLaGloria } from "@/components/ui/LogoLaGloria";
import { SiteFooter } from "@/modules/negocio/SiteFooter";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Fotos reales del local/asado/inicios para el montaje cinemático del hero.
const AMBIENTE = ["amb-local", "amb-inicios", "amb-asado", "amb-local2", "amb-pizza"];

// Botón "agregar" rápido.
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
        setTimeout(() => setOk(false), 1000);
      }}
      aria-label={`Agregar ${producto.nombre}`}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-marca text-cream shadow-lg transition hover:bg-corteza hover:text-cacao active:scale-90"
    >
      {ok ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" strokeWidth={2.6} />}
    </button>
  );
}

// Cintas onduladas de marca para el fondo del hero (parallax con scroll).
function CintaSVG({ className, color }) {
  return (
    <svg className={className} viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 100 C 300 20, 600 180, 1200 60 L1200 200 L0 200 Z" fill={color} />
    </svg>
  );
}

// Propuesta C: experiencia cinemática "Entrar a La Gloria".
export function Experiencia() {
  const ajustes = useNegocio();
  const moneda = useMoneda();
  const root = useRef(null);
  const lenisRef = useRef(null);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [detalle, setDetalle] = useState(null);

  // Smooth scroll (Lenis + ScrollTrigger) scoped a esta página.
  useEffect(() => {
    let lenis;
    let raf;
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
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

  // Scroll suave hacia una sección (#slug).
  const irA = (sel) => {
    const el = typeof document !== "undefined" ? document.querySelector(sel) : null;
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -8 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

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

  // Secciones: categorías que tienen al menos una foto real, hasta 3 productos
  // (priorizando los que tienen foto).
  const secciones = useMemo(() => {
    return categorias
      .map((cat) => {
        const items = productos.filter((p) => p.categoria_id === cat.id);
        const conFoto = items.filter((p) => p.imagen_url);
        if (conFoto.length === 0) return null;
        const elegidos = [...conFoto, ...items.filter((p) => !p.imagen_url)].slice(0, 3);
        return { cat, items: elegidos };
      })
      .filter(Boolean);
  }, [categorias, productos]);

  // Productos con foto real para la cinta transportadora.
  const marquee = useMemo(() => productos.filter((p) => p.imagen_url).slice(0, 16), [productos]);

  const catDetalle = categorias.find((c) => c.id === detalle?.categoria_id);

  // Animaciones GSAP (se montan cuando los datos están listos).
  useGSAP(
    () => {
      if (cargando) return;
      const splits = [];

      // Intro
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".intro-logo", { scale: 0.6, opacity: 0, duration: 0.8, ease: "back.out(1.6)" });
      const tSplit = new SplitType(".intro-title", { types: "chars" });
      splits.push(tSplit);
      tl.from(tSplit.chars, { yPercent: 120, opacity: 0, stagger: 0.04, duration: 0.7 }, "-=0.3");
      tl.from(".intro-sub", { y: 20, opacity: 0, stagger: 0.15 }, "-=0.25");
      tl.from(".intro-hint", { opacity: 0, y: -8 }, "-=0.1");

      // Intro: se desvanece y sube al scrollear
      gsap.to(".intro-content", {
        yPercent: -25,
        opacity: 0,
        scrollTrigger: { trigger: ".intro", start: "top top", end: "bottom top", scrub: true },
      });

      // Cintas: parallax
      gsap.utils.toArray(".cinta").forEach((el, i) => {
        gsap.to(el, {
          yPercent: i % 2 ? 30 : -30,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true },
        });
      });

      // Secciones: título letra por letra + cards que entran + parallax de imagen
      gsap.utils.toArray(".cine-section").forEach((sec) => {
        const titulo = sec.querySelector(".cine-title");
        if (titulo) {
          const s = new SplitType(titulo, { types: "chars" });
          splits.push(s);
          gsap.from(s.chars, {
            yPercent: 110,
            opacity: 0,
            stagger: 0.03,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: sec, start: "top 72%" },
          });
        }
        gsap.from(sec.querySelectorAll(".cine-card"), {
          y: 90,
          opacity: 0,
          scale: 0.92,
          stagger: 0.12,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "all", // libera el transform para que el hover CSS funcione
          scrollTrigger: { trigger: sec, start: "top 65%" },
        });
        gsap.to(sec.querySelectorAll(".cine-parallax"), {
          yPercent: -10,
          ease: "none",
          scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      ScrollTrigger.refresh();
      return () => splits.forEach((s) => s.revert());
    },
    { scope: root, dependencies: [cargando] }
  );

  return (
    <div ref={root} className="relative bg-cream">
      {/* Volver */}
      <Link
        href="/"
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-1.5 rounded-full bg-cream/85 px-3 py-1.5 text-xs font-semibold text-cacao/80 shadow ring-1 ring-cacao/10 backdrop-blur transition hover:text-cacao"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Propuestas
      </Link>

      {/* ── INTRO ── */}
      <section className="intro relative flex h-screen items-center justify-center overflow-hidden bg-marca text-cream">
        {/* Montaje Ken Burns de fotos reales del local (siempre en movimiento) */}
        <div className="absolute inset-0">
          {AMBIENTE.map((a, i) => (
            <img
              key={a}
              src={asset(`/img/ambiente/${a}.jpg`)}
              alt=""
              aria-hidden="true"
              className="kenburns-img absolute inset-0 h-full w-full object-cover"
              style={{ animationDelay: `${i * 6}s` }}
            />
          ))}
          {/* video real: entrando a La Gloria (cubre el montaje; este queda de fallback) */}
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={asset("/img/ambiente/amb-local.jpg")}
          >
            <source src={asset("/video/hero.mp4")} type="video/mp4" />
          </video>
          {/* velos para legibilidad del texto */}
          <div className="absolute inset-0 bg-marca/60" />
          <div className="absolute inset-0 bg-linear-to-t from-marca via-marca/35 to-marca/80" />
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <CintaSVG className="cinta absolute -top-6 left-0 h-40 w-full" color="#FF9900" />
          <CintaSVG className="cinta absolute bottom-0 left-0 h-48 w-full rotate-180" color="#63B0DD" />
        </div>

        <div className="intro-content relative z-10 flex flex-col items-center px-5 text-center">
          <LogoLaGloria src={ajustes?.logo_url} className="intro-logo mb-6 h-24 w-24 drop-shadow-2xl" />
          <p className="intro-sub text-sm font-semibold uppercase tracking-[0.3em] text-celeste">
            Panadería argentina · {ajustes?.direccion ?? "Woodbridge, VA"}
          </p>
          <h1 className="intro-title mt-3 font-display text-6xl font-extrabold leading-none drop-shadow-xl sm:text-8xl">
            La Gloria
          </h1>
          <p className="intro-sub mt-5 max-w-md text-lg text-cream/85">
            Pasá, que está recién horneado. Pan, facturas, pizzas y la parrilla del domingo.
          </p>
          <div className="intro-hint mt-12 flex flex-col items-center gap-1 text-cream/70">
            <span className="text-xs uppercase tracking-widest">Scrolleá</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── CINTA TRANSPORTADORA (movimiento continuo) ── */}
      {marquee.length > 0 && (
        <div className="overflow-hidden border-y-4 border-corteza bg-marca py-4">
          <div className="marquee-track flex items-center gap-10 pr-10">
            {[...marquee, ...marquee].map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setDetalle(p)}
                className="group flex shrink-0 items-center gap-3"
                aria-label={`Ver ${p.nombre}`}
              >
                <img
                  src={p.imagen_url}
                  alt=""
                  aria-hidden="true"
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-corteza transition group-hover:scale-110"
                />
                <span className="whitespace-nowrap font-display text-lg font-bold text-cream underline-offset-4 group-hover:text-corteza group-hover:underline">
                  {p.nombre}
                </span>
                <span className="text-corteza">●</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── FRANJA CINEMÁTICA: el asado (video real, clickeable) ── */}
      <button
        type="button"
        onClick={() => irA("#parrilla-libre")}
        aria-label="Ver la Parrilla Libre de los domingos"
        className="group relative block h-72 w-full overflow-hidden sm:h-96"
      >
        <video
          className="slowzoom absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={asset("/img/ambiente/amb-asado.jpg")}
        >
          <source src={asset("/video/asado.mp4")} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-marca/55 transition-colors duration-500 group-hover:bg-marca/40" />
        <div className="relative flex h-full flex-col items-center justify-center gap-3 px-5 text-center">
          <p className="font-display text-3xl font-extrabold text-cream drop-shadow-lg sm:text-6xl">
            El asado de los domingos 🔥
          </p>
          <span className="inline-flex items-center gap-2 rounded-full bg-corteza px-5 py-2 font-bold text-cacao shadow-lg transition-all group-hover:gap-3.5">
            Ver la Parrilla Libre <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </button>

      {/* ── RECORRIDO ── */}
      {secciones.map(({ cat, items }, i) => (
        <section
          key={cat.id}
          id={cat.slug}
          className={`cine-section relative flex min-h-screen flex-col justify-center overflow-hidden px-5 py-24 ${
            i % 2 === 0 ? "bg-cream" : "bg-masa"
          }`}
        >
          {/* movimiento ambiental continuo (no estática) */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="drift absolute -left-24 top-12 h-72 w-72 rounded-full bg-corteza/15 blur-3xl" />
            <div className="drift-2 absolute -right-20 bottom-12 h-80 w-80 rounded-full bg-celeste/15 blur-3xl" />
          </div>

          <div className="relative mx-auto w-full max-w-6xl">
            <p className="font-display text-sm font-bold uppercase tracking-widest text-corteza">
              {String(i + 1).padStart(2, "0")} · {cat.slogan}
            </p>
            <h2 className="cine-title mt-1 font-display text-5xl font-extrabold leading-tight text-cacao sm:text-7xl">
              {cat.nombre}
            </h2>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {items.map((p) => (
                <article
                  key={p.id}
                  onClick={() => setDetalle(p)}
                  className="cine-card group cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-2"
                >
                  <div className="cine-parallax relative aspect-4/3 overflow-hidden rounded-3xl shadow-xl ring-1 ring-cacao/10 transition-all duration-300 group-hover:shadow-2xl group-hover:ring-2 group-hover:ring-corteza">
                    <ProductImage
                      src={p.imagen_url}
                      alt={p.nombre}
                      color={cat.color}
                      icono={cat.icono}
                      className="transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                    />
                    {/* overlay que se revela en hover */}
                    <div className="pointer-events-none absolute inset-0 flex items-end bg-linear-to-t from-marca/85 via-marca/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="m-3 inline-flex translate-y-3 items-center gap-1 rounded-full bg-corteza px-3 py-1 text-sm font-bold text-cacao transition-transform duration-300 group-hover:translate-y-0">
                        Ver +
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold text-cacao transition-colors group-hover:text-corteza">
                        {p.nombre}
                      </h3>
                      <span className="font-display text-xl font-extrabold text-corteza">
                        {formatCentavos(p.precio_centavos, moneda)}
                      </span>
                    </div>
                    <AddBtn producto={p} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── NUESTRA HISTORIA ── */}
      <section className="cine-section relative flex min-h-screen items-center overflow-hidden bg-cream px-5 py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="drift absolute -right-24 top-10 h-80 w-80 rounded-full bg-celeste/15 blur-3xl" />
          <div className="drift-2 absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-corteza/15 blur-3xl" />
        </div>
        <div className="relative mx-auto grid w-full max-w-5xl items-center gap-10 md:grid-cols-[0.85fr_1.15fr]">
          <div className="cine-card overflow-hidden rounded-4xl shadow-2xl ring-1 ring-cacao/10">
            <video
              className="aspect-4/5 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={asset("/img/ambiente/amb-inicios.jpg")}
            >
              <source src={asset("/video/historia.mp4")} type="video/mp4" />
            </video>
          </div>
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-corteza">
              Desde el corazón
            </p>
            <h2 className="cine-title mt-1 font-display text-4xl font-extrabold leading-[1.05] text-cacao sm:text-5xl">
              Nuestra historia
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-cacao/75">
              La Gloria nació del amor por la panadería argentina, lejos de casa. Cada
              medialuna y cada asado de domingo son un cachito de Argentina en Woodbridge,
              amasado con las manos y el cariño de siempre.
            </p>
          </div>
        </div>
      </section>

      {/* ── CIERRE ── */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-marca px-5 py-28 text-center text-cream">
        {/* manchas que derivan */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="drift absolute -left-20 top-0 h-80 w-80 rounded-full bg-corteza/25 blur-3xl" />
          <div className="drift-2 absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-celeste/25 blur-3xl" />
          <CintaSVG className="cinta absolute top-0 left-0 h-40 w-full opacity-20" color="#FF9900" />
        </div>
        {/* miniaturas de producto flotando */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {marquee.slice(0, 5).map((p, i) => (
            <img
              key={p.id}
              src={p.imagen_url}
              alt=""
              className="floaty absolute hidden h-20 w-20 rounded-full object-cover opacity-70 ring-2 ring-corteza sm:block"
              style={{
                top: `${[18, 62, 28, 70, 45][i]}%`,
                left: `${[10, 16, 80, 84, 50][i]}%`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-2xl">
          <h2 className="cine-title font-display text-4xl font-extrabold sm:text-6xl">
            ¿Se te antojó algo?
          </h2>
          <p className="mt-4 text-cream/85">Armá tu pedido y lo coordinamos por WhatsApp.</p>
          <Link
            href="/menu"
            className="pulse-soft mt-8 inline-flex items-center gap-2 rounded-full bg-corteza px-7 py-4 font-bold text-cacao shadow-xl shadow-corteza/30 transition hover:brightness-105 active:scale-95"
          >
            <ShoppingBag className="h-5 w-5" /> Ver el menú completo
          </Link>
        </div>
      </section>

      <SiteFooter />

      <CartButton />
      <CartDrawer />
      <ProductModal producto={detalle} categoria={catDetalle} onCerrar={() => setDetalle(null)} />
    </div>
  );
}
