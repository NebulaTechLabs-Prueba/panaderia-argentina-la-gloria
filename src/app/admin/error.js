"use client";

// Error boundary del panel: si una sección falla al renderizar, mostramos una
// pantalla de recuperación en vez del "This page couldn't load" en blanco.
export default function AdminError({ error, reset }) {
  return (
    <div className="grid min-h-screen place-items-center bg-marca p-4 text-center">
      <div className="max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <p className="font-display text-lg font-bold text-cacao">Algo falló al cargar el panel</p>
        <p className="mt-2 text-sm text-cacao/55">
          Probá recargar. Si el problema sigue, cerrá sesión y volvé a entrar.
        </p>
        {error?.digest && <p className="mt-2 text-xs text-cacao/30">Ref: {error.digest}</p>}
        <div className="mt-5 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-marca px-5 py-2.5 text-sm font-bold text-cream transition hover:brightness-110"
          >
            Reintentar
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-cacao/10 px-5 py-2.5 text-sm font-bold text-cacao transition hover:bg-cacao/15"
          >
            Recargar página
          </button>
        </div>
      </div>
    </div>
  );
}
