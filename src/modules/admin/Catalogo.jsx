"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Upload, Loader2, Search } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { formatCentavos } from "@/lib/money/formatCentavos";
import { unidadSufijo, UNIDADES } from "@/lib/unidades";
import { estiloBadge } from "@/lib/badges";
import { IconoCategoria, ICONOS_CATEGORIA } from "@/modules/catalogo/IconoCategoria";

const BADGES = ["Nuevo", "Promo", "2x1", "Destacado", "Más pedido", "Recomendado"];
const COLORES = [["naranja", "Naranja"], ["celeste", "Celeste"], ["carbon", "Carbón"]];

const nuevoProducto = () => ({
  id: "", nombre: "", categoria_id: "", precio_centavos: 0, unidad: "uni",
  estimado: false, consultar: false, nota: "", variantes: null, descripcion: "",
  disponible: true, destacado: false, imagen_url: "", etiqueta: "", min_cantidad: 1, _modo: "simple",
});
const nuevaCategoria = () => ({
  id: "", nombre: "", slug: "", orden: 99, activa: true,
  slogan: "", texto: "", color: "naranja", icono: "factura",
});

// Columnas reales de cada tabla (para no mandar campos extra —ni _modo— al upsert).
const PROD_COLS = ["id", "categoria_id", "nombre", "descripcion", "precio_centavos", "unidad", "estimado", "consultar", "nota", "variantes", "imagen_url", "disponible", "destacado", "orden", "etiqueta", "min_cantidad"];
const CAT_COLS = ["id", "nombre", "slug", "orden", "activa", "slogan", "texto", "color", "icono", "ref_keyword"];
const pick = (o, cols) => Object.fromEntries(cols.filter((k) => k in o && o[k] !== undefined).map((k) => [k, o[k]]));
const slugify = (s) =>
  (s || "").toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || String(Date.now());
const norm = (s) => (s || "").toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const dolar = (cent) => (Number(cent) || 0) / 100;
const aCent = (usd) => Math.round((Number(usd) || 0) * 100);
const precioDesde = (p) => (p.variantes?.length ? Math.min(...p.variantes.map((v) => v.precio_centavos)) : p.precio_centavos);

// CRUD de catálogo contra Supabase (persiste). RLS restringe la escritura al super-admin.
export function Catalogo() {
  const supabase = getSupabase();
  const [tab, setTab] = useState("productos");
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [msg, setMsg] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [form, setForm] = useState(null); // { tipo, esNuevo, data }

  // Sube un archivo a Supabase Storage (bucket "productos") y devuelve su URL pública.
  async function subirImagen(file) {
    setMsg("");
    if (!file || file.size === 0) {
      setMsg("El archivo está vacío o no se pudo leer. Elegilo de nuevo.");
      return;
    }
    setSubiendo(true);
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const base = (form?.data?.id || "img").replace(/[^a-z0-9-]/gi, "") || "img";
    const path = `${base}-${Date.now()}.${ext}`;
    // Sin upsert: el path ya es único (timestamp). upsert:true exigiría también
    // políticas SELECT+UPDATE en storage.objects y rompía con RLS.
    const { error } = await supabase.storage.from("productos").upload(path, file, { contentType: file.type });
    if (error) {
      setMsg("No se pudo subir la imagen: " + error.message);
      setSubiendo(false);
      return;
    }
    const { data } = supabase.storage.from("productos").getPublicUrl(path);
    setCampo("imagen_url", data.publicUrl);
    setSubiendo(false);
  }

  async function cargar() {
    setCargando(true);
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from("products").select("*").order("orden"),
      supabase.from("categories").select("*").order("orden"),
    ]);
    setProductos(prods || []);
    setCategorias(cats || []);
    setCargando(false);
  }
  useEffect(() => { cargar(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const nombreCat = (id) => categorias.find((c) => c.id === id)?.nombre ?? "—";
  const setCampo = (k, v) => setForm((f) => ({ ...f, data: { ...f.data, [k]: v } }));

  const q = norm(busqueda);
  const prodsFiltrados = q ? productos.filter((p) => norm(p.nombre).includes(q) || norm(nombreCat(p.categoria_id)).includes(q)) : productos;
  const catsFiltradas = q ? categorias.filter((c) => norm(c.nombre).includes(q) || norm(c.slogan).includes(q)) : categorias;

  function editarProducto(p) {
    const modo = p.consultar ? "consultar" : p.variantes?.length ? "formatos" : "simple";
    setForm({ tipo: "producto", esNuevo: false, data: { ...p, nota: p.nota || "", variantes: p.variantes || null, _modo: modo } });
  }
  function abrirNuevo() {
    setForm(
      tab === "productos"
        ? { tipo: "producto", esNuevo: true, data: nuevoProducto() }
        : { tipo: "categoria", esNuevo: true, data: nuevaCategoria() }
    );
  }
  async function eliminar(tipo, id) {
    if (!window.confirm("¿Eliminar definitivamente?")) return;
    const tabla = tipo === "producto" ? "products" : "categories";
    const { error } = await supabase.from(tabla).delete().eq("id", id);
    if (error) { setMsg("No se pudo eliminar: " + error.message); return; }
    if (tipo === "producto") setProductos((ps) => ps.filter((p) => p.id !== id));
    else setCategorias((cs) => cs.filter((c) => c.id !== id));
    setMsg("Eliminado ✓");
  }
  async function guardar(e) {
    e.preventDefault();
    const { tipo, data } = form;
    if (tipo === "producto" && (data.imagen_url || "").startsWith("blob:")) {
      setMsg("La imagen no terminó de subir. Esperá a que diga “subida” o volvé a cargar el archivo.");
      return;
    }
    if (tipo === "producto") {
      const d = { ...data };
      if (d._modo === "formatos") {
        const vs = (d.variantes || []).filter((v) => v.etiqueta?.trim());
        d.variantes = vs.length ? vs : null;
        d.precio_centavos = vs.length ? Math.min(...vs.map((v) => v.precio_centavos)) : 0;
        d.unidad = "uni";
        d.consultar = false;
      } else if (d._modo === "consultar") {
        d.consultar = true;
        d.variantes = null;
        d.precio_centavos = 0;
      } else {
        d.consultar = false;
        d.variantes = null;
      }
      const row = pick({ ...d, id: d.id || `p-${slugify(d.nombre)}` }, PROD_COLS);
      const { error } = await supabase.from("products").upsert(row);
      if (error) { setMsg("No se pudo guardar: " + error.message); return; }
    } else {
      const row = pick(
        { ...data, id: data.id || `cat-${slugify(data.nombre)}`, slug: data.slug || slugify(data.nombre), ref_keyword: data.ref_keyword ?? data.refKeyword },
        CAT_COLS
      );
      const { error } = await supabase.from("categories").upsert(row);
      if (error) { setMsg("No se pudo guardar: " + error.message); return; }
    }
    setForm(null);
    setMsg("Guardado ✓");
    cargar();
  }

  const TabBtn = ({ id, children }) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${tab === id ? "bg-marca text-cream" : "text-cacao/60 hover:bg-masa/70"}`}
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
        <div className="relative order-last w-full sm:order-0 sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cacao/40" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder={tab === "productos" ? "Buscar producto…" : "Buscar categoría…"}
            className="w-full rounded-full border border-cacao/15 bg-white py-2 pl-9 pr-3 text-sm text-cacao outline-none focus:border-marca"
          />
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

      {(cargando || msg) && (
        <p className={`rounded-lg px-3 py-2 text-xs font-medium ring-1 ${cargando ? "bg-masa/40 text-cacao/60 ring-cacao/10" : "bg-green-50 text-green-700 ring-green-200"}`}>
          {cargando ? "Cargando del servidor…" : msg}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-cacao/5">
        {tab === "productos" ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cacao/10 text-left text-xs uppercase tracking-wide text-cacao/45">
                <th className="p-3 font-semibold">Foto</th>
                <th className="p-3 font-semibold">Producto</th>
                <th className="p-3 font-semibold">Categoría</th>
                <th className="p-3 text-right font-semibold">Precio</th>
                <th className="p-3 text-center font-semibold">Estado</th>
                <th className="p-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cacao/5">
              {prodsFiltrados.map((p) => (
                <tr key={p.id} className="hover:bg-masa/20">
                  <td className="p-3">
                    {p.imagen_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imagen_url} alt="" className="h-10 w-10 rounded-lg object-cover ring-1 ring-cacao/10" />
                    ) : (
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-masa/50 text-[10px] text-cacao/40">—</span>
                    )}
                  </td>
                  <td className="p-3 font-medium text-cacao/85">
                    {p.nombre}
                    {p.etiqueta && (
                      <span className={`ml-2 align-middle rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${estiloBadge(p.etiqueta).suave}`}>
                        {p.etiqueta}
                      </span>
                    )}
                    {p.nota && <span className="ml-2 align-middle text-[11px] text-cacao/45">· {p.nota}</span>}
                  </td>
                  <td className="p-3 text-cacao/60">{nombreCat(p.categoria_id)}</td>
                  <td className="p-3 text-right tabular-nums text-cacao/80">
                    <span className={p.estimado ? "text-cacao/55" : ""}>
                      {p.consultar || p.unidad === "variable"
                        ? "Consultar"
                        : (p.variantes?.length ? "desde " : "") + formatCentavos(precioDesde(p))}
                    </span>
                    {!p.variantes?.length && unidadSufijo(p.unidad) && <span className="ml-1 text-xs text-cacao/40">{unidadSufijo(p.unidad)}</span>}
                    {p.estimado && <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">aprox.</span>}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.disponible ? "bg-green-100 text-green-700" : "bg-cacao/10 text-cacao/50"}`}>
                      {p.disponible ? "Activo" : "Pausado"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={() => editarProducto(p)} className="grid h-8 w-8 place-items-center rounded-lg text-cacao/60 hover:bg-masa/70 hover:text-marca" aria-label="Editar">
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
                <th className="p-3 font-semibold">Frase</th>
                <th className="p-3 text-center font-semibold">Orden</th>
                <th className="p-3 text-center font-semibold">Estado</th>
                <th className="p-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cacao/5">
              {catsFiltradas.map((c) => (
                <tr key={c.id} className="hover:bg-masa/20">
                  <td className="p-3 font-medium text-cacao/85">
                    <span className="inline-flex items-center gap-2">
                      <span className={`grid h-7 w-7 place-items-center rounded-lg text-white ${c.color === "celeste" ? "bg-celeste" : c.color === "carbon" ? "bg-marca" : "bg-corteza text-cacao"}`}>
                        <IconoCategoria icono={c.icono} className="h-4 w-4" />
                      </span>
                      {c.nombre}
                    </span>
                  </td>
                  <td className="p-3 text-cacao/55">{c.slogan || "—"}</td>
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
          <form onSubmit={guardar} className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
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
                <Campo label="Categoría">
                  <select required value={form.data.categoria_id} onChange={(e) => setCampo("categoria_id", e.target.value)} className={INPUT}>
                    <option value="">Elegir…</option>
                    {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </Campo>

                {/* ── Precio ── */}
                <div className="rounded-xl bg-masa/30 p-3">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-cacao/50">Precio</p>
                  <div className="mb-3 flex flex-wrap gap-1 rounded-full bg-white p-0.5 ring-1 ring-cacao/10">
                    {[["simple", "Precio simple"], ["formatos", "Por formatos"], ["consultar", "A consultar"]].map(([v, l]) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setCampo("_modo", v)}
                        className={`flex-1 rounded-full px-2 py-1.5 text-xs font-semibold transition ${form.data._modo === v ? "bg-marca text-cream" : "text-cacao/60 hover:bg-masa/50"}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>

                  {form.data._modo === "simple" && (
                    <div className="grid grid-cols-2 items-start gap-3">
                      <Campo label="Precio (USD)">
                        <input type="number" step="0.5" min="0" value={dolar(form.data.precio_centavos)} onChange={(e) => setCampo("precio_centavos", aCent(e.target.value))} className={INPUT} />
                      </Campo>
                      <Campo label="Se cobra por">
                        <select value={form.data.unidad || "uni"} onChange={(e) => setCampo("unidad", e.target.value)} className={INPUT}>
                          {UNIDADES.map((u) => <option key={u.valor} value={u.valor}>{u.label}</option>)}
                        </select>
                      </Campo>
                      <label className="col-span-2 flex items-center gap-2 text-sm text-cacao/75">
                        <input type="checkbox" checked={!!form.data.estimado} onChange={(e) => setCampo("estimado", e.target.checked)} />
                        Precio estimado / a confirmar (muestra “≈ aprox.”)
                      </label>
                    </div>
                  )}

                  {form.data._modo === "formatos" && (
                    <Formatos
                      filas={form.data.variantes || [{ etiqueta: "", precio_centavos: 0 }]}
                      onChange={(variantes) => setCampo("variantes", variantes)}
                    />
                  )}

                  {form.data._modo === "consultar" && (
                    <p className="text-xs text-cacao/60">
                      Se muestra <b>“Consultar”</b> en lugar del precio, pero el producto <b>sí se puede agregar</b> al pedido
                      (así la panadería sabe qué consulta el cliente).
                    </p>
                  )}
                </div>

                <Campo label="Pedido mínimo (cantidad — 1 = sin mínimo). El contador del sitio arranca acá y no baja de este número.">
                  <input type="number" min="1" value={form.data.min_cantidad || 1} onChange={(e) => setCampo("min_cantidad", Math.max(1, Number(e.target.value) || 1))} className={INPUT} />
                </Campo>
                <Campo label="Nota / consideración (opcional — ej: Consultá por otras variedades)">
                  <input value={form.data.nota || ""} onChange={(e) => setCampo("nota", e.target.value)} className={INPUT} />
                </Campo>
                <Campo label="Descripción">
                  <textarea rows={2} value={form.data.descripcion || ""} onChange={(e) => setCampo("descripcion", e.target.value)} className={INPUT} />
                </Campo>

                <Campo label="Imagen (la que se ve en el sitio público)">
                  <ZonaImagen
                    url={form.data.imagen_url}
                    subiendo={subiendo}
                    onArchivo={subirImagen}
                    onUrl={(u) => setCampo("imagen_url", u)}
                    onQuitar={() => setCampo("imagen_url", "")}
                  />
                </Campo>

                <Campo label="Etiqueta / badge (para destacar o promocionar)">
                  <input value={form.data.etiqueta || ""} onChange={(e) => setCampo("etiqueta", e.target.value)} placeholder="Ej: Promo, Nuevo, 2x1…" className={INPUT} />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {BADGES.map((b) => (
                      <button key={b} type="button" onClick={() => setCampo("etiqueta", b)} className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 transition ${estiloBadge(b).suave} ${form.data.etiqueta === b ? "ring-2 ring-offset-1" : ""}`}>
                        {b}
                      </button>
                    ))}
                    <button type="button" onClick={() => setCampo("etiqueta", "")} className="rounded-full bg-masa/60 px-2.5 py-1 text-xs font-semibold text-cacao/50 hover:bg-masa">Sin badge</button>
                  </div>
                </Campo>

                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm text-cacao/75">
                    <input type="checkbox" checked={!!form.data.disponible} onChange={(e) => setCampo("disponible", e.target.checked)} /> Disponible
                  </label>
                  <label className="flex items-center gap-2 text-sm text-cacao/75">
                    <input type="checkbox" checked={!!form.data.destacado} onChange={(e) => setCampo("destacado", e.target.checked)} /> Destacado
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Campo label="Nombre">
                  <input required value={form.data.nombre} onChange={(e) => setCampo("nombre", e.target.value)} className={INPUT} />
                </Campo>
                <Campo label="Frase / slogan (subtítulo de la sección)">
                  <input value={form.data.slogan || ""} onChange={(e) => setCampo("slogan", e.target.value)} placeholder="Ej: Dulce de leche en todo lo que se pueda" className={INPUT} />
                </Campo>
                <Campo label="Texto cálido (intro de la sección, opcional)">
                  <textarea rows={2} value={form.data.texto || ""} onChange={(e) => setCampo("texto", e.target.value)} placeholder="Ej: El cierre dulce que no puede faltar." className={INPUT} />
                </Campo>
                <Campo label="Color">
                  <div className="flex gap-2">
                    {COLORES.map(([v, l]) => (
                      <button key={v} type="button" onClick={() => setCampo("color", v)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold ring-2 transition ${form.data.color === v ? "ring-marca" : "ring-transparent"} ${v === "celeste" ? "bg-celeste text-white" : v === "carbon" ? "bg-marca text-cream" : "bg-corteza text-cacao"}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </Campo>
                <Campo label="Ícono">
                  <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto rounded-lg bg-masa/20 p-2">
                    {ICONOS_CATEGORIA.map((ic) => (
                      <button key={ic} type="button" onClick={() => setCampo("icono", ic)} className={`grid h-9 w-9 place-items-center rounded-lg ring-2 transition ${form.data.icono === ic ? "bg-marca text-cream ring-marca" : "bg-masa/50 text-cacao/70 ring-transparent hover:bg-masa"}`} aria-label={ic}>
                        <IconoCategoria icono={ic} className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
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
              <button type="button" onClick={() => setForm(null)} className="rounded-full px-4 py-2 text-sm font-semibold text-cacao/60 hover:bg-masa/70">Cancelar</button>
              <button type="submit" className="rounded-full bg-marca px-5 py-2 text-sm font-bold text-cream shadow-sm hover:brightness-110">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const INPUT = "w-full rounded-lg border border-cacao/15 bg-white px-3 py-2 text-sm text-cacao outline-none focus:border-marca";

// Editor de formatos de precio: [{ etiqueta, precio_centavos }].
function Formatos({ filas, onChange }) {
  const set = (i, campo, v) =>
    onChange(filas.map((f, idx) => (idx === i ? { ...f, [campo]: campo === "precio_centavos" ? aCent(v) : v } : f)));
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_7rem_auto] gap-2 text-[11px] font-semibold uppercase tracking-wide text-cacao/40">
        <span>Formato</span><span>Precio USD</span><span />
      </div>
      {filas.map((f, i) => (
        <div key={i} className="grid grid-cols-[1fr_7rem_auto] gap-2">
          <input value={f.etiqueta} onChange={(e) => set(i, "etiqueta", e.target.value)} placeholder="Docena / ½ docena / Unidad" className={INPUT} />
          <input type="number" step="0.5" min="0" value={dolar(f.precio_centavos)} onChange={(e) => set(i, "precio_centavos", e.target.value)} className={INPUT} />
          <button type="button" onClick={() => onChange(filas.filter((_, idx) => idx !== i))} disabled={filas.length === 1} className="grid h-9 w-9 place-items-center rounded-lg text-cacao/50 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-30" aria-label="Quitar">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...filas, { etiqueta: "", precio_centavos: 0 }])} className="text-xs font-semibold text-marca hover:underline">
        + Agregar formato
      </button>
      <p className="text-[11px] text-cacao/45">En la tarjeta se muestra “desde” el más barato; en el detalle, el cliente elige el formato.</p>
    </div>
  );
}

// Zona de imagen: drag & drop + clic para subir, con preview y sin exponer la
// URL técnica. Opción secundaria de pegar un enlace.
function ZonaImagen({ url, subiendo, onArchivo, onUrl, onQuitar }) {
  const [drag, setDrag] = useState(false);
  const [modoUrl, setModoUrl] = useState(false);
  const [urlManual, setUrlManual] = useState("");

  const soltar = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onArchivo(f);
  };

  if (url) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-masa/30 p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover ring-1 ring-cacao/10" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-green-700">✓ Imagen cargada</p>
          <p className="text-xs text-cacao/45">Se muestra en el sitio público.</p>
        </div>
        <button type="button" onClick={onQuitar} className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50">
          Quitar / cambiar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={soltar}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${drag ? "border-marca bg-marca/5" : "border-cacao/20 hover:border-marca/50 hover:bg-masa/20"}`}
      >
        {subiendo ? (
          <span className="flex items-center gap-2 text-sm text-cacao/60"><Loader2 className="h-4 w-4 animate-spin" /> Subiendo…</span>
        ) : (
          <>
            <Upload className="h-6 w-6 text-cacao/40" />
            <span className="text-sm font-semibold text-cacao/70">Arrastrá una imagen o hacé clic</span>
            <span className="text-xs text-cacao/45">JPG o PNG</span>
          </>
        )}
        <input type="file" accept="image/*" disabled={subiendo} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; const input = e.target; if (f) onArchivo(f).finally(() => { input.value = ""; }); }} />
      </label>

      {!modoUrl ? (
        <button type="button" onClick={() => setModoUrl(true)} className="text-xs font-semibold text-marca hover:underline">
          o pegar el enlace de una imagen
        </button>
      ) : (
        <div className="flex gap-2">
          <input value={urlManual} onChange={(e) => setUrlManual(e.target.value)} placeholder="https://…" className={INPUT} />
          <button
            type="button"
            onClick={() => { if (urlManual.trim()) { onUrl(urlManual.trim()); setUrlManual(""); setModoUrl(false); } }}
            className="shrink-0 rounded-lg bg-marca px-3 py-2 text-xs font-bold text-cream hover:brightness-110"
          >
            Usar
          </button>
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
