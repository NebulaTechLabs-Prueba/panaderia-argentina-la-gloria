"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, TrendingUp, Filter, Search, Package, Wrench,
  MessageCircle, ExternalLink, Circle, Menu, ShoppingCart, CalendarDays, LogOut,
  Download, Printer, Ticket,
} from "lucide-react";
import { asset } from "@/lib/config/constants";
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
  { id: "herramientas", label: "Herramientas", icon: Wrench },
];

export function AdminPanel() {
  const router = useRouter();
  const [listo, setListo] = useState(false);
  const [sec, setSec] = useState("resumen");
  const [rango, setRango] = useState("30 días");
  const [menu, setMenu] = useState(false);
  const actual = NAV.find((n) => n.id === sec);

  // Guard simulado: sin "sesión" te manda al login. (No es seguridad real; sin
  // backend no hay auth de verdad — es solo el flujo para el equipo.)
  useEffect(() => {
    if (sessionStorage.getItem("la-gloria:admin") === "1") setListo(true);
    else router.replace("/admin/login");
  }, [router]);

  const cerrarSesion = () => {
    sessionStorage.removeItem("la-gloria:admin");
    router.replace("/admin/login");
  };

  const descargarCSV = () => {
    const filas = [
      ["Panel La Gloria — resumen (datos simulados)"],
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
            <span className="font-bold text-corteza">● Modo demo</span>
            <p className="mt-1">Datos simulados. Sin backend conectado todavía.</p>
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
            <div className="grid h-9 w-9 place-items-center rounded-full bg-marca text-sm font-bold text-cream">
              M
            </div>
          </div>
        </header>

        <main className="p-5">
          {sec === "resumen" && <Resumen />}
          {sec === "trafico" && <Trafico />}
          {sec === "conversiones" && <Conversiones />}
          {sec === "consumidor" && <Consumidor />}
          {sec === "seo" && <Seo />}
          {sec === "productos" && <Catalogo />}
          {sec === "promociones" && <Promociones />}
          {sec === "herramientas" && <Herramientas />}
        </main>
      </div>
    </div>
  );
}

function Resumen() {
  return (
    <div className="space-y-5">
      <p className="text-xs text-cacao/45">
        Cada <span className="font-semibold text-green-700">▲</span> /{" "}
        <span className="font-semibold text-red-600">▼</span> compara con el <b>período anterior</b> equivalente.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {M.kpis.map((k) => (
          <Kpi key={k.id} {...k} />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Visitas" subtitle="Este período vs. anterior" className="lg:col-span-2">
          <LineChart data={M.serieVisitas} previa={M.serieVisitasPrev} />
        </Card>
        <Card title="Fuentes de tráfico">
          <Donut segments={M.fuentes} />
        </Card>
        <Card title="Embudo hacia WhatsApp" subtitle="Vista → carrito → pedido" className="lg:col-span-2">
          <Funnel steps={M.embudo} />
        </Card>
        <Card title="Productos más vistos">
          <BarList items={M.topProductos} />
        </Card>
      </div>
    </div>
  );
}

function Trafico() {
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
      <Card title="Visitas por día" subtitle="Este período vs. anterior">
        <LineChart data={M.serieVisitas} previa={M.serieVisitasPrev} color="#2f3a7e" />
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

function Conversiones() {
  return (
    <div className="space-y-5">
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
        Los ingresos/ventas son <b>estimados</b>: reflejan la <b>intención de compra</b> (pedido enviado por
        WhatsApp), no la venta cerrada — en el local el pedido puede cambiar. Útil como tendencia para marketing.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Pedidos por WhatsApp" value="76" delta={15.2} />
        <Kpi label="Tasa de conversión" value="6,1%" delta={2.3} />
        <Kpi label="Ticket estimado" value="$28,40" delta={4.7} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Embudo del negocio" subtitle="Cada paso hacia el pedido">
          <Funnel steps={M.embudo} />
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-masa/50 p-3 text-xs text-cacao/60">
            <MessageCircle className="h-4 w-4 text-[#25D366]" />
            El evento clave es el click en “Enviar pedido por WhatsApp”.
          </p>
        </Card>
        <Card title="Productos que más convierten" subtitle="Pedidos atribuidos">
          <BarList items={M.conversionesPorProducto} color="#16a34a" />
        </Card>
      </div>

      <Card title="Rendimiento de promociones" subtitle="Clic en el banner → pedido (estimado)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cacao/10 text-left text-xs uppercase tracking-wide text-cacao/45">
                <th className="pb-2 pr-2 font-semibold">Promo</th>
                <th className="pb-2 pr-2 text-right font-semibold">Clics</th>
                <th className="pb-2 pr-2 text-right font-semibold">Pedidos</th>
                <th className="pb-2 pr-2 text-right font-semibold">Conv.</th>
                <th className="pb-2 text-right font-semibold">Ingresos est.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cacao/5">
              {M.rendimientoPromos.map((r) => (
                <tr key={r.nombre}>
                  <td className="py-2.5 pr-2 font-medium text-cacao/80">{r.nombre}</td>
                  <td className="py-2.5 pr-2 text-right tabular-nums text-cacao/70">{r.clics}</td>
                  <td className="py-2.5 pr-2 text-right tabular-nums text-cacao/70">{r.pedidos}</td>
                  <td className="py-2.5 pr-2 text-right tabular-nums font-semibold text-marca">
                    {((r.pedidos / r.clics) * 100).toFixed(0)}%
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-green-700">${r.ingresos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-cacao/45">
          Clics medidos por el evento del banner; pedidos e ingresos son estimados (intención de compra).
        </p>
      </Card>
    </div>
  );
}

function Consumidor() {
  const { armaron, enviaron } = M.abandono;
  const abandonoPct = (((armaron - enviaron) / armaron) * 100).toFixed(1);
  const [gran, setGran] = useState("Semana");
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {M.consumidorKpis.map((k) => (
          <Kpi key={k.id} {...k} />
        ))}
      </div>

      {/* Destacados por granularidad */}
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-cacao/70">Destacados</h2>
        <div className="flex gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-cacao/5">
          {M.GRANOS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGran(g)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                gran === g ? "bg-marca text-cream" : "text-cacao/60 hover:bg-masa/60"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Card title="Producto más visto" subtitle={`Por ${gran.toLowerCase()}`}>
          <p className="font-display text-2xl font-extrabold text-cacao">{M.masVistoPeriodo[gran].valor}</p>
          <p className="mt-1 text-sm text-cacao/55">{M.masVistoPeriodo[gran].detalle}</p>
        </Card>
        <Card title="Período con más pedidos" subtitle={`Por ${gran.toLowerCase()}`}>
          <p className="font-display text-2xl font-extrabold text-corteza">{M.pedidosPeriodo[gran].valor}</p>
          <p className="mt-1 text-sm text-cacao/55">{M.pedidosPeriodo[gran].detalle}</p>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Abandono de carrito" subtitle="Armaron el carrito pero no enviaron">
          <Funnel
            steps={[
              { label: "Armaron el carrito", valor: armaron },
              { label: "Enviaron por WhatsApp", valor: enviaron },
            ]}
          />
          <p className="mt-3 rounded-lg bg-masa/50 p-3 text-xs text-cacao/60">
            {armaron - enviaron} de {armaron} carritos ({abandonoPct}%) no llegaron a WhatsApp — oportunidad de
            recuperar (recordatorio, oferta, simplificar el paso).
          </p>
        </Card>
        <Card title="Tamaño de las órdenes" subtitle="Chicas, medianas y grandes">
          <Donut segments={M.tamanoOrdenes} />
        </Card>

        <Card title="Más agregados al carrito">
          <BarList items={M.masAgregado} />
        </Card>
        <Card title="Se piden en mayor cantidad" subtitle="Unidades promedio por pedido">
          <BarList items={M.cantidadPorPedido} color="#63b0dd" />
        </Card>

        <Card title="Ingresos por producto" subtitle="Estimado — el pedido no es venta confirmada">
          <BarList items={M.ingresosPorProducto} color="#16a34a" />
        </Card>
        <Card title="Los que menos se piden" subtitle="Candidatos a promo o a revisar">
          <BarList items={M.menosVendido} color="#dc2626" />
        </Card>
      </div>

      <Card title="Productos vistos juntos" subtitle="Se ven en la misma visita → ideas de combos / cross-sell">
        <ul className="divide-y divide-cacao/5">
          {M.vistosJuntos.map((v, i) => (
            <li key={i} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-cacao/70">
                <b className="text-cacao">{v.a}</b> <span className="text-cacao/40">+</span>{" "}
                <b className="text-cacao">{v.b}</b>
              </span>
              <span className="rounded-full bg-masa/60 px-2.5 py-0.5 text-xs font-semibold text-cacao/60">
                {v.veces} veces
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Interacción por día de la semana" subtitle={`Pico: ${M.diaPico}`}>
          <Columnas data={M.porDiaSemana} color="#2f3a7e" />
        </Card>
        <Card title="Interacción por mes" subtitle="Estacionalidad del año">
          <Columnas data={M.porMes} color="#ff9900" />
        </Card>
      </div>

      <Card title="Interacción por hora del día" subtitle="Cuándo entran (picos: mediodía y noche)">
        <Columnas data={M.porHora} color="#63b0dd" />
      </Card>

      <Card title="Fechas clave (Argentina + EE. UU.)" subtitle="Feriados que pueden mover la demanda">
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
          <CalendarDays className="h-4 w-4" /> A futuro estas fechas se superponen a los gráficos para explicar los
          picos de demanda.
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
        <Card title="Palabras clave" subtitle="Search Console (simulado)" className="lg:col-span-2">
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
          <ExternalLink className="h-4 w-4" /> Cómo se conecta (cuando haya backend)
        </p>
        <p className="mt-2">
          El sitio público emite eventos (ver producto, agregar al carrito, enviar por WhatsApp). GA4 recibe el
          tráfico general; los eventos propios se guardan en Supabase para el embudo; Search Console alimenta el
          SEO. Este panel solo lee y muestra. Hoy todo es simulado.
        </p>
      </div>
    </div>
  );
}
