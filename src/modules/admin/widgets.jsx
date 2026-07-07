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

export function LineChart({ data, color = "#2f3a7e", height = 220 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const y = (v) => 100 - ((v - min) / span) * 88 - 6;
  const line = data.map((v, i) => `${(i / (data.length - 1)) * 100},${y(v)}`).join(" ");
  const area = `0,100 ${line} 100,100`;
  return (
    <div style={{ height }}>
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
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
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
      <ul className="space-y-1.5 text-sm">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-cacao/70">{s.label}</span>
            <span className="ml-auto font-semibold text-cacao">{s.valor}%</span>
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
        const desde = i === 0 ? 100 : (s.valor / steps[i - 1].valor) * 100;
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
