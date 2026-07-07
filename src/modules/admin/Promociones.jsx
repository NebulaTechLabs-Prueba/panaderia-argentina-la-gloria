"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Gift } from "lucide-react";
import { productosMock } from "@/lib/data/mock/productos";
import { getPromos, guardarPromos } from "@/lib/promos";

const INPUT = "w-full rounded-lg border border-cacao/15 bg-white px-3 py-2 text-sm text-cacao outline-none focus:border-marca";

const nuevaPromo = () => ({
  id: "",
  nombre: "",
  descripcion: "",
  tipo: "regalo",
  condicion: { producto_id: "", cantidad: 2 },
  premio: { producto_id: "", cantidad: 1 },
  activa: true,
});

// Promociones condicionales (tipo "regalo"): comprá N× un producto y otro va gratis.
// Se aplican de verdad en el carrito del sitio público (localStorage + evento).
export function Promociones() {
  const [promos, setPromos] = useState(() => getPromos());
  const [form, setForm] = useState(null); // { esNuevo, data }
  const nombreProd = (id) => productosMock.find((p) => p.id === id)?.nombre ?? "—";

  const persistir = (lista) => {
    setPromos(lista);
    guardarPromos(lista);
  };

  const toggle = (id) => persistir(promos.map((p) => (p.id === id ? { ...p, activa: !p.activa } : p)));
  const eliminar = (id) => {
    if (!window.confirm("¿Eliminar la promo?")) return;
    persistir(promos.filter((p) => p.id !== id));
  };
  function guardar(e) {
    e.preventDefault();
    const d = form.data;
    const item = { ...d, id: d.id || `promo-${Date.now()}` };
    persistir(form.esNuevo ? [...promos, item] : promos.map((p) => (p.id === item.id ? item : p)));
    setForm(null);
  }
  const setC = (path, v) =>
    setForm((f) => {
      const data = { ...f.data };
      if (path === "nombre" || path === "descripcion") data[path] = v;
      else if (path === "cond.prod") data.condicion = { ...data.condicion, producto_id: v };
      else if (path === "cond.cant") data.condicion = { ...data.condicion, cantidad: Number(v) || 1 };
      else if (path === "prem.prod") data.premio = { ...data.premio, producto_id: v };
      else if (path === "prem.cant") data.premio = { ...data.premio, cantidad: Number(v) || 1 };
      return { ...f, data };
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
          Estas promos <b>se aplican de verdad</b> en el carrito del sitio (demo, guardado en el navegador).
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
                <input type="checkbox" checked={p.activa} onChange={() => toggle(p.id)} />
                {p.activa ? "Activa" : "Pausada"}
              </label>
            </div>
            <p className="mt-1 text-sm text-cacao/60">{p.descripcion}</p>
            <div className="mt-3 rounded-lg bg-masa/40 px-3 py-2 text-sm text-cacao/80">
              Comprá <b>{p.condicion.cantidad}×</b> {nombreProd(p.condicion.producto_id)} →{" "}
              <b className="text-green-700">{p.premio.cantidad}× {nombreProd(p.premio.producto_id)} gratis</b>
            </div>
            <div className="mt-3 flex justify-end gap-1">
              <button type="button" onClick={() => setForm({ esNuevo: false, data: { ...p, condicion: { ...p.condicion }, premio: { ...p.premio } } })} className="grid h-8 w-8 place-items-center rounded-lg text-cacao/60 hover:bg-masa/70 hover:text-marca" aria-label="Editar">
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => eliminar(p.id)} className="grid h-8 w-8 place-items-center rounded-lg text-cacao/60 hover:bg-red-50 hover:text-red-600" aria-label="Eliminar">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {promos.length === 0 && (
          <p className="text-sm text-cacao/50">No hay promos. Creá una con “Nueva promo”.</p>
        )}
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setForm(null)} />
          <form onSubmit={guardar} className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-cacao">{form.esNuevo ? "Nueva" : "Editar"} promo</h3>
              <button type="button" onClick={() => setForm(null)} className="grid h-8 w-8 place-items-center rounded-full text-cacao/50 hover:bg-masa/70" aria-label="Cerrar">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <Campo label="Nombre">
                <input required value={form.data.nombre} onChange={(e) => setC("nombre", e.target.value)} className={INPUT} />
              </Campo>
              <Campo label="Descripción (se muestra en el menú)">
                <input value={form.data.descripcion} onChange={(e) => setC("descripcion", e.target.value)} placeholder="Ej: Llevá 2 facturas y el café va de regalo ☕" className={INPUT} />
              </Campo>

              <div className="rounded-xl bg-masa/30 p-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-cacao/50">Condición (lo que compra)</p>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <select required value={form.data.condicion.producto_id} onChange={(e) => setC("cond.prod", e.target.value)} className={INPUT}>
                    <option value="">Producto…</option>
                    {productosMock.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                  <input type="number" min="1" value={form.data.condicion.cantidad} onChange={(e) => setC("cond.cant", e.target.value)} className={`${INPUT} w-20`} aria-label="Cantidad condición" />
                </div>
              </div>

              <div className="rounded-xl bg-green-50 p-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-green-700">Premio (lo que se lleva gratis)</p>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <select required value={form.data.premio.producto_id} onChange={(e) => setC("prem.prod", e.target.value)} className={INPUT}>
                    <option value="">Producto…</option>
                    {productosMock.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                  <input type="number" min="1" value={form.data.premio.cantidad} onChange={(e) => setC("prem.cant", e.target.value)} className={`${INPUT} w-20`} aria-label="Cantidad premio" />
                </div>
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
