"use client";

import { useEffect, useRef, useState } from "react";

// Reproduce una lista de videos en secuencia lógica y vuelve a empezar (loop).
// Con un solo video, simplemente hace loop. Corte directo entre clips.
export function VideoSecuencia({ fuentes = [], poster, className }) {
  const ref = useRef(null);
  const [i, setI] = useState(0);
  const uno = fuentes.length <= 1;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.load();
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  }, [i]);

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      muted
      playsInline
      loop={uno}
      poster={poster}
      onEnded={uno ? undefined : () => setI((prev) => (prev + 1) % fuentes.length)}
    >
      <source src={fuentes[i]} type="video/mp4" />
    </video>
  );
}
