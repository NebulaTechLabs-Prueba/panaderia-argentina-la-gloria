"use client";

import { useEffect, useState } from "react";

// Hora actual en Argentina y en la panadería (Virginia, EE. UU.), formato 12h.
// Se muestran ambas a la vez. Client component: arranca en null para no romper la
// hidratación (el servidor no tiene "ahora"), y se actualiza cada 30 s.
const fmt = (tz) => new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit", hour12: true });

export function RelojDual({ className = "" }) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  // Reserva de espacio antes de tener la hora (evita salto de layout / mismatch).
  if (!now) return <div className={`w-[92px] shrink-0 ${className}`} aria-hidden />;

  return (
    <div
      className={`flex shrink-0 flex-col items-end gap-0.5 text-[11px] font-semibold leading-none text-cacao/70 ${className}`}
      title="Hora en Argentina y en la panadería (Virginia, EE. UU.)"
    >
      <span className="whitespace-nowrap">🇦🇷 {fmt("America/Argentina/Buenos_Aires").format(now)}</span>
      <span className="whitespace-nowrap">🇺🇸 {fmt("America/New_York").format(now)}</span>
    </div>
  );
}
