"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { productosMock } from "@/lib/data/mock/productos";
import { categoriasMock } from "@/lib/data/mock/categorias";
import { formatCentavos } from "@/lib/money/formatCentavos";

const nuevoProducto = () => ({ id: "", nombre: "", categoria_id: "", precio_centavos: 0, descripcion: "", disponible: true });
const nuevaCategoria = () => ({ id: "", nombre: "", slug: "", orden: 99, activa: true });

// CRUD de catálogo (SIMULADO): opera sobre estado local. Los cambios no persisten
// —se resetean al recargar— hasta que exista el backend (Supabase).
export function Catalogo() {
  const [tab, setTab] = useState("productos");
  const [productos, setProductos] = useState(() => productosMock.map((p) => ({ ...p })));
  const [categorias, setCategorias] = useState(() => categoriasMock.map((c) => ({ ...c })));
  const [form, setForm] = useState(null); // { tipo, esNuevo, data }

  const nombreCat = (id) => categorias.find((c) => c.id === id)?.nombre ?? "—";
  const setCampo = (k, v) => setForm((f) => ({ ...f, data: { ...f.data, [k]: v } }));

  function abrirNuevo() {
    setForm(
      tab === "productos"
        ? { tipo: "producto", esNuevo: true, data: nuevoProducto() }
        : { tipo: "categoria", esNuevo: true, data: nuevaCategoria() }
    );
  }
  function eliminar(tipo, id) {
    if (!window.confirm("¿Eliminar? (demo — no se guarda)")) return;
    if (tipo === "producto") setProductos((ps) => ps.filter((p) => p.id !== id));
    else setCategorias((cs) => cs.filter((c) => c.id !== id));
  }
  function guardar(e) {
    e.preventDefault();
    const { tipo, esNuevo, data } = form;
    if (tipo === "producto") {
      const item = { ...data, id: data.id || `p-${Date.now()}` };
      setProductos((ps) => (esNuevo ? [item, ...ps] : ps.map((p) => (p.id === item.id ? item : p))));
    } else {
      const item = {
        ...data,
        id: data.id || `cat-${Date.now()}`,
        slug: data.slug || data.nombre.toLowerCase().replace(/\s+/g, "-"),
      };
      setCategorias((cs) => (esNuevo ? [...cs, item] : cs.map((c) => (c.id === item.id ? item : c))));
    }
    setForm(null);
  }

  const TabBtn = ({ id, children }) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
        tab === id ? "bg-marca text-cream" : "text-cacao/60 hover:bg-masa/70"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-cacao/5">
          <TabBtn id="productos">Productos ({productos.length})</TabBtn>
          <TabBtn id="categorias">Categorías ({categorias.length})</TabBtn>
        </div>
        <button
          type="button"
          onClick={abrirNuevo}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-corteza px-4 py-2 text-sm font-bold text-cacao shadow-sm transition hover:brightness-105"
        >
          <Plus className="h-4 w-4" strokeWidth={2.6} />
          {tab === "productos" ? "Nuevo producto" : "Nueva categoría"}
        </button>
      </div>

      <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
        Demo: los cambios funcionan pero <b>no se guardan</b> (sin backend). Con Supabase esto persistirá.
      </p>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-cacao/5">
        {tab === "productos" ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cacao/10 text-left text-xs uppercase tracking-wide text-cacao/45">
                <th className="p-3 font-semibold">Producto</th>
                <th className="p-3 font-semibold">Categoría</th>
                <th className="p-3 text-right font-semibold">Precio</th>
                <th className="p-3 text-center font-semibold">Estado</th>
                <th className="p-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cacao/5">
              {productos.map((p) => (
                <tr key={p.id} className="hover:bg-masa/20">
                  <td className="p-3 font-medium text-cacao/85">{p.nombre}</td>
                  <td className="p-3 text-cacao/60">{nombreCat(p.categoria_id)}</td>
                  <td className="p-3 text-right tabular-nums text-cacao/80">{formatCentavos(p.precio_centavos)}</td>
                  <td className="p-3 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.disponible ? "bg-green-100 text-green-700" : "bg-cacao/10 text-cacao/50"}`}>
                      {p.disponible ? "Activo" : "Pausado"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={() => setForm({ tipo: "producto", esNuevo: false, data: { ...p } })} className="grid h-8 w-8 place-items-center rounded-lg text-cacao/60 hover:bg-masa/70 hover:text-marca" aria-label="Editar">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => eliminar("producto", p.id)} className="grid h-8 w-8 place-items-center rounded-lg text-cacao/60 hover:bg-red-50 hover:text-red-600" aria-label="Eliminar">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cacao/10 text-left text-xs uppercase tracking-wide text-cacao/45">
                <th className="p-3 font-semibold">Categoría</th>
                <th className="p-3 font-semibold">Slug</th>
                <th className="p-3 text-center font-semibold">Orden</th>
                <th className="p-3 text-center font-semibold">Estado</th>
                <th className="p-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cacao/5">
              {categorias.map((c) => (
                <tr key={c.id} className="hover:bg-masa/20">
                  <td className="p-3 font-medium text-cacao/85">{c.nombre}</td>
                  <td className="p-3 font-mono text-xs text-cacao/50">{c.slug}</td>
                  <td className="p-3 text-center tabular-nums text-cacao/70">{c.orden}</td>
                  <td className="p-3 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${c.activa ? "bg-green-100 text-green-700" : "bg-cacao/10 text-cacao/50"}`}>
                      {c.activa ? "Activa" : "Oculta"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={() => setForm({ tipo: "categoria", esNuevo: false, data: { ...c } })} className="grid h-8 w-8 place-items-center rounded-lg text-cacao/60 hover:bg-masa/70 hover:text-marca" aria-label="Editar">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => eliminar("categoria", c.id)} className="grid h-8 w-8 place-items-center rounded-lg text-cacao/60 hover:bg-red-50 hover:text-red-600" aria-label="Eliminar">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setForm(null)} />
          <form onSubmit={guardar} className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-cacao">
                {form.esNuevo ? "Nuevo" : "Editar"} {form.tipo === "producto" ? "producto" : "categoría"}
              </h3>
              <button type="button" onClick={() => setForm(null)} className="grid h-8 w-8 place-items-center rounded-full text-cacao/50 hover:bg-masa/70" aria-label="Cerrar">
                <X className="h-5 w-5" />
              </button>
            </div>

            {form.tipo === "producto" ? (
              <div className="space-y-3">
                <Campo label="Nombre">
                  <input required value={form.data.nombre} onChange={(e) => setCampo("nombre", e.target.value)} className={INPUT} />
                </Campo>
                <div className="grid grid-cols-2 gap-3">
                  <Campo label="Categoría">
                    <select required value={form.data.categoria_id} onChange={(e) => setCampo("categoria_id", e.target.value)} className={INPUT}>
                      <option value="">Elegir…</option>
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </Campo>
                  <Campo label="Precio (USD)">
                    <input type="number" step="0.5" min="0" value={form.data.precio_centavos / 100} onChange={(e) => setCampo("precio_centavos", Math.round((Number(e.target.value) || 0) * 100))} className={INPUT} />
                  </Campo>
                </div>
                <Campo label="Descripción">
                  <textarea rows={2} value={form.data.descripcion} onChange={(e) => setCampo("descripcion", e.target.value)} className={INPUT} />
                </Campo>
                <label className="flex items-center gap-2 text-sm text-cacao/75">
                  <input type="checkbox" checked={form.data.disponible} onChange={(e) => setCampo("disponible", e.target.checked)} />
                  Disponible
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <Campo label="Nombre">
                  <input required value={form.data.nombre} onChange={(e) => setCampo("nombre", e.target.value)} className={INPUT} />
                </Campo>
                <div className="grid grid-cols-2 gap-3">
                  <Campo label="Slug (opcional)">
                    <input value={form.data.slug} onChange={(e) => setCampo("slug", e.target.value)} placeholder="se genera solo" className={INPUT} />
                  </Campo>
                  <Campo label="Orden">
                    <input type="number" min="0" value={form.data.orden} onChange={(e) => setCampo("orden", Number(e.target.value) || 0)} className={INPUT} />
                  </Campo>
                </div>
                <label className="flex items-center gap-2 text-sm text-cacao/75">
                  <input type="checkbox" checked={form.data.activa} onChange={(e) => setCampo("activa", e.target.checked)} />
                  Activa (visible en el catálogo)
                </label>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setForm(null)} className="rounded-full px-4 py-2 text-sm font-semibold text-cacao/60 hover:bg-masa/70">
                Cancelar
              </button>
              <button type="submit" className="rounded-full bg-marca px-5 py-2 text-sm font-bold text-cream shadow-sm hover:brightness-110">
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const INPUT = "w-full rounded-lg border border-cacao/15 bg-white px-3 py-2 text-sm text-cacao outline-none focus:border-marca";

function Campo({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-cacao/45">{label}</span>
      {children}
    </label>
  );
}
