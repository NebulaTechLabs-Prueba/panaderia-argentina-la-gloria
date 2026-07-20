"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, TrendingUp, Filter, Search, Package, Wrench,
  MessageCircle, ExternalLink, Circle, Menu, ShoppingCart, CalendarDays, LogOut,
  Download, Printer, Ticket, Settings,
} from "lucide-react";
import { asset, adminBase } from "@/lib/config/constants";
import { getSupabase } from "@/lib/supabase/client";
import { getMetricas } from "@/lib/data";
import { Ajustes } from "./Ajustes";
import { Catalogo } from "./Catalogo";
import { Promociones } from "./Promociones";
import {
  Card, Kpi, LineChart, BarList, Donut, Funnel, Columnas, Impacto, EstadoPill,
} from "./widgets";
import * as M from "./mock";

const NAV = [
  { id: "resumen", label: "Resumen", icon: LayoutDashboard },
  { id: "trafico", label: "Tráfico", icon: TrendingUp },
  { id: "conversiones", label: "Conversiones", icon: Filter },
  { id: "consumidor", label: "Consumidor", icon: ShoppingCart },
  { id: "seo", label: "SEO", icon: Search },
  { id: "productos", label: "Productos", icon: Package },
  { id: "promociones", label: "Promociones", icon: Ticket },
  { id: "ajustes", label: "Ajustes", icon: Settings },
  { id: "herramientas", label: "Herramientas", icon: Wrench },
];

export function AdminPanel() {
  const router = useRouter();
  const [listo, setListo] = useState(false);
  const [sec, setSec] = useState("resumen");
  const [rango, setRango] = useState("30 días");
  const [menu, setMenu] = useState(false);
  const [email, setEmail] = useState("");
  const actual = NAV.find((n) => n.id === sec);

  // Guard real: sin sesión de Supabase, al login.
  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) { setListo(true); setEmail(data.session.user?.email || ""); }
      else router.replace(`${adminBase()}/login`);
    });
    // Si la sesión expira o se cierra en otra pestaña, volver al login.
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace(`${adminBase()}/login`);
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  const cerrarSesion = async () => {
    await getSupabase().auth.signOut();
    router.replace(`${adminBase()}/login`);
  };

  const descargarCSV = () => {
    const filas = [
      ["Panel La Gloria — resumen (datos de muestra)"],
      [],
      ["KPI", "Valor", "Δ%"],
      ...M.kpis.map((k) => [k.label, k.value, k.delta]),
      [],
      ["Fuente de tráfico", "%"],
      ...M.fuentes.map((f) => [f.label, f.valor]),
      [],
      ["Producto más visto", "Vistas"],
      ...M.topProductos.map((p) => [p.label, p.valor]),
      [],
      ["Embudo", "Cantidad"],
      ...M.embudo.map((e) => [e.label, e.valor]),
      [],
      ["Keyword", "Impresiones", "Clics", "CTR", "Posición"],
      ...M.keywords.map((k) => [k.q, k.imp, k.clics, k.ctr, k.pos]),
    ];
    const csv = filas.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "la-gloria-metricas.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!listo) return <div className="grid min-h-screen place-items-center bg-masa/40 text-cacao/40">Cargando…</div>;

  return (
    <div className="min-h-screen bg-masa/40 text-cacao">
      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-marca text-cream transition-transform print:hidden lg:translate-x-0 ${
          menu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/logo.png")} alt="La Gloria" className="h-11 w-11 rounded-full ring-2 ring-white/20" />
          <div className="leading-tight">
            <p className="font-display font-extrabold">La Gloria</p>
            <p className="text-xs text-cream/60">Panel de gestión</p>
          </div>
        </div>

        <nav className="mt-2 flex-1 space-y-1 px-3">
          {NAV.map((n) => {
            const on = sec === n.id;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  setSec(n.id);
                  setMenu(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  on ? "bg-white/15 text-white" : "text-cream/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <n.icon className="h-4.5 w-4.5" />
                {n.label}
                {on && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-corteza" />}
              </button>
            );
          })}
        </nav>

        <div className="space-y-2 p-4">
          <button
            type="button"
            onClick={cerrarSesion}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-cream/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Salir
          </button>
          <div className="rounded-xl bg-white/10 p-3 text-xs text-cream/70">
            <span className="font-bold text-green-300">● En vivo</span>
            <p className="mt-1">Catálogo, promos y ajustes en Supabase. La analítica todavía es de muestra.</p>
          </div>
        </div>
      </aside>

      {menu && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMenu(false)} />}

      {/* ── Contenido ── */}
      <div className="overflow-x-clip lg:pl-64 print:pl-0">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-cacao/10 bg-white/80 px-5 py-3 backdrop-blur">
          <button type="button" className="lg:hidden" onClick={() => setMenu(true)} aria-label="Menú">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex min-w-0 items-center gap-2">
            {actual && <actual.icon className="h-5 w-5 shrink-0 text-marca" />}
            <h1 className="truncate font-display text-lg font-bold">{actual?.label}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2 print:hidden sm:gap-3">
            {["resumen", "trafico", "conversiones", "consumidor", "seo"].includes(sec) && (
              <div className="hidden items-center gap-1 rounded-full bg-masa/70 p-1 sm:flex">
                {M.RANGOS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRango(r)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      rango === r ? "bg-white text-cacao shadow-sm" : "text-cacao/60 hover:text-cacao"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={descargarCSV}
              className="flex items-center gap-1.5 rounded-full bg-masa/70 px-3 py-1.5 text-xs font-semibold text-cacao/70 transition hover:bg-masa"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="hidden items-center gap-1.5 rounded-full bg-masa/70 px-3 py-1.5 text-xs font-semibold text-cacao/70 transition hover:bg-masa sm:flex"
            >
              <Printer className="h-3.5 w-3.5" /> PDF
            </button>
            <div className="flex items-center gap-2" title={email}>
              <span className="hidden max-w-48 truncate text-xs font-medium text-cacao/55 sm:inline">{email}</span>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-marca text-sm font-bold uppercase text-cream">
                {email ? email[0] : "·"}
              </span>
            </div>
          </div>
        </header>

        <main className="p-5">
          {["trafico", "seo"].includes(sec) && (
            <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
              📊 <b>Parte</b> de esta sección usa <b>datos de muestra</b>: fuentes, dispositivos, geografía y tiempo/rebote necesitan <b>Google Analytics</b>, y el SEO necesita <b>Search Console</b> (aún sin conectar). Las <b>Vistas por día</b>, el Resumen, Conversiones y Consumidor ya son reales.
            </p>
          )}
          {sec === "resumen" && <Resumen rango={rango} />}
          {sec === "trafico" && <Trafico rango={rango} />}
          {sec === "conversiones" && <Conversiones rango={rango} />}
          {sec === "consumidor" && <Consumidor rango={rango} />}
          {sec === "seo" && <Seo />}
          {sec === "productos" && <Catalogo />}
          {sec === "promociones" && <Promociones />}
          {sec === "ajustes" && <Ajustes />}
          {sec === "herramientas" && <Herramientas />}
        </main>
      </div>
    </div>
  );
}

function Resumen({ rango }) {
  const dias = parseInt(rango, 10) || 30;
  const [m, setM] = useState(null);
  useEffect(() => { setM(null); getMetricas(dias).then(setM); }, [dias]);

  if (!m) return <p className="text-sm text-cacao/50">Cargando métricas…</p>;

  if (m.totalEventos === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-cacao/5">
        <p className="font-display text-lg font-bold text-cacao">Todavía no hay datos 📊</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-cacao/55">
          El seguimiento ya está <b>activo</b>. A medida que la gente visite el sitio, vea productos y arme
          pedidos, este panel se irá llenando con datos <b>reales</b>. Volvé en unas horas.
        </p>
      </div>
    );
  }

  const serie = (m.serie || []).map((s) => s.valor);
  const maxSerie = Math.max(...serie, 0);
  const serieSes = (m.serieSesiones || []).map((s) => s.valor);
  const labelsSes = (m.serieSesiones || []).map((s) => s.dia);
  const maxSes = Math.max(...serieSes, 0);
  const vps = m.sesiones ? m.visitas / m.sesiones : 0;
  const kpis = [
    { id: "vistas", label: "Vistas", value: m.visitas.toLocaleString("es"), spark: maxSerie > 0 ? serie : undefined },
    { id: "sesiones", label: "Sesiones", value: m.sesiones.toLocaleString("es"), spark: maxSes > 0 ? serieSes : undefined },
    { id: "whatsapp", label: "Pedidos por WhatsApp", value: m.whatsapp.toLocaleString("es") },
    { id: "conv", label: "Conversión", value: `${m.conversion.toFixed(1)}%` },
  ];
  const embudo = [
    { label: "Vieron un producto", valor: m.embudo.ver },
    { label: "Agregaron al carrito", valor: m.embudo.carrito },
    { label: "Enviaron por WhatsApp", valor: m.embudo.whatsapp },
  ];
  const vacio = <p className="py-10 text-center text-sm text-cacao/45">Sin datos aún.</p>;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => <Kpi key={k.id} {...k} />)}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Sesiones por día" subtitle={`Últimos ${dias} días · ${vps.toFixed(1)} vistas por sesión`} className="lg:col-span-2">
          {maxSes > 0 ? <LineChart data={serieSes} labels={labelsSes} unidad="sesiones" /> : vacio}
        </Card>
        <Card title="Embudo hacia WhatsApp" subtitle="Vista → carrito → pedido">
          <Funnel steps={embudo} />
        </Card>
        <Card title="Productos más vistos">
          {m.topVistos.length ? <BarList items={m.topVistos} /> : vacio}
        </Card>
        <Card title="Productos más agregados al carrito" className="lg:col-span-2">
          {m.topAgregados.length ? <BarList items={m.topAgregados} color="#2f3a7e" /> : vacio}
        </Card>
      </div>
    </div>
  );
}

function Trafico({ rango }) {
  const dias = parseInt(rango, 10) || 30;
  const [m, setM] = useState(null);
  useEffect(() => { setM(null); getMetricas(dias).then(setM); }, [dias]);

  const serie = (m?.serie || []).map((s) => s.valor);
  const labels = (m?.serie || []).map((s) => s.dia);
  const previa = m?.seriePrevia || [];
  const hayPrevia = previa.some((v) => v > 0);
  const maxSerie = Math.max(...serie, 0);
  const vacio = <p className="py-10 text-center text-sm text-cacao/45">Sin datos aún.</p>;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {M.traficoKpis.map((k) => (
          <Kpi key={k.id} {...k} />
        ))}
      </div>
      <p className="rounded-lg bg-marca/5 px-3 py-2 text-xs text-cacao/60 ring-1 ring-marca/10">
        <b>Tiempo promedio</b>: cuánto se queda la gente en el sitio. <b>Tasa de rebote</b>: % que entra y se va sin
        interactuar (sin mirar productos ni agregar). Más bajo es mejor.
      </p>
      <Card
        title="Vistas por día"
        subtitle={hayPrevia ? `Últimos ${dias} días · vs. los ${dias} días previos` : `Últimos ${dias} días`}
      >
        {!m ? (
          <p className="text-sm text-cacao/50">Cargando métricas…</p>
        ) : maxSerie > 0 ? (
          <LineChart data={serie} previa={hayPrevia ? previa : undefined} labels={labels} unidad="vistas" />
        ) : (
          vacio
        )}
      </Card>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Fuentes" subtitle="De qué red o buscador llegan">
          <BarList items={M.fuentes} unit="%" />
          <p className="mt-3 text-xs text-cacao/45">
            Se detecta por el referente. Para separar bien cada red, etiquetá los links con UTMs
            (ej. <code>?utm_source=instagram</code>).
          </p>
        </Card>
        <Card title="Países" subtitle="De qué país entran">
          <BarList items={M.paises} unit="%" color="#2f3a7e" />
        </Card>
        <Card title="Ciudades" subtitle="Dónde están los visitantes">
          <BarList items={M.ciudades} color="#63b0dd" />
        </Card>
        <Card title="Estados (EE. UU.)" subtitle="Detalle geográfico del país principal">
          <BarList items={M.estados} unit="%" color="#2f3a7e" />
        </Card>
        <Card title="Dispositivos"><Donut segments={M.dispositivos} /></Card>
        <Card title="Nuevos vs. recurrentes" subtitle="Fidelización">
          <Donut segments={M.nuevosRecurrentes} />
        </Card>
      </div>

      <Card title="Campañas (UTM)" subtitle="Posteos y promos etiquetados — para medir qué acción trajo tráfico">
        <BarList items={M.campanas} color="#E1306C" />
        <p className="mt-3 text-xs text-cacao/45">
          Cada link etiquetado (ej. <code>?utm_campaign=promo-2x1</code>) aparece acá con su tráfico. Ideal para
          comparar posteos y saber cuál funcionó.
        </p>
      </Card>
    </div>
  );
}

function Conversiones({ rango }) {
  const dias = parseInt(rango, 10) || 30;
  const [m, setM] = useState(null);
  useEffect(() => { setM(null); getMetricas(dias).then(setM); }, [dias]);
  if (!m) return <p className="text-sm text-cacao/50">Cargando…</p>;
  const money = (c) => "$" + ((c || 0) / 100).toFixed(2);
  const embudo = [
    { label: "Vieron un producto", valor: m.embudo.ver },
    { label: "Agregaron al carrito", valor: m.embudo.carrito },
    { label: "Enviaron por WhatsApp", valor: m.embudo.whatsapp },
  ];
  const vacio = <p className="py-8 text-center text-sm text-cacao/45">Sin datos aún.</p>;
  return (
    <div className="space-y-5">
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
        Los pedidos reflejan la <b>intención de compra</b> (envío por WhatsApp), no la venta cerrada — en el local
        el pedido puede cambiar. Útil como tendencia para marketing.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Pedidos por WhatsApp" value={m.whatsapp.toLocaleString("es")} />
        <Kpi label="Tasa de conversión" value={`${m.conversion.toFixed(1)}%`} />
        <Kpi label="Ticket estimado" value={money(m.ticket_centavos)} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Embudo del negocio" subtitle="Cada paso hacia el pedido">
          <Funnel steps={embudo} />
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-masa/50 p-3 text-xs text-cacao/60">
            <MessageCircle className="h-4 w-4 text-[#25D366]" />
            El evento clave es el click en “Enviar pedido por WhatsApp”.
          </p>
        </Card>
        <Card title="Más agregados al carrito" subtitle="Los que más interés generan">
          {m.topAgregados.length ? <BarList items={m.topAgregados} color="#16a34a" /> : vacio}
        </Card>
      </div>
      <Card title="Rendimiento de promociones" subtitle="Clics en el banner de promo">
        {m.promoClicks.length ? (
          <BarList items={m.promoClicks} color="#ff9900" />
        ) : (
          <p className="py-6 text-center text-sm text-cacao/45">Todavía no hubo clics en promos.</p>
        )}
      </Card>
    </div>
  );
}

function Consumidor({ rango }) {
  const dias = parseInt(rango, 10) || 30;
  const [m, setM] = useState(null);
  useEffect(() => { setM(null); getMetricas(dias).then(setM); }, [dias]);
  if (!m) return <p className="text-sm text-cacao/50">Cargando…</p>;
  const money = (c) => "$" + ((c || 0) / 100).toFixed(2);
  const abandono = m.carritos_armados ? Math.round(((m.carritos_armados - m.carritos_enviaron) / m.carritos_armados) * 100) : 0;
  const kpis = [
    { id: "ticket", label: "Ticket promedio", value: money(m.ticket_centavos) },
    { id: "items", label: "Ítems por pedido", value: m.items_por_pedido.toFixed(1) },
    { id: "pedidos", label: "Pedidos", value: m.whatsapp.toLocaleString("es") },
    { id: "abandono", label: "Abandono de carrito", value: `${abandono}%` },
  ];
  const tamanos = [
    { label: "Chicas (1–2)", valor: m.tamanos.chicas, color: "#63b0dd" },
    { label: "Medianas (3–4)", valor: m.tamanos.medianas, color: "#2f3a7e" },
    { label: "Grandes (5+)", valor: m.tamanos.grandes, color: "#ff9900" },
  ];
  const hayTamanos = tamanos.some((t) => t.valor > 0);
  const hayDow = m.porDiaSemana.some((d) => d.valor > 0);
  const vacio = <p className="py-8 text-center text-sm text-cacao/45">Sin datos aún.</p>;
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => <Kpi key={k.id} {...k} />)}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Abandono de carrito" subtitle="Armaron el carrito pero no enviaron">
          <Funnel steps={[{ label: "Armaron el carrito", valor: m.carritos_armados }, { label: "Enviaron por WhatsApp", valor: m.carritos_enviaron }]} />
          <p className="mt-3 rounded-lg bg-masa/50 p-3 text-xs text-cacao/60">
            {m.carritos_armados - m.carritos_enviaron} de {m.carritos_armados} carritos ({abandono}%) no llegaron a
            WhatsApp — oportunidad de recuperar (recordatorio, oferta, simplificar el paso).
          </p>
        </Card>
        <Card title="Tamaño de las órdenes" subtitle="Por cantidad de ítems">
          {hayTamanos ? <Donut segments={tamanos} /> : vacio}
        </Card>
        <Card title="Más agregados al carrito">
          {m.topAgregados.length ? <BarList items={m.topAgregados} /> : vacio}
        </Card>
        <Card title="Más vistos">
          {m.topVistos.length ? <BarList items={m.topVistos} color="#63b0dd" /> : vacio}
        </Card>
      </div>

      <Card title="Vistas por día de la semana" subtitle="Cuándo entran más al sitio">
        {hayDow ? <Columnas data={m.porDiaSemana} color="#2f3a7e" /> : vacio}
      </Card>

      <Card title="Fechas clave (Argentina + EE. UU.)" subtitle="Feriados que pueden mover la demanda (referencia)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cacao/10 text-left text-xs uppercase tracking-wide text-cacao/45">
                <th className="pb-2 pr-2 font-semibold">Fecha</th>
                <th className="pb-2 pr-2 font-semibold">Fecha clave</th>
                <th className="pb-2 pr-2 font-semibold">País</th>
                <th className="pb-2 pr-2 font-semibold">Impacto</th>
                <th className="pb-2 font-semibold">Por qué</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cacao/5">
              {M.feriados.map((f, i) => (
                <tr key={`${f.fecha}-${i}`}>
                  <td className="whitespace-nowrap py-2.5 pr-2 font-semibold text-marca">{f.fecha}</td>
                  <td className="py-2.5 pr-2 font-medium text-cacao/85">{f.nombre}</td>
                  <td className="py-2.5 pr-2">{f.pais}</td>
                  <td className="py-2.5 pr-2">
                    <Impacto nivel={f.impacto} />
                  </td>
                  <td className="py-2.5 text-cacao/60">{f.nota}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 flex items-center gap-2 text-xs text-cacao/50">
          <CalendarDays className="h-4 w-4" /> Calendario de referencia (curado) para anticipar picos de demanda.
        </p>
      </Card>
    </div>
  );
}

function Seo() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {M.seoKpis.map((k) => (
          <Kpi key={k.id} {...k} />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Palabras clave" subtitle="Search Console (datos de muestra)" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cacao/10 text-left text-xs uppercase tracking-wide text-cacao/45">
                  <th className="pb-2 font-semibold">Consulta</th>
                  <th className="pb-2 text-right font-semibold">Impr.</th>
                  <th className="pb-2 text-right font-semibold">Clics</th>
                  <th className="pb-2 text-right font-semibold">CTR</th>
                  <th className="pb-2 text-right font-semibold">Pos.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cacao/5">
                {M.keywords.map((k) => (
                  <tr key={k.q}>
                    <td className="py-2.5 pr-2 font-medium text-cacao/80">{k.q}</td>
                    <td className="py-2.5 text-right tabular-nums text-cacao/70">{k.imp.toLocaleString("es")}</td>
                    <td className="py-2.5 text-right tabular-nums text-cacao/70">{k.clics}</td>
                    <td className="py-2.5 text-right tabular-nums text-cacao/70">{k.ctr}</td>
                    <td className="py-2.5 text-right tabular-nums font-semibold text-marca">{k.pos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Salud SEO" subtitle="Checklist">
          <ul className="space-y-2.5">
            {M.seoChecklist.map((c) => (
              <li key={c.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-cacao/75">{c.label}</span>
                <EstadoPill estado={c.estado} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Herramientas() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl bg-marca/10 p-5 ring-1 ring-marca/20 lg:col-span-2">
        <h3 className="font-display font-bold text-cacao">Datos del negocio</h3>
        <p className="mt-1 text-sm text-cacao/60">
          La dirección, el link de Maps, horarios, redes y mensajes ahora se editan en la
          sección <b>Ajustes</b> (se guardan en Supabase y se reflejan en el sitio).
        </p>
      </div>
      {M.herramientas.map((h) => (
        <div key={h.nombre} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-cacao/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-cacao">{h.nombre}</h3>
              <p className="text-sm text-cacao/55">{h.para}</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-masa/70 px-2.5 py-1 text-xs font-semibold text-cacao/60">
              <Circle className="h-2 w-2 fill-current text-amber-500" /> {h.estado}
            </span>
          </div>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-cacao/45">
            {h.campo}
          </label>
          <input
            disabled
            placeholder={h.placeholder}
            className="mt-1 w-full rounded-lg border border-cacao/10 bg-masa/30 px-3 py-2 text-sm text-cacao/60 placeholder:text-cacao/35"
          />
          <p className="mt-3 text-xs leading-relaxed text-cacao/55">{h.nota}</p>
        </div>
      ))}
      <div className="rounded-2xl border border-dashed border-cacao/20 p-5 text-sm text-cacao/55 lg:col-span-2">
        <p className="flex items-center gap-2 font-semibold text-cacao/70">
          <ExternalLink className="h-4 w-4" /> Qué falta para ver métricas reales
        </p>
        <p className="mt-2">
          Los productos, promociones y ajustes ya se gestionan desde este panel y se reflejan en el sitio al
          instante. Para que la analítica deje de ser de muestra falta activar el seguimiento del sitio: Google
          Analytics para el tráfico y el registro de eventos (ver producto → agregar al carrito → enviar por
          WhatsApp) para el embudo, más Search Console para el SEO.
        </p>
      </div>
    </div>
  );
}
