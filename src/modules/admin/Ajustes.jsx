"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";

const INPUT = "mt-1 w-full rounded-lg border border-cacao/15 bg-white px-3 py-2 text-sm text-cacao outline-none focus:border-marca";
const DIAS = [["lun", "Lunes"], ["mar", "Martes"], ["mie", "Miércoles"], ["jue", "Jueves"], ["vie", "Viernes"], ["sab", "Sábado"], ["dom", "Domingo"]];
// Columnas editables de business_settings.
const COLS = ["id", "nombre_negocio", "whatsapp_numero", "tagline", "direccion", "maps_url", "mensaje_bienvenida", "mensaje_pedido_template", "instagram_url", "tiktok_url", "facebook_url", "horarios"];
const pick = (o) => Object.fromEntries(COLS.filter((k) => k in o && o[k] !== undefined).map((k) => [k, o[k]]));

// Horario guardado como texto ("07:00–16:00" | "Cerrado") ↔ estructura editable.
const parseHorario = (str) => {
  if (!str || /cerrado/i.test(str)) return { abierto: false, desde: "07:00", hasta: "16:00" };
  const [desde, hasta] = str.split(/[–-]/).map((s) => s.trim());
  return { abierto: true, desde: desde || "07:00", hasta: hasta || "16:00" };
};
const fmtHorario = (h) => (h.abierto ? `${h.desde}–${h.hasta}` : "Cerrado");

// Ajustes del negocio (fila única business_settings). Persiste en Supabase.
export function Ajustes() {
  const supabase = getSupabase();
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.from("business_settings").select("*").eq("id", 1).single().then(({ data }) => {
      setData(data || { id: 1, horarios: {} });
      setCargando(false);
    });
  }, [supabase]);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const setHora = (dia, v) => setData((d) => ({ ...d, horarios: { ...(d.horarios || {}), [dia]: v } }));

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setMsg("");
    const { error } = await supabase.from("business_settings").upsert({ ...pick(data), id: 1 });
    setGuardando(false);
    setMsg(error ? "No se pudo guardar: " + error.message : "Guardado ✓");
  }

  if (cargando) return <p className="text-sm text-cacao/50">Cargando ajustes…</p>;

  return (
    <form onSubmit={guardar} className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Negocio">
          <Campo label="Nombre del negocio"><input value={data.nombre_negocio || ""} onChange={(e) => set("nombre_negocio", e.target.value)} className={INPUT} /></Campo>
          <Campo label="Tagline (frase corta)"><input value={data.tagline || ""} onChange={(e) => set("tagline", e.target.value)} className={INPUT} /></Campo>
          <Campo label="WhatsApp (con código de país)"><input value={data.whatsapp_numero || ""} onChange={(e) => set("whatsapp_numero", e.target.value)} placeholder="+15715804516" className={INPUT} /></Campo>
        </Card>

        <Card titulo="Ubicación · botón “¿Cómo llegar?”">
          <Campo label="Dirección"><input value={data.direccion || ""} onChange={(e) => set("direccion", e.target.value)} className={INPUT} /></Campo>
          <Campo label="Link de Google Maps"><input value={data.maps_url || ""} onChange={(e) => set("maps_url", e.target.value)} placeholder="https://maps.app.goo.gl/…" className={INPUT} /></Campo>
        </Card>

        <Card titulo="Redes sociales">
          <Campo label="Instagram"><input value={data.instagram_url || ""} onChange={(e) => set("instagram_url", e.target.value)} className={INPUT} /></Campo>
          <Campo label="TikTok"><input value={data.tiktok_url || ""} onChange={(e) => set("tiktok_url", e.target.value)} className={INPUT} /></Campo>
          <Campo label="Facebook"><input value={data.facebook_url || ""} onChange={(e) => set("facebook_url", e.target.value)} className={INPUT} /></Campo>
        </Card>

        <Card titulo="Horarios">
          <div className="space-y-1.5">
            {DIAS.map(([k, label]) => {
              const h = parseHorario(data.horarios?.[k]);
              const upd = (patch) => setHora(k, fmtHorario({ ...h, ...patch }));
              return (
                <div key={k} className="flex items-center gap-2">
                  <label className="flex w-28 shrink-0 cursor-pointer items-center gap-2 text-sm text-cacao/80">
                    <input type="checkbox" checked={h.abierto} onChange={(e) => upd({ abierto: e.target.checked })} />
                    {label}
                  </label>
                  {h.abierto ? (
                    <div className="flex items-center gap-1.5">
                      <input type="time" value={h.desde} onChange={(e) => upd({ desde: e.target.value })} className="rounded-lg border border-cacao/15 bg-white px-2 py-1.5 text-sm text-cacao outline-none focus:border-marca" />
                      <span className="text-cacao/40">a</span>
                      <input type="time" value={h.hasta} onChange={(e) => upd({ hasta: e.target.value })} className="rounded-lg border border-cacao/15 bg-white px-2 py-1.5 text-sm text-cacao outline-none focus:border-marca" />
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-cacao/35">Cerrado</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card titulo="Mensajes" full>
          <Campo label="Mensaje de bienvenida"><textarea rows={2} value={data.mensaje_bienvenida || ""} onChange={(e) => set("mensaje_bienvenida", e.target.value)} className={INPUT} /></Campo>
          <Campo label="Plantilla del pedido de WhatsApp ({items}, {personas}, {total})">
            <textarea rows={5} value={data.mensaje_pedido_template || ""} onChange={(e) => set("mensaje_pedido_template", e.target.value)} className={INPUT} />
          </Campo>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-3">
        {msg && <span className={`text-sm font-medium ${msg.startsWith("Guardado") ? "text-green-600" : "text-red-600"}`}>{msg}</span>}
        <button type="submit" disabled={guardando} className="inline-flex items-center gap-2 rounded-full bg-marca px-5 py-2.5 text-sm font-bold text-cream shadow-sm transition hover:brightness-110 disabled:opacity-60">
          {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar cambios
        </button>
      </div>
    </form>
  );
}

function Card({ titulo, children, full }) {
  return (
    <div className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-cacao/5 ${full ? "lg:col-span-2" : ""}`}>
      <h3 className="mb-3 font-display font-bold text-cacao">{titulo}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wide text-cacao/45">{label}</span>
      {children}
    </label>
  );
}
