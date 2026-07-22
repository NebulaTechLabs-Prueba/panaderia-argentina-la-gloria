"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Filter, Package, Wrench,
  MessageCircle, ExternalLink, Circle, Menu, ShoppingCart, CalendarDays, LogOut,
  Download, Printer, Ticket, Settings, Megaphone, Save, Loader2, ArrowLeftRight,
  Pencil, Trash2, Plus,
} from "lucide-react";
import { asset, adminBase } from "@/lib/config/constants";
import { getSupabase } from "@/lib/supabase/client";
import { getMetricas, getMetricasRango } from "@/lib/data";
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
            {["resumen", "conversiones", "consumidor"].includes(sec) && (
              <RangoSelector rango={rango} setRango={setRango} />
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

// Selector de rango con presets + valor personalizado (cualquier N de días).
const RANGO_PRESETS = ["7 días", "30 días", "90 días"];
function RangoSelector({ rango, setRango }) {
  const esPreset = RANGO_PRESETS.includes(rango);
  const [custom, setCustom] = useState(esPreset ? "" : String(parseInt(rango, 10) || ""));
  const aplicar = () => {
    const n = parseInt(custom, 10);
    if (n >= 1 && n <= 365) setRango(`${n} días`);
  };
  return (
    <div className="hidden items-center gap-1 rounded-full bg-masa/70 p-1 sm:flex">
      {RANGO_PRESETS.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => { setRango(r); setCustom(""); }}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${rango === r ? "bg-white text-cacao shadow-sm" : "text-cacao/60 hover:text-cacao"}`}
        >
          {r}
        </button>
      ))}
      <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${!esPreset ? "bg-white shadow-sm" : ""}`}>
        <input
          type="number"
          min="1"
          max="365"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); aplicar(); } }}
          placeholder="N.º"
          className="w-12 bg-transparent text-center text-xs font-semibold text-cacao outline-none"
          aria-label="Cantidad de días personalizada"
        />
        <span className="text-xs text-cacao/50">días</span>
        <button type="button" onClick={aplicar} className="rounded-full bg-marca px-2 py-0.5 text-[11px] font-bold text-cream transition hover:brightness-110">OK</button>
      </div>
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

function RangoCampo({ titulo, val, set, color }) {
  return (
    <div className="rounded-xl bg-masa/40 p-3">
      <p className="mb-2 flex items-center gap-2 text-sm font-bold text-cacao">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} /> {titulo}
      </p>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <input type="date" value={val.desde} max={val.hasta} onChange={(e) => set({ ...val, desde: e.target.value })} className="rounded-lg border border-cacao/15 bg-white px-2 py-1.5 text-cacao outline-none focus:border-marca" />
        <span className="text-cacao/40">a</span>
        <input type="date" value={val.hasta} min={val.desde} onChange={(e) => set({ ...val, hasta: e.target.value })} className="rounded-lg border border-cacao/15 bg-white px-2 py-1.5 text-cacao outline-none focus:border-marca" />
      </div>
    </div>
  );
}

function Comparativa() {
  const [a, setA] = useState({ desde: isoDia(59), hasta: isoDia(30) });
  const [b, setB] = useState({ desde: isoDia(29), hasta: isoDia(0) });
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);

  const comparar = async () => {
    setCargando(true);
    const [ra, rb] = await Promise.all([
      getMetricasRango(desdeISO(a.desde), hastaISO(a.hasta)),
      getMetricasRango(desdeISO(b.desde), hastaISO(b.hasta)),
    ]);
    setDatos({ a: ra, b: rb });
    setCargando(false);
  };
  useEffect(() => { comparar(); /* carga inicial */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmt = (v, pct) => (pct ? `${(v || 0).toFixed(1)}%` : (v || 0).toLocaleString("es"));
  const delta = (va, vb) => (va ? ((vb - va) / va) * 100 : vb ? 100 : 0);

  return (
    <div className="space-y-5">
      <Card title="Comparar períodos" subtitle="Elegí dos rangos de fechas y mirá la diferencia">
        <div className="grid gap-3 sm:grid-cols-2">
          <RangoCampo titulo="Período A" val={a} set={setA} color="#94a3b8" />
          <RangoCampo titulo="Período B" val={b} set={setB} color="#2f3a7e" />
        </div>
        <button
          type="button"
          onClick={comparar}
          disabled={cargando}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-marca px-5 py-2.5 text-sm font-bold text-cream shadow-sm transition hover:brightness-110 disabled:opacity-60"
        >
          {cargando ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowLeftRight className="h-4 w-4" />}
          Comparar
        </button>
      </Card>

      <Card title="Resultado" subtitle="Período A → Período B">
        {!datos ? (
          <p className="text-sm text-cacao/50">Cargando…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cacao/10 text-left text-xs uppercase tracking-wide text-cacao/45">
                  <th className="pb-2 font-semibold">Métrica</th>
                  <th className="pb-2 text-right font-semibold">Período A</th>
                  <th className="pb-2 text-right font-semibold">Período B</th>
                  <th className="pb-2 text-right font-semibold">Variación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cacao/5">
                {COMP_METRICAS.map((m) => {
                  const va = datos.a[m.key], vb = datos.b[m.key];
                  const d = delta(va, vb);
                  const up = d >= 0;
                  return (
                    <tr key={m.key}>
                      <td className="py-2.5 pr-2 font-medium text-cacao/80">{m.label}</td>
                      <td className="py-2.5 text-right tabular-nums text-cacao/70">{fmt(va, m.pct)}</td>
                      <td className="py-2.5 text-right tabular-nums font-semibold text-cacao">{fmt(vb, m.pct)}</td>
                      <td className={`py-2.5 text-right tabular-nums font-semibold ${d === 0 ? "text-cacao/40" : up ? "text-green-600" : "text-red-600"}`}>
                        {up ? "▲" : "▼"} {Math.abs(d).toFixed(0)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function Campanas() {
  const supabase = getSupabase();
  const [pixel, setPixel] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.from("business_settings").select("meta_pixel_id").eq("id", 1).single()
      .then(({ data }) => { setPixel(data?.meta_pixel_id || ""); setCargando(false); });
  }, [supabase]);

  const [camp, setCamp] = useState(null);
  useEffect(() => { getMetricas(90).then((m) => setCamp(m.campanas || [])); }, []);

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setMsg("");
    const { error } = await supabase.from("business_settings").update({ meta_pixel_id: pixel.trim() || null }).eq("id", 1);
    setGuardando(false);
    setMsg(error ? "No se pudo guardar: " + error.message : "Guardado ✓");
  }

  return (
    <div className="space-y-5">
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

      <Card title="Métricas por campaña" subtitle="Últimos 90 días — medido por nosotros vía UTM">
        <p className="mb-3 text-xs text-cacao/55">
          Etiquetá los links de tus posteos/anuncios con <code className="mx-1 rounded bg-masa/60 px-1">?utm_campaign=nombre</code>
          (ej. <code className="mx-1 rounded bg-masa/60 px-1">?utm_campaign=promo-2x1</code>) y cada campaña aparece acá con
          su tráfico e interacciones, sin depender de Meta.
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
