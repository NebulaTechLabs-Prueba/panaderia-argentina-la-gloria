"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";

// ── Primitivas visuales del panel (todo SVG/CSS, sin librerías) ──

export function Card({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-cacao/5 ${className}`}>
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="font-display font-bold text-cacao">{title}</h3>}
            {subtitle && <p className="text-sm text-cacao/50">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function Delta({ value }) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-bold ${
        up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
      }`}
    >
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

export function Sparkline({ data, color = "#ff9900" }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${30 - ((v - min) / span) * 26 - 2}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-8 w-full">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function Kpi({ label, value, delta, spark }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-cacao/5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-cacao/60">{label}</span>
        {typeof delta === "number" && <Delta value={delta} />}
      </div>
      <p className="mt-1 font-display text-3xl font-extrabold text-cacao">{value}</p>
      {spark && (
        <div className="mt-2">
          <Sparkline data={spark} />
        </div>
      )}
    </div>
  );
}

const DOW_C = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MES_C = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fmtDiaLargo = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${DOW_C[new Date(y, m - 1, d).getDay()]} ${d} ${MES_C[m - 1]}`;
};
const fmtDiaCorto = (iso) => {
  const [, m, d] = iso.split("-").map(Number);
  return `${d}/${m}`;
};

export function LineChart({ data, previa, color = "#2f3a7e", height = 220, labels, unidad = "" }) {
  const hayPrevia = Array.isArray(previa) && previa.length === data.length;
  const pool = hayPrevia ? data.concat(previa) : data;
  const max = Math.max(...pool);
  const min = Math.min(...pool);
  const span = max - min || 1;
  const y = (v) => 100 - ((v - min) / span) * 88 - 6;
  const x = (i) => (data.length > 1 ? (i / (data.length - 1)) * 100 : 50);
  const toLine = (arr) => arr.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const line = toLine(data);
  const area = `0,100 ${line} 100,100`;
  // Puntos con día: tooltip por punto + eje X con ~6 fechas repartidas.
  const hayDias = Array.isArray(labels) && labels.length === data.length && data.length > 0;
  const nTicks = Math.min(6, data.length);
  const ticks = hayDias
    ? Array.from({ length: nTicks }, (_, k) => {
        const i = nTicks > 1 ? Math.round((k / (nTicks - 1)) * (data.length - 1)) : 0;
        return { i, txt: fmtDiaCorto(labels[i]) };
      })
    : [];
  return (
    <div>
      {hayPrevia && (
        <div className="mb-2 flex items-center gap-4 text-xs text-cacao/50">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded" style={{ background: color }} /> Este período
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0 w-4 border-t-2 border-dashed border-cacao/40" /> Período anterior
          </span>
        </div>
      )}
      <div className="relative" style={{ height }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id="lc-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.22" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[25, 50, 75].map((g) => (
            <line key={g} x1="0" y1={g} x2="100" y2={g} stroke="#2a2a33" strokeOpacity="0.06" strokeWidth="0.4" />
          ))}
          <polygon points={area} fill="url(#lc-fill)" />
          {hayPrevia && (
            <polyline
              points={toLine(previa)}
              fill="none"
              stroke="#2a2a33"
              strokeOpacity="0.3"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
          <polyline
            points={line}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {hayDias &&
          data.map((v, i) => (
            <div
              key={i}
              title={`${fmtDiaLargo(labels[i])} · ${v}${unidad ? " " + unidad : ""}`}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x(i)}%`, top: `${y(v)}%` }}
            >
              <span
                className="block h-2.5 w-2.5 rounded-full border-2 border-white shadow-sm transition group-hover:scale-150"
                style={{ backgroundColor: color }}
              />
            </div>
          ))}
      </div>
      {hayDias && (
        <div className="relative mt-1.5 h-4 text-[10px] text-cacao/45">
          {ticks.map((t) => (
            <span key={t.i} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${x(t.i)}%` }}>
              {t.txt}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function BarList({ items, color = "#ff9900", unit = "" }) {
  const max = Math.max(...items.map((i) => i.valor));
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-cacao/80">{it.label}</span>
            <span className="font-semibold text-cacao/60">
              {it.valor}
              {unit}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-masa/60">
            <div
              className="h-full rounded-full"
              style={{ width: `${(it.valor / max) * 100}%`, backgroundColor: it.color || color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Donut({ segments, size = 160, thickness = 22 }) {
  const total = segments.reduce((s, x) => s + x.valor, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-wrap items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="h-auto w-32 shrink-0 sm:w-36">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {segments.map((s) => {
            const len = (s.valor / total) * c;
            const el = (
              <circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
        </g>
      </svg>
      <ul className="min-w-0 flex-1 space-y-1.5 text-sm">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="truncate text-cacao/70">{s.label}</span>
            <span className="ml-auto shrink-0 font-semibold text-cacao">{s.valor}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Funnel({ steps }) {
  const top = steps[0]?.valor || 1;
  return (
    <div className="space-y-2">
      {steps.map((s, i) => {
        const pct = (s.valor / top) * 100;
        const prev = i === 0 ? 0 : steps[i - 1].valor;
        const desde = i === 0 ? 100 : prev ? (s.valor / prev) * 100 : 0;
        return (
          <div key={s.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-cacao/80">{s.label}</span>
              <span className="font-semibold text-cacao">
                {s.valor.toLocaleString("es")}{" "}
                <span className="text-cacao/40">· {desde.toFixed(0)}%</span>
              </span>
            </div>
            <div className="h-9 overflow-hidden rounded-lg bg-masa/50">
              <div
                className="flex h-full items-center rounded-lg bg-linear-to-r from-marca to-celeste px-3 text-xs font-bold text-white"
                style={{ width: `${Math.max(pct, 12)}%` }}
              >
                {pct.toFixed(0)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Columnas({ data, color = "#2f3a7e", height = 150 }) {
  const max = Math.max(...data.map((d) => d.valor)) || 1;
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex h-full flex-1 flex-col items-center">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md transition-all"
              style={{ height: `${(d.valor / max) * 100}%`, backgroundColor: color }}
              title={`${d.label}: ${d.valor}`}
            />
          </div>
          <span className="mt-1 text-[10px] text-cacao/50">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

const IMPACTO_STYLE = {
  alto: "bg-orange-100 text-orange-700",
  medio: "bg-amber-100 text-amber-700",
  bajo: "bg-cacao/10 text-cacao/50",
};

export function Impacto({ nivel }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-bold capitalize ${IMPACTO_STYLE[nivel]}`}>
      {nivel}
    </span>
  );
}

const ESTADO_STYLE = {
  ok: "bg-green-100 text-green-700",
  pendiente: "bg-amber-100 text-amber-700",
  alerta: "bg-red-100 text-red-600",
};
const ESTADO_TXT = { ok: "Listo", pendiente: "Pendiente", alerta: "Revisar" };

export function EstadoPill({ estado }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${ESTADO_STYLE[estado]}`}>
      {ESTADO_TXT[estado]}
    </span>
  );
}
