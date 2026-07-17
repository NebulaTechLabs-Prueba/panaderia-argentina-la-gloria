"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";
import { asset, adminBase } from "@/lib/config/constants";
import { getSupabase } from "@/lib/supabase/client";

const INPUT = "w-full rounded-lg border border-cacao/15 px-3 py-2.5 text-sm text-cacao outline-none focus:border-marca";

// Página a la que llega el link de recuperación del email. Supabase establece
// una sesión temporal de "recovery"; acá el usuario define la nueva contraseña.
export function Reset() {
  const router = useRouter();
  const [listo, setListo] = useState(false); // hay sesión de recuperación
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setListo(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setListo(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const guardar = async (e) => {
    e.preventDefault();
    setError("");
    if (pass.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    if (pass !== pass2) return setError("Las contraseñas no coinciden.");
    setGuardando(true);
    const { error: err } = await getSupabase().auth.updateUser({ password: pass });
    setGuardando(false);
    if (err) return setError("No se pudo cambiar la contraseña. Pedí un nuevo link.");
    setOk(true);
    setTimeout(() => router.replace(adminBase() || "/"), 1800);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-marca p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/logo.png")} alt="La Gloria" className="h-16 w-16 rounded-full ring-2 ring-masa" />
          <h1 className="mt-3 font-display text-xl font-extrabold text-cacao">Nueva contraseña</h1>
          <p className="text-sm text-cacao/50">Panadería Argentina La Gloria</p>
        </div>

        {ok ? (
          <p className="mt-6 rounded-lg bg-green-50 px-3 py-3 text-center text-sm font-medium text-green-700 ring-1 ring-green-200">
            ¡Contraseña actualizada! Entrando al panel…
          </p>
        ) : !listo ? (
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-cacao/55">
            <Loader2 className="h-4 w-4 animate-spin" /> Validando el link…
          </p>
        ) : (
          <form onSubmit={guardar} className="mt-6 space-y-3">
            <input type="password" required value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Nueva contraseña" className={INPUT} autoComplete="new-password" />
            <input type="password" required value={pass2} onChange={(e) => setPass2(e.target.value)} placeholder="Repetí la contraseña" className={INPUT} autoComplete="new-password" />
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 ring-1 ring-red-200">{error}</p>}
            <button type="submit" disabled={guardando} className="flex w-full items-center justify-center gap-2 rounded-xl bg-corteza py-3 font-bold text-cacao transition hover:brightness-105 disabled:opacity-60">
              {guardando ? <Loader2 className="h-5 w-5 animate-spin" /> : <KeyRound className="h-5 w-5" />}
              Guardar contraseña
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
