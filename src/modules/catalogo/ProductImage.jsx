"use client";

import { IconoCategoria } from "./IconoCategoria";
import { tile } from "./catColors";

// Imagen del producto con fallback de marca cuando aún no hay foto cargada.
// El fallback es un tile del color de la categoría + ícono de línea + patrón de
// lunares, para que se vea intencional (no un hueco vacío). Cuando el admin suba
// fotos a Supabase Storage, `src` traerá la URL pública y se muestra la foto.
export function ProductImage({ src, alt, color = "naranja", icono = "factura", className = "" }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- export estático: <img> con URLs públicas de Storage
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  const t = tile(color);
  return (
    <div aria-hidden="true" className={`relative flex h-full w-full items-center justify-center overflow-hidden ${t.bg} ${className}`}>
      {/* patrón de lunares sutil */}
      <svg className={`absolute inset-0 h-full w-full ${t.patron}`} aria-hidden="true">
        <defs>
          <pattern id={`dots-${color}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dots-${color})`} />
      </svg>
      <IconoCategoria icono={icono} className={`relative h-14 w-14 ${t.icono}`} />
    </div>
  );
}
