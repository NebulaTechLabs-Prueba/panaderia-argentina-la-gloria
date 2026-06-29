// Emblema de marca de La Gloria.
// ⚠ Es una RECREACIÓN en SVG inspirada en el logo real (anillo naranja, centro
//   celeste, texto en arco y banner "LA GLORIA"), como placeholder digno hasta
//   tener el archivo original. Si se pasa `src` (URL/archivo del logo real), se
//   muestra ese en su lugar — un solo cambio y queda el logo verdadero.
export function LogoLaGloria({ src, className = "h-24 w-24", alt = "Panadería Argentina La Gloria" }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={`rounded-full object-cover ${className}`} />;
  }

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={alt}>
      <defs>
        <path id="lg-arc-top" d="M 32 100 A 68 68 0 0 1 168 100" fill="none" />
      </defs>

      {/* Anillos */}
      <circle cx="100" cy="100" r="98" fill="#FF9900" />
      <circle cx="100" cy="100" r="82" fill="#63B0DD" />
      <circle cx="100" cy="100" r="82" fill="none" stroke="#ffffff" strokeWidth="2.5" />

      {/* Texto en arco superior */}
      <text fill="#ffffff" fontSize="15" fontWeight="700" letterSpacing="2.5">
        <textPath href="#lg-arc-top" startOffset="50%" textAnchor="middle">
          PANADERÍA · ARGENTINA
        </textPath>
      </text>

      {/* Toque de chef (panadero) */}
      <g fill="#ffffff">
        <circle cx="83" cy="82" r="13" />
        <circle cx="100" cy="76" r="16" />
        <circle cx="117" cy="82" r="13" />
        <rect x="82" y="88" width="36" height="16" rx="3" />
      </g>
      {/* Espigas de trigo a los lados */}
      <g stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round">
        <path d="M70 112 q-4 -6 0 -12 M70 112 q4 -6 0 -12 M70 112 v-12" />
        <path d="M130 112 q-4 -6 0 -12 M130 112 q4 -6 0 -12 M130 112 v-12" />
      </g>

      {/* Banner inferior */}
      <rect x="40" y="116" width="120" height="36" rx="7" fill="#FF9900" />
      <rect x="40" y="116" width="120" height="36" rx="7" fill="none" stroke="#ffffff" strokeWidth="2" />
      <text
        x="100"
        y="141"
        fill="#2e2a26"
        fontSize="24"
        fontWeight="900"
        textAnchor="middle"
        className="font-display"
      >
        LA GLORIA
      </text>
    </svg>
  );
}
