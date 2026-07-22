"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Filter, Package, Wrench,
  MessageCircle, ExternalLink, Circle, Menu, ShoppingCart, CalendarDays, LogOut,
  Download, Printer, Ticket, Settings, Megaphone, Save, Loader2, ArrowLeftRight,
  Pencil, Trash2, Plus, X,
} from "lucide-react";
import { asset, adminBase } from "@/lib/config/constants";
import { getSupabase } from "@/lib/supabase/client";
import { getMetricas, getMetricasRango, getProductos } from "@/lib/data";
import { Ajustes } from "./Ajustes";
import { Catalogo } from "./Catalogo";
import { Promociones } from "./Promociones";
import {
  Card, Kpi, LineChart, BarList, Donut, Funnel, Columnas, Impacto,
} from "./widgets";
import * as M from "./mock";

const NAV = [
  { id: "resumen", label: "Resumen", icon: LayoutDashboard },
  { id: "conversiones", label: "Conversiones", icon: Filter },
  { id: "consumidor", label: "Consumidor", icon: ShoppingCart },
  { id: "comparativa", label: "Comparativa", icon: ArrowLeftRight },
  { id: "campanas", label: "Campañas", icon: Megaphone },
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
  const [rangosOpc, setRangosOpc] = useState([7, 30, 90]);
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

  // Opciones del selector de rango, configuradas en Ajustes.
  useEffect(() => {
    getSupabase().from("business_settings").select("rangos_dias").eq("id", 1).single().then(({ data }) => {
      const arr = Array.isArray(data?.rangos_dias) && data.rangos_dias.length ? data.rangos_dias : [7, 30, 90];
      setRangosOpc(arr);
      setRango((prev) => (arr.includes(parseInt(prev, 10)) ? prev : `${arr.includes(30) ? 30 : arr[0]} días`));
    });
  }, []);

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
            {["resumen", "conversiones", "consumidor"].includes(sec) && (
              <RangoSelector opciones={rangosOpc} rango={rango} setRango={setRango} />
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
          {sec === "resumen" && <Resumen rango={rango} />}
          {sec === "conversiones" && <Conversiones rango={rango} />}
          {sec === "consumidor" && <Consumidor rango={rango} />}
          {sec === "comparativa" && <Comparativa />}
          {sec === "campanas" && <Campanas />}
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
        <Card title="Sesiones por día" subtitle={`Personas por día · ${vps.toFixed(1)} vistas por sesión`} className="lg:col-span-2">
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
  const hayFranja = (m.porFranja || []).some((f) => f.valor > 0);
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
        <Card title="Más pedidos (unidades)" subtitle="Lo que más se pidió por WhatsApp" className="lg:col-span-2">
          {m.topPedidos?.length ? <BarList items={m.topPedidos} color="#16a34a" /> : vacio}
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Por día de la semana" subtitle="Qué días hay más movimiento (Lun–Dom)">
          {hayDow ? <Columnas data={m.porDiaSemana} color="#2f3a7e" /> : vacio}
        </Card>
        <Card title="Franja horaria" subtitle="En qué momento del día interactúan más (hora de Virginia)">
          {hayFranja ? <Columnas data={m.porFranja} color="#ff9900" /> : vacio}
        </Card>
      </div>

      <FechasClave />
    </div>
  );
}

// ── Fechas clave (CRUD real en Supabase, tabla fechas_clave) ──
const PAISES_FC = ["🇦🇷", "🇺🇸", "🇺🇸🇦🇷"];
const IMPACTOS_FC = ["alto", "medio", "bajo"];
const MESES_ABR = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const INPUT_FC = "mt-1 w-full rounded-lg border border-cacao/15 bg-white px-2 py-1.5 text-sm font-normal text-cacao outline-none focus:border-marca";
const FC_VACIA = { fecha: "", nombre: "", pais: "🇦🇷", impacto: "medio", nota: "" };
const fmtFechaClave = (iso) => {
  if (!iso) return "—";
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${MESES_ABR[(m || 1) - 1]}`;
};
const mesDiaFC = (iso) => {
  const [, m, d] = (iso || "").split("-").map(Number);
  return (m || 0) * 100 + (d || 0);
};

function FechasClave() {
  const supabase = getSupabase();
  const [lista, setLista] = useState(null);
  const [edit, setEdit] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const cargar = () => supabase.from("fechas_clave").select("*").then(({ data }) => setLista(data || []));
  useEffect(() => { cargar(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function guardar(e) {
    e.preventDefault();
    if (!edit.fecha || !edit.nombre.trim()) return;
    setGuardando(true);
    const row = { fecha: edit.fecha, nombre: edit.nombre.trim(), pais: edit.pais, impacto: edit.impacto, nota: edit.nota?.trim() || null };
    if (edit.id) await supabase.from("fechas_clave").update(row).eq("id", edit.id);
    else await supabase.from("fechas_clave").insert(row);
    setGuardando(false);
    setEdit(null);
    cargar();
  }
  async function borrar(id) {
    if (!window.confirm("¿Eliminar esta fecha clave?")) return;
    await supabase.from("fechas_clave").delete().eq("id", id);
    cargar();
  }

  const ordenadas = (lista || []).slice().sort((a, b) => mesDiaFC(a.fecha) - mesDiaFC(b.fecha));

  return (
    <Card
      title="Fechas clave (Argentina + EE. UU.)"
      subtitle="Feriados que pueden mover la demanda — editables por el equipo"
      action={
        <button type="button" onClick={() => setEdit({ ...FC_VACIA })} className="inline-flex items-center gap-1 rounded-full bg-marca px-3 py-1.5 text-xs font-bold text-cream transition hover:brightness-110">
          <Plus className="h-4 w-4" /> Agregar
        </button>
      }
    >
      {edit && (
        <form onSubmit={guardar} className="mb-4 grid gap-2 rounded-xl bg-masa/40 p-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-cacao/60">Fecha
            <input type="date" required value={edit.fecha} onChange={(e) => setEdit({ ...edit, fecha: e.target.value })} className={INPUT_FC} />
          </label>
          <label className="text-xs font-semibold text-cacao/60">Nombre
            <input required value={edit.nombre} onChange={(e) => setEdit({ ...edit, nombre: e.target.value })} placeholder="Ej: Día del Amigo" className={INPUT_FC} />
          </label>
          <label className="text-xs font-semibold text-cacao/60">País
            <select value={edit.pais} onChange={(e) => setEdit({ ...edit, pais: e.target.value })} className={INPUT_FC}>
              {PAISES_FC.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-cacao/60">Impacto
            <select value={edit.impacto} onChange={(e) => setEdit({ ...edit, impacto: e.target.value })} className={INPUT_FC}>
              {IMPACTOS_FC.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-cacao/60 sm:col-span-2">Por qué (nota)
            <input value={edit.nota || ""} onChange={(e) => setEdit({ ...edit, nota: e.target.value })} placeholder="Ej: Muchas reuniones → pedidos grupales." className={INPUT_FC} />
          </label>
          <div className="flex items-center gap-2 sm:col-span-2">
            <button type="submit" disabled={guardando} className="inline-flex items-center gap-1 rounded-full bg-marca px-4 py-2 text-xs font-bold text-cream transition hover:brightness-110 disabled:opacity-60">
              {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Guardar
            </button>
            <button type="button" onClick={() => setEdit(null)} className="rounded-full px-4 py-2 text-xs font-semibold text-cacao/60 hover:text-cacao">Cancelar</button>
          </div>
        </form>
      )}

      {!lista ? (
        <p className="text-sm text-cacao/50">Cargando…</p>
      ) : ordenadas.length === 0 ? (
        <p className="py-6 text-center text-sm text-cacao/45">Todavía no hay fechas clave. Agregá la primera con el botón de arriba.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cacao/10 text-left text-xs uppercase tracking-wide text-cacao/45">
                <th className="pb-2 pr-2 font-semibold">Fecha</th>
                <th className="pb-2 pr-2 font-semibold">Fecha clave</th>
                <th className="pb-2 pr-2 font-semibold">País</th>
                <th className="pb-2 pr-2 font-semibold">Impacto</th>
                <th className="pb-2 pr-2 font-semibold">Por qué</th>
                <th className="pb-2 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cacao/5">
              {ordenadas.map((f) => (
                <tr key={f.id}>
                  <td className="whitespace-nowrap py-2.5 pr-2 font-semibold text-marca">{fmtFechaClave(f.fecha)}</td>
                  <td className="py-2.5 pr-2 font-medium text-cacao/85">{f.nombre}</td>
                  <td className="py-2.5 pr-2">{f.pais}</td>
                  <td className="py-2.5 pr-2"><Impacto nivel={f.impacto} /></td>
                  <td className="py-2.5 pr-2 text-cacao/60">{f.nota}</td>
                  <td className="py-2.5 text-right">
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={() => setEdit({ id: f.id, fecha: f.fecha, nombre: f.nombre, pais: f.pais, impacto: f.impacto, nota: f.nota || "" })} className="rounded p-1 text-cacao/40 transition hover:bg-masa/60 hover:text-marca" aria-label="Editar"><Pencil className="h-4 w-4" /></button>
                      <button type="button" onClick={() => borrar(f.id)} className="rounded p-1 text-cacao/40 transition hover:bg-red-50 hover:text-red-600" aria-label="Eliminar"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 flex items-center gap-2 text-xs text-cacao/50">
        <CalendarDays className="h-4 w-4" /> Calendario para anticipar picos de demanda. Lo administra el equipo.
      </p>
    </Card>
  );
}

// Selector de rango: muestra solo las opciones configuradas en Ajustes.
function RangoSelector({ opciones, rango, setRango }) {
  if (!opciones?.length) return null;
  return (
    <div className="hidden items-center gap-1 rounded-full bg-masa/70 p-1 sm:flex">
      {opciones.map((n) => {
        const r = `${n} días`;
        return (
          <button
            key={n}
            type="button"
            onClick={() => setRango(r)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${rango === r ? "bg-white text-cacao shadow-sm" : "text-cacao/60 hover:text-cacao"}`}
          >
            {r}
          </button>
        );
      })}
    </div>
  );
}

// Compara dos períodos de tiempo (personalizables) en varias métricas.
const COMP_METRICAS = [
  { key: "vistas", label: "Vistas" },
  { key: "sesiones", label: "Sesiones" },
  { key: "interacciones", label: "Interacciones con productos" },
  { key: "carritos", label: "Carritos armados" },
  { key: "pedidos", label: "Pedidos (conversiones)" },
  { key: "conversion", label: "Conversión", pct: true },
  { key: "promos", label: "Clics en promociones" },
  { key: "campanas", label: "Visitas con campaña (UTM)" },
];
const isoDia = (offset) => new Date(Date.now() - offset * 86400000).toISOString().slice(0, 10);
const desdeISO = (s) => `${s}T00:00:00.000Z`;
const hastaISO = (s) => new Date(Date.parse(`${s}T00:00:00.000Z`) + 86400000).toISOString();
const PERIODO_COLORS = ["#94a3b8", "#2f3a7e", "#ff9900", "#63b0dd", "#16a34a", "#db2777"];
const ddmm = (iso) => { const p = (iso || "").split("-"); return p.length === 3 ? `${p[2]}/${p[1]}` : iso; };

function RangoCampo({ titulo, val, set, color, onRemove }) {
  return (
    <div className="rounded-xl bg-masa/40 p-3">
      <p className="mb-2 flex items-center gap-2 text-sm font-bold text-cacao">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} /> {titulo}
        {onRemove && (
          <button type="button" onClick={onRemove} className="ml-auto text-cacao/40 transition hover:text-red-600" aria-label="Quitar período">
            <X className="h-4 w-4" />
          </button>
        )}
      </p>
      <input
        value={val.nombre || ""}
        onChange={(e) => set({ ...val, nombre: e.target.value })}
        placeholder="Nombre (opcional): ej. Navidad"
        className="mb-2 w-full rounded-lg border border-cacao/15 bg-white px-2 py-1.5 text-sm text-cacao outline-none focus:border-marca"
      />
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <input type="date" value={val.desde} max={val.hasta} onChange={(e) => set({ ...val, desde: e.target.value })} className="rounded-lg border border-cacao/15 bg-white px-2 py-1.5 text-cacao outline-none focus:border-marca" />
        <span className="text-cacao/40">a</span>
        <input type="date" value={val.hasta} min={val.desde} onChange={(e) => set({ ...val, hasta: e.target.value })} className="rounded-lg border border-cacao/15 bg-white px-2 py-1.5 text-cacao outline-none focus:border-marca" />
      </div>
    </div>
  );
}

// Tabla de comparación: columnas = períodos, filas = métricas o productos.
function TablaComparativa({ columnas, filas, cellDelta }) {
  const fmt = (v, pct) => (pct ? `${(v || 0).toFixed(1)}%` : (v || 0).toLocaleString("es"));
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-cacao/10 text-left text-xs uppercase tracking-wide text-cacao/45">
            <th className="pb-2 pr-2 font-semibold">Concepto</th>
            {columnas.map((c, i) => (
              <th key={i} className="pb-2 pr-2 text-right font-semibold">
                {c.nombre ? c.nombre : `P${i + 1}`}
                <span className="block font-normal normal-case text-cacao/35">{ddmm(c.desde)}–{ddmm(c.hasta)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-cacao/5">
          {filas.map((f) => (
            <tr key={f.label}>
              <td className="py-2.5 pr-2 font-medium text-cacao/80">{f.label}</td>
              {f.valores.map((v, i) => (
                <td key={i} className="py-2.5 pr-2 text-right tabular-nums">
                  <span className="font-semibold text-cacao">{fmt(v, f.pct)}</span>
                  {cellDelta(f.valores[0], v, i)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Comparativa() {
  const [modo, setModo] = useState("general");
  const [periodos, setPeriodos] = useState([
    { nombre: "", desde: isoDia(59), hasta: isoDia(30) },
    { nombre: "", desde: isoDia(29), hasta: isoDia(0) },
  ]);
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [productos, setProductos] = useState([]);
  const [prodSel, setProdSel] = useState([]);
  const [campSel, setCampSel] = useState([]);
  const [metricaProd, setMetricaProd] = useState("vistas");
  const [metricaCamp, setMetricaCamp] = useState("visitas");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => { getProductos().then((ps) => setProductos((ps || []).map((p) => ({ id: p.id, nombre: p.nombre })))); }, []);

  // Recalcula solo cuando cambian las fechas o la cantidad de períodos.
  const periodosKey = periodos.map((p) => `${p.desde}|${p.hasta}`).join(",");
  useEffect(() => {
    let cancel = false;
    setCargando(true);
    Promise.all(periodos.map((p) => getMetricasRango(desdeISO(p.desde), hastaISO(p.hasta))))
      .then((res) => { if (!cancel) { setDatos(res); setCargando(false); } });
    return () => { cancel = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodosKey]);

  const setPeriodo = (i, val) => setPeriodos((ps) => ps.map((p, idx) => (idx === i ? val : p)));
  const addPeriodo = () => setPeriodos((ps) => [...ps, { nombre: "", desde: isoDia(29), hasta: isoDia(0) }]);
  const rmPeriodo = (i) => setPeriodos((ps) => ps.filter((_, idx) => idx !== i));
  const toggleProd = (id) => setProdSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleCamp = (c) => setCampSel((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));

  const cellDelta = (base, v, i) => {
    if (i === 0) return null;
    const d = base ? ((v - base) / base) * 100 : v ? 100 : 0;
    return (
      <span className={`ml-1 text-[10px] font-semibold ${d === 0 ? "text-cacao/30" : d > 0 ? "text-green-600" : "text-red-600"}`}>
        {d >= 0 ? "▲" : "▼"}{Math.abs(d).toFixed(0)}%
      </span>
    );
  };

  const prodsFiltrados = busqueda ? productos.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase())) : productos;
  const campanasDisponibles = datos ? [...new Set(datos.flatMap((d) => Object.keys(d.porCampana || {})))].sort() : [];
  const filas =
    modo === "general" ? COMP_METRICAS.map((m) => ({ label: m.label, pct: m.pct, valores: (datos || []).map((d) => d[m.key]) }))
    : modo === "producto" ? prodSel.map((id) => ({ label: productos.find((p) => p.id === id)?.nombre || id, valores: (datos || []).map((d) => d.porProducto?.[id]?.[metricaProd] || 0) }))
    : campSel.map((c) => ({ label: c, valores: (datos || []).map((d) => d.porCampana?.[c]?.[metricaCamp] || 0) }));

  return (
    <div className="space-y-5">
      <Card title="Comparar" subtitle="Elegí N períodos y qué querés comparar">
        <div className="mb-4 inline-flex flex-wrap rounded-full bg-masa/60 p-1 text-sm">
          {[["general", "Métricas generales"], ["producto", "Por producto"], ["campana", "Por campaña"]].map(([k, l]) => (
            <button key={k} type="button" onClick={() => setModo(k)} className={`rounded-full px-3 py-1 font-semibold transition ${modo === k ? "bg-white text-cacao shadow-sm" : "text-cacao/60"}`}>{l}</button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {periodos.map((p, i) => (
            <RangoCampo key={i} titulo={`Período ${i + 1}`} val={p} set={(v) => setPeriodo(i, v)} color={PERIODO_COLORS[i % PERIODO_COLORS.length]} onRemove={periodos.length > 2 ? () => rmPeriodo(i) : undefined} />
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="button" onClick={addPeriodo} className="inline-flex items-center gap-1 rounded-full border border-cacao/20 px-3 py-1.5 text-xs font-semibold text-cacao/70 transition hover:border-marca hover:text-marca">
            <Plus className="h-4 w-4" /> Agregar período
          </button>
          <span className="inline-flex items-center gap-1 text-xs text-cacao/50">
            {cargando ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Calculando…</> : "Se actualiza solo al cambiar las fechas"}
          </span>
        </div>

        {modo === "producto" && (
          <div className="mt-4 rounded-xl bg-masa/40 p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-bold text-cacao">Productos a comparar</span>
              <div className="inline-flex rounded-full bg-white p-1 text-xs shadow-sm">
                {[["vistas", "Veces visto"], ["agregados", "Agregados al carrito"], ["unidades", "Unidades pedidas"]].map(([k, l]) => (
                  <button key={k} type="button" onClick={() => setMetricaProd(k)} className={`rounded-full px-2.5 py-1 font-semibold transition ${metricaProd === k ? "bg-marca text-cream" : "text-cacao/60"}`}>{l}</button>
                ))}
              </div>
            </div>
            {prodSel.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {prodSel.map((id) => (
                  <span key={id} className="inline-flex items-center gap-1 rounded-full bg-marca/10 px-2.5 py-1 text-xs font-semibold text-marca">
                    {productos.find((p) => p.id === id)?.nombre || id}
                    <button type="button" onClick={() => toggleProd(id)} className="transition hover:text-red-600"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            )}
            <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar producto…" className="mb-2 w-full rounded-lg border border-cacao/15 bg-white px-3 py-1.5 text-sm text-cacao outline-none focus:border-marca" />
            <div className="max-h-44 overflow-y-auto rounded-lg bg-white p-1">
              {prodsFiltrados.map((p) => (
                <label key={p.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-masa/40">
                  <input type="checkbox" checked={prodSel.includes(p.id)} onChange={() => toggleProd(p.id)} />
                  <span className="text-cacao/80">{p.nombre}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {modo === "campana" && (
          campanasDisponibles.length === 0 ? (
            <p className="mt-4 rounded-xl bg-masa/40 p-3 text-sm text-cacao/55">
              Todavía no hay campañas con tráfico (links con <code className="rounded bg-white px-1">?utm_campaign=…</code>) en los períodos elegidos.
            </p>
          ) : (
            <div className="mt-4 rounded-xl bg-masa/40 p-3">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-bold text-cacao">Campañas a comparar</span>
                <div className="inline-flex rounded-full bg-white p-1 text-xs shadow-sm">
                  {[["visitas", "Visitas"], ["carritos", "Carritos"], ["pedidos", "Pedidos"]].map(([k, l]) => (
                    <button key={k} type="button" onClick={() => setMetricaCamp(k)} className={`rounded-full px-2.5 py-1 font-semibold transition ${metricaCamp === k ? "bg-marca text-cream" : "text-cacao/60"}`}>{l}</button>
                  ))}
                </div>
              </div>
              {campSel.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {campSel.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1 rounded-full bg-marca/10 px-2.5 py-1 text-xs font-semibold text-marca">
                      {c}<button type="button" onClick={() => toggleCamp(c)} className="transition hover:text-red-600"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              )}
              <div className="max-h-44 overflow-y-auto rounded-lg bg-white p-1">
                {campanasDisponibles.map((c) => (
                  <label key={c} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-masa/40">
                    <input type="checkbox" checked={campSel.includes(c)} onChange={() => toggleCamp(c)} />
                    <span className="text-cacao/80">{c}</span>
                  </label>
                ))}
              </div>
            </div>
          )
        )}
      </Card>

      <Card title="Resultado" subtitle={modo === "producto" ? "Por producto entre períodos" : modo === "campana" ? "Por campaña entre períodos" : "Métricas generales por período"}>
        {!datos ? (
          <p className="text-sm text-cacao/50">Cargando…</p>
        ) : modo === "producto" && prodSel.length === 0 ? (
          <p className="py-6 text-center text-sm text-cacao/45">Elegí uno o más productos arriba para compararlos entre los períodos.</p>
        ) : modo === "campana" && campSel.length === 0 ? (
          <p className="py-6 text-center text-sm text-cacao/45">Elegí una o más campañas arriba para compararlas entre los períodos.</p>
        ) : (
          <TablaComparativa columnas={periodos} filas={filas} cellDelta={cellDelta} />
        )}
      </Card>
    </div>
  );
}

function Campanas() {
  const [camp, setCamp] = useState(null);
  useEffect(() => { getMetricas(90).then((m) => setCamp(m.campanas || [])); }, []);

  return (
    <div className="space-y-5">
      <Card title="Métricas por campaña" subtitle="Últimos 90 días — medido por nosotros vía UTM">
        <p className="mb-3 text-xs text-cacao/55">
          Etiquetá los links de tus posteos/anuncios con <code className="mx-1 rounded bg-masa/60 px-1">?utm_campaign=nombre</code>
          (ej. <code className="mx-1 rounded bg-masa/60 px-1">?utm_campaign=promo-2x1</code>) y cada campaña aparece acá con
          su tráfico e interacciones, sin depender de Meta. El píxel se instala en <b>Herramientas</b>.
        </p>
        {!camp ? (
          <p className="text-sm text-cacao/50">Cargando…</p>
        ) : camp.length === 0 ? (
          <p className="py-6 text-center text-sm text-cacao/45">
            Todavía no llegaron visitas con <code className="rounded bg-masa/60 px-1">?utm_campaign=…</code>. En cuanto
            publiques un link etiquetado, vas a ver acá cada campaña.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cacao/10 text-left text-xs uppercase tracking-wide text-cacao/45">
                  <th className="pb-2 font-semibold">Campaña</th>
                  <th className="pb-2 text-right font-semibold">Visitas</th>
                  <th className="pb-2 text-right font-semibold">Carritos</th>
                  <th className="pb-2 text-right font-semibold">Pedidos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cacao/5">
                {camp.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2.5 pr-2 font-medium text-cacao/80">{c.label}</td>
                    <td className="py-2.5 text-right tabular-nums text-cacao/70">{c.visitas}</td>
                    <td className="py-2.5 text-right tabular-nums text-cacao/70">{c.carritos}</td>
                    <td className="py-2.5 text-right tabular-nums font-semibold text-marca">{c.pedidos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function PixelMeta() {
  const supabase = getSupabase();
  const [pixel, setPixel] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.from("business_settings").select("meta_pixel_id").eq("id", 1).single()
      .then(({ data }) => { setPixel(data?.meta_pixel_id || ""); setCargando(false); });
  }, [supabase]);

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setMsg("");
    const { error } = await supabase.from("business_settings").update({ meta_pixel_id: pixel.trim() || null }).eq("id", 1);
    setGuardando(false);
    setMsg(error ? "No se pudo guardar: " + error.message : "Guardado ✓");
  }

  return (
    <Card title="Píxel de Meta (Facebook / Instagram)" subtitle="Instalá el seguimiento de tus campañas">
      {cargando ? (
        <p className="text-sm text-cacao/50">Cargando…</p>
      ) : (
        <form onSubmit={guardar} className="space-y-3">
          <p className="text-sm text-cacao/60">
            Pegá el <b>ID de tu píxel de Meta</b> (antes “píxel de Facebook”) y se instala solo en el sitio. A partir
            de ahí, el <b>Administrador de Eventos de Meta</b> registra las visitas y acciones de la gente para medir
            tus anuncios de Facebook e Instagram y armar audiencias de retargeting.
          </p>
          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wide text-cacao/45">ID del píxel de Meta</span>
            <input value={pixel} onChange={(e) => setPixel(e.target.value)} placeholder="Ej: 1234567890123456" className="mt-1 w-full rounded-lg border border-cacao/15 bg-white px-3 py-2 text-sm text-cacao outline-none focus:border-marca" />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={guardando} className="inline-flex items-center gap-2 rounded-full bg-marca px-5 py-2.5 text-sm font-bold text-cream shadow-sm transition hover:brightness-110 disabled:opacity-60">
              {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Guardar
            </button>
            {msg && <span className={`text-sm font-medium ${msg.startsWith("Guardado") ? "text-green-600" : "text-red-600"}`}>{msg}</span>}
            <a href="https://business.facebook.com/events_manager" target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-marca hover:underline">
              Abrir Administrador de Eventos <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </form>
      )}
    </Card>
  );
}

function Herramientas() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-marca/10 p-5 ring-1 ring-marca/20">
        <h3 className="font-display font-bold text-cacao">Datos del negocio</h3>
        <p className="mt-1 text-sm text-cacao/60">
          La dirección, el link de Maps, horarios, redes, mensajes y los rangos de la analítica se editan en <b>Ajustes</b>.
          Las métricas de cada campaña se ven en <b>Campañas</b>.
        </p>
      </div>

      <PixelMeta />

      <Card title="Conversions API de Meta" subtitle="Medición server-side (complementa el píxel)">
        <p className="text-sm text-cacao/60">
          La Conversions API envía los eventos desde el <b>servidor</b> (no solo desde el navegador), lo que mejora la
          medición de tus anuncios y el retargeting. Meta deduplica los eventos del píxel y de la API para no contar doble.
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-masa/50 p-3 text-sm">
          <Circle className="h-2.5 w-2.5 fill-current text-amber-500" />
          <span className="text-cacao/70"><b>Estado:</b> inactiva — falta cargar el token de acceso en el servidor.</span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-cacao/55">
          Para activarla: en el Administrador de Eventos de Meta → tu píxel → <b>Conversions API → Generar token de
          acceso</b>. Ese token es secreto: se carga como variable de entorno en el servidor (Vercel), no en este panel.
          Avisá cuando lo tengas y se conecta.
        </p>
      </Card>
    </div>
  );
}
