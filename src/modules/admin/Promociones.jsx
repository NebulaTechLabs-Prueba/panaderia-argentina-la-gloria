"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Gift } from "lucide-react";
import { formatCentavos } from "@/lib/money/formatCentavos";
import { getProductos } from "@/lib/data";
import { getPromos, guardarPromo, eliminarPromo, promoVigente } from "@/lib/promos";

const INPUT = "w-full rounded-lg border border-cacao/15 bg-white px-3 py-2 text-sm text-cacao outline-none focus:border-marca";
const PROMO_COLS = ["id", "nombre", "descripcion", "activa", "vigencia", "condicion", "premio", "orden"];
const pick = (o, cols) => Object.fromEntries(cols.filter((k) => k in o && o[k] !== undefined).map((k) => [k, o[k]]));

const nuevaPromo = () => ({
  id: "",
  nombre: "",
  descripcion: "",
  activa: true,
  condicion: { tipo: "productos", productos: [{ producto_id: "", cantidad: 1 }], monto_centavos: 0 },
  premio: [{ producto_id: "", cantidad: 1 }],
  vigencia: { desde: "", hasta: "" },
});

// Editor de una lista de { producto_id, cantidad }.
function Filas({ filas, productos, onChange }) {
  const set = (i, campo, v) =>
    onChange(filas.map((f, idx) => (idx === i ? { ...f, [campo]: campo === "cantidad" ? Number(v) || 1 : v } : f)));
  return (
    <div className="space-y-2">
      {filas.map((f, i) => (
        <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-2">
          <select value={f.producto_id} onChange={(e) => set(i, "producto_id", e.target.value)} className={INPUT}>
            <option value="">Producto…</option>
            {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
          <input type="number" min="1" value={f.cantidad} onChange={(e) => set(i, "cantidad", e.target.value)} className={`${INPUT} w-16`} aria-label="Cantidad" />
          <button
            type="button"
            onClick={() => onChange(filas.filter((_, idx) => idx !== i))}
            disabled={filas.length === 1}
            className="grid h-9 w-9 place-items-center rounded-lg text-cacao/50 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
            aria-label="Quitar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...filas, { producto_id: "", cantidad: 1 }])} className="text-xs font-semibold text-marca hover:underline">
        + Agregar producto
      </button>
    </div>
  );
}

// Promociones condicionales (Supabase). Se aplican de verdad en el carrito.
export function Promociones() {
  const [promos, setPromos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState(null); // { esNuevo, data }

  const nombreProd = (id) => productos.find((p) => p.id === id)?.nombre ?? "—";

  async function cargar() {
    setCargando(true);
    const [ps, prods] = await Promise.all([getPromos(), getProductos()]);
    setPromos(ps);
    setProductos(prods || []);
    setCargando(false);
  }
  useEffect(() => { cargar(); }, []);

  const resumenCond = (p) => {
    const c = p.condicion || {};
    if (c.tipo === "monto") return `Consumo mínimo de ${formatCentavos(c.monto_centavos)}`;
    const list = (c.productos || []).filter((r) => r.producto_id);
    return list.length ? list.map((r) => `${r.cantidad}× ${nombreProd(r.producto_id)}`).join(" + ") : "—";
  };
  const resumenPremio = (p) =>
    (p.premio || []).filter((r) => r.producto_id).map((r) => `${r.cantidad}× ${nombreProd(r.producto_id)}`).join(" + ") || "—";

  const toggle = async (p) => {
    const { error } = await guardarPromo(pick({ ...p, activa: !p.activa }, PROMO_COLS));
    if (error) { setMsg("No se pudo guardar: " + error.message); return; }
    cargar();
  };
  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar la promo?")) return;
    const { error } = await eliminarPromo(id);
    if (error) { setMsg("No se pudo eliminar: " + error.message); return; }
    setMsg("Eliminada ✓");
    cargar();
  };
  async function guardar(e) {
    e.preventDefault();
    const d = form.data;
    const row = pick({ ...d, id: d.id || `promo-${Date.now()}` }, PROMO_COLS);
    const { error } = await guardarPromo(row);
    if (error) { setMsg("No se pudo guardar: " + error.message); return; }
    setForm(null);
    setMsg("Guardada ✓");
    cargar();
  }
  const upd = (patch) => setForm((f) => ({ ...f, data: { ...f.data, ...patch } }));
  const updCond = (patch) => setForm((f) => ({ ...f, data: { ...f.data, condicion: { ...f.data.condicion, ...patch } } }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className={`rounded-lg px-3 py-2 text-xs font-medium ring-1 ${cargando ? "bg-masa/40 text-cacao/60 ring-cacao/10" : msg ? "bg-green-50 text-green-700 ring-green-200" : "bg-masa/40 text-cacao/70 ring-cacao/10"}`}>
          {cargando ? "Cargando del servidor…" : msg || "Se aplican de verdad en el carrito del sitio."}
        </p>
        <button
          type="button"
          onClick={() => setForm({ esNuevo: true, data: nuevaPromo() })}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-corteza px-4 py-2 text-sm font-bold text-cacao shadow-sm transition hover:brightness-105"
        >
          <Plus className="h-4 w-4" strokeWidth={2.6} /> Nueva promo
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {promos.map((p) => (
          <div key={p.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-cacao/5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-corteza" />
                <h3 className="font-display font-bold text-cacao">{p.nombre}</h3>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-cacao/60">
                <input type="checkbox" checked={p.activa} onChange={() => toggle(p)} />
                {p.activa ? "Activa" : "Pausada"}
              </label>
            </div>
            {p.descripcion && <p className="mt-1 text-sm text-cacao/60">{p.descripcion}</p>}
            <div className="mt-3 rounded-lg bg-masa/40 px-3 py-2 text-sm text-cacao/80">
              <span className="text-cacao/60">Si comprás:</span> {resumenCond(p)}
              <br />
              <span className="text-cacao/60">Se lleva gratis:</span>{" "}
              <b className="text-green-700">{resumenPremio(p)}</b>
            </div>
            {(p.vigencia?.desde || p.vigencia?.hasta) && (
              <p className="mt-2 flex items-center gap-2 text-xs text-cacao/55">
                📅 {p.vigencia.desde || "…"} → {p.vigencia.hasta || "…"}
                {p.activa && !promoVigente(p) && (
                  <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">fuera de fecha</span>
                )}
              </p>
            )}
            <div className="mt-3 flex justify-end gap-1">
              <button type="button" onClick={() => setForm({ esNuevo: false, data: JSON.parse(JSON.stringify(p)) })} className="grid h-8 w-8 place-items-center rounded-lg text-cacao/60 hover:bg-masa/70 hover:text-marca" aria-label="Editar">
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => eliminar(p.id)} className="grid h-8 w-8 place-items-center rounded-lg text-cacao/60 hover:bg-red-50 hover:text-red-600" aria-label="Eliminar">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {!cargando && promos.length === 0 && <p className="text-sm text-cacao/50">No hay promos. Creá una con “Nueva promo”.</p>}
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setForm(null)} />
          <form onSubmit={guardar} className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-cacao">{form.esNuevo ? "Nueva" : "Editar"} promo</h3>
              <button type="button" onClick={() => setForm(null)} className="grid h-8 w-8 place-items-center rounded-full text-cacao/50 hover:bg-masa/70" aria-label="Cerrar">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <Campo label="Nombre">
                <input required value={form.data.nombre} onChange={(e) => upd({ nombre: e.target.value })} className={INPUT} />
              </Campo>
              <Campo label="Descripción (se muestra en el menú)">
                <input value={form.data.descripcion} onChange={(e) => upd({ descripcion: e.target.value })} placeholder="Ej: Comprando pan, café y asado, ¡cremona y choripán de regalo!" className={INPUT} />
              </Campo>

              {/* Condición */}
              <div className="rounded-xl bg-masa/30 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-cacao/50">Condición</p>
                  <div className="flex gap-1 rounded-full bg-white p-0.5 ring-1 ring-cacao/10">
                    {[["productos", "Por productos"], ["monto", "Consumo mínimo"]].map(([v, l]) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => updCond({ tipo: v })}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${form.data.condicion.tipo === v ? "bg-marca text-cream" : "text-cacao/60"}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                {form.data.condicion.tipo === "monto" ? (
                  <label className="block">
                    <span className="mb-1 block text-xs text-cacao/50">Monto mínimo (USD)</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={(form.data.condicion.monto_centavos || 0) / 100}
                      onChange={(e) => updCond({ monto_centavos: Math.round((Number(e.target.value) || 0) * 100) })}
                      className={INPUT}
                    />
                  </label>
                ) : (
                  <Filas filas={form.data.condicion.productos} productos={productos} onChange={(productos) => updCond({ productos })} />
                )}
              </div>

              {/* Premio */}
              <div className="rounded-xl bg-green-50 p-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-green-700">Premio (lo que se lleva gratis)</p>
                <Filas filas={form.data.premio} productos={productos} onChange={(premio) => upd({ premio })} />
              </div>

              {/* Vigencia */}
              <div className="rounded-xl bg-masa/30 p-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-cacao/50">Vigencia (opcional)</p>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="mb-1 block text-xs text-cacao/50">Desde</span>
                    <input type="date" value={form.data.vigencia?.desde || ""} onChange={(e) => upd({ vigencia: { ...form.data.vigencia, desde: e.target.value } })} className={INPUT} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-cacao/50">Hasta</span>
                    <input type="date" value={form.data.vigencia?.hasta || ""} onChange={(e) => upd({ vigencia: { ...form.data.vigencia, hasta: e.target.value } })} className={INPUT} />
                  </label>
                </div>
                <p className="mt-1 text-[11px] text-cacao/45">
                  Vacío = sin límite. Promo de 1 día (ej. lanzamiento): poné la misma fecha en Desde y Hasta.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setForm(null)} className="rounded-full px-4 py-2 text-sm font-semibold text-cacao/60 hover:bg-masa/70">Cancelar</button>
              <button type="submit" className="rounded-full bg-marca px-5 py-2 text-sm font-bold text-cream shadow-sm hover:brightness-110">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-cacao/45">{label}</span>
      {children}
    </label>
  );
}
