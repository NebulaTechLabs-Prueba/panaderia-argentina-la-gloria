"use client";

import { MapPin, Clock, MessageCircle } from "lucide-react";
import { useNegocio } from "./NegocioProvider";
import { LogoLaGloria } from "@/components/ui/LogoLaGloria";
import { buildWhatsappUrl } from "@/modules/whatsapp/buildWhatsappUrl";

// Iconos de marca (lucide v1 no trae redes sociales) — SVG inline.
function IgIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function TtIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.5 3c.3 2.1 1.6 3.6 3.7 3.9v2.5c-1.3.1-2.5-.2-3.7-.9v5.6c0 3.3-2.5 5.4-5.5 5.4-2.8 0-5-2-5-4.9 0-3 2.5-5 5.6-4.7v2.6c-.4-.1-.8-.2-1.2-.2-1.3 0-2.2.9-2.2 2.2 0 1.4 1 2.3 2.3 2.3 1.4 0 2.4-1 2.4-2.7V3h3.6Z" />
    </svg>
  );
}
function FbIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M14 9h2.5l.5-3H14V4.5c0-.9.3-1.5 1.6-1.5H17V.3C16.7.2 15.8.1 14.7.1 12.3.1 10.7 1.6 10.7 4.2V6H8v3h2.7v8H14V9Z" />
    </svg>
  );
}

function Red({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-cream ring-1 ring-white/15 transition hover:bg-corteza hover:text-cacao"
    >
      {children}
    </a>
  );
}

const DIAS = [
  ["lun", "Lun"], ["mar", "Mar"], ["mie", "Mié"], ["jue", "Jue"],
  ["vie", "Vie"], ["sab", "Sáb"], ["dom", "Dom"],
];

// Agrupa días CONSECUTIVOS con el mismo horario en un solo rango, para abreviar.
// Ej: {lun..vie: 07–20, sáb: 08–21, dom: 08–13} → "Lun–Vie", "Sáb", "Dom".
function agruparHorarios(horarios) {
  const grupos = [];
  for (const [k, label] of DIAS) {
    const h = horarios?.[k];
    if (!h) continue;
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.hours === h) {
      ultimo.fin = label;
    } else {
      grupos.push({ ini: label, fin: label, hours: h });
    }
  }
  return grupos.map((g) => ({
    dias: g.ini === g.fin ? g.ini : `${g.ini}–${g.fin}`,
    hours: g.hours,
  }));
}

export function SiteFooter() {
  const ajustes = useNegocio();
  const nombre = ajustes?.nombre_negocio ?? "Panadería Argentina La Gloria";
  const anio = new Date().getFullYear();

  const waUrl = ajustes?.whatsapp_numero
    ? buildWhatsappUrl(ajustes.whatsapp_numero, "¡Hola, La Gloria! 🥐 Quería hacerles una consulta.")
    : null;

  // "¿Cómo llegar?" — usa maps_url configurable, o lo arma a partir de la dirección.
  const mapsUrl =
    ajustes?.maps_url ||
    (ajustes?.direccion
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ajustes.direccion)}`
      : null);

  return (
    <footer className="relative overflow-hidden bg-marca text-cream">
      {/* filo superior con los colores de la marca */}
      <div aria-hidden="true" className="flex h-1.5 w-full">
        <div className="flex-1 bg-corteza" />
        <div className="flex-1 bg-celeste" />
        <div className="flex-1 bg-corteza" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-12">
        {/* Marca */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <LogoLaGloria src={ajustes?.logo_url} className="h-14 w-14 shrink-0" />
            <div>
              <p className="font-display text-lg font-extrabold leading-tight">{nombre}</p>
              <p className="text-sm text-cream/60">{ajustes?.tagline ?? "Un cachito de Argentina, recién horneado."}</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
            Panadería y pastelería argentina artesanal. Armá tu pedido por el catálogo y
            lo coordinamos al instante por WhatsApp.
          </p>
        </div>

        {/* Visitanos */}
        <div className="lg:col-span-4">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-corteza">Visitanos</h3>
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-cream ring-1 ring-white/15 transition hover:bg-corteza hover:text-cacao"
            >
              <MapPin className="h-4 w-4 shrink-0" /> ¿Cómo llegar?
            </a>
          )}
          {ajustes?.horarios && (
            <div className="mt-3">
              <p className="flex items-center gap-2 text-sm font-medium text-cream/80">
                <Clock className="h-4 w-4 shrink-0 text-celeste" /> Horarios
              </p>
              <dl className="mt-2 space-y-0.5 text-sm text-cream/60">
                {agruparHorarios(ajustes.horarios).map((g) => (
                  <div key={g.dias} className="flex justify-between gap-4">
                    <dt>{g.dias}</dt>
                    <dd className="tabular-nums">{g.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Seguinos / Contacto */}
        <div className="lg:col-span-3">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-corteza">Seguinos</h3>
          <div className="mt-3 flex gap-2">
            {ajustes?.instagram_url && (
              <Red href={ajustes.instagram_url} label="Instagram"><IgIcon className="h-5 w-5" /></Red>
            )}
            {ajustes?.tiktok_url && (
              <Red href={ajustes.tiktok_url} label="TikTok"><TtIcon className="h-5 w-5" /></Red>
            )}
            {ajustes?.facebook_url && (
              <Red href={ajustes.facebook_url} label="Facebook"><FbIcon className="h-5 w-5" /></Red>
            )}
          </div>
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={2.2} />
              Escribinos
            </a>
          )}
        </div>
      </div>

      {/* Barra legal */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-cream/55 sm:flex-row">
          <p>© {anio} {nombre}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5">
            Hecho con cariño <span aria-hidden="true">🧉🥐</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
