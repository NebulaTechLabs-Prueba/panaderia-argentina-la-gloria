"use client";

import { useState } from "react";
import {
  LayoutDashboard, TrendingUp, Filter, Search, Package, Users, Wrench,
  MessageCircle, MapPin, Smartphone, ExternalLink, Circle, Menu, X,
} from "lucide-react";
import { asset } from "@/lib/config/constants";
import { formatCentavos } from "@/lib/money/formatCentavos";
import { productosMock } from "@/lib/data/mock/productos";
import { categoriasMock } from "@/lib/data/mock/categorias";
import { IDS_CON_FOTO } from "@/lib/data/imagenesLocales";
import {
  Card, Kpi, Delta, LineChart, BarList, Donut, Funnel, EstadoPill, Sparkline,
} from "./widgets";
import * as M from "./mock";

const NAV = [
  { id: "resumen", label: "Resumen", icon: LayoutDashboard },
  { id: "trafico", label: "Tráfico", icon: TrendingUp },
  { id: "conversiones", label: "Conversiones", icon: Filter },
  { id: "seo", label: "SEO", icon: Search },
  { id: "productos", label: "Productos", icon: Package },
  { id: "equipo", label: "Equipo", icon: Users },
  { id: "herramientas", label: "Herramientas", icon: Wrench },
];

export function AdminPanel() {
  const [sec, setSec] = useState("resumen");
  const [rango, setRango] = useState("30 días");
  const [menu, setMenu] = useState(false);
  const actual = NAV.find((n) => n.id === sec);

  return (
    <div className="min-h-screen bg-masa/40 text-cacao">
      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-marca text-cream transition-transform lg:translate-x-0 ${
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

        <div className="p-4">
          <div className="rounded-xl bg-white/10 p-3 text-xs text-cream/70">
            <span className="font-bold text-corteza">● Modo demo</span>
            <p className="mt-1">Datos simulados. Sin backend conectado todavía.</p>
          </div>
        </div>
      </aside>

      {menu && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMenu(false)} />}

      {/* ── Contenido ── */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-cacao/10 bg-white/80 px-5 py-3 backdrop-blur">
          <button type="button" className="lg:hidden" onClick={() => setMenu(true)} aria-label="Menú">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            {actual && <actual.icon className="h-5 w-5 text-marca" />}
            <h1 className="font-display text-lg font-bold">{actual?.label}</h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
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
            <div className="grid h-9 w-9 place-items-center rounded-full bg-marca text-sm font-bold text-cream">
              M
            </div>
          </div>
        </header>

        <main className="p-5">
          {sec === "resumen" && <Resumen />}
          {sec === "trafico" && <Trafico />}
          {sec === "conversiones" && <Conversiones />}
          {sec === "seo" && <Seo />}
          {sec === "productos" && <Productos />}
          {sec === "equipo" && <Equipo />}
          {sec === "herramientas" && <Herramientas />}
        </main>
      </div>
    </div>
  );
}

function Resumen() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {M.kpis.map((k) => (
          <Kpi key={k.id} {...k} />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Visitas" subtitle="Últimos 30 días" className="lg:col-span-2">
          <LineChart data={M.serieVisitas} />
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
      <Card title="Visitas por día" subtitle="Últimos 30 días">
        <LineChart data={M.serieVisitas} color="#2f3a7e" />
      </Card>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Fuentes"><BarList items={M.fuentes} unit="%" /></Card>
        <Card title="Dispositivos"><Donut segments={M.dispositivos} /></Card>
        <Card title="Ciudades" subtitle="Dónde están los visitantes">
          <BarList items={M.ciudades} color="#63b0dd" />
        </Card>
      </div>
    </div>
  );
}

function Conversiones() {
  return (
    <div className="space-y-5">
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

function Productos() {
  const nombreCat = (id) => categoriasMock.find((c) => c.id === id)?.nombre ?? "—";
  return (
    <Card
      title="Catálogo"
      subtitle="Editá precios, fotos y disponibilidad (simulado)"
      action={
        <span className="rounded-full bg-masa/70 px-3 py-1 text-xs font-semibold text-cacao/60">
          {productosMock.length} productos
        </span>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cacao/10 text-left text-xs uppercase tracking-wide text-cacao/45">
              <th className="pb-2 font-semibold">Producto</th>
              <th className="pb-2 font-semibold">Categoría</th>
              <th className="pb-2 text-right font-semibold">Precio</th>
              <th className="pb-2 text-center font-semibold">Foto</th>
              <th className="pb-2 text-center font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cacao/5">
            {productosMock.map((p) => (
              <tr key={p.id} className="hover:bg-masa/30">
                <td className="py-2.5 pr-2 font-medium text-cacao/85">{p.nombre}</td>
                <td className="py-2.5 pr-2 text-cacao/60">{nombreCat(p.categoria_id)}</td>
                <td className="py-2.5 text-right tabular-nums text-cacao/80">
                  {formatCentavos(p.precio_centavos)}
                </td>
                <td className="py-2.5 text-center">
                  {IDS_CON_FOTO.has(p.id) ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-amber-500">Falta</span>
                  )}
                </td>
                <td className="py-2.5 text-center">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      p.disponible ? "bg-green-100 text-green-700" : "bg-cacao/10 text-cacao/50"
                    }`}
                  >
                    {p.disponible ? "Activo" : "Pausado"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Equipo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {M.equipo.map((m) => (
        <div key={m.nombre} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-cacao/5">
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full font-display text-lg font-bold text-white"
            style={{ backgroundColor: m.color }}
          >
            {m.inicial}
          </div>
          <div>
            <p className="font-semibold text-cacao">{m.nombre}</p>
            <p className="text-sm text-cacao/55">{m.rol}</p>
          </div>
        </div>
      ))}
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
