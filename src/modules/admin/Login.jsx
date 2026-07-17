"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Loader2 } from "lucide-react";
import { asset, adminBase } from "@/lib/config/constants";
import { getSupabase } from "@/lib/supabase/client";

const INPUT = "w-full rounded-lg border border-cacao/15 px-3 py-2.5 text-sm text-cacao outline-none focus:border-marca";

// Login REAL del panel (Supabase Auth). Solo el super-admin puede escribir
// (lo impone RLS); cualquier otro usuario logueado solo podría leer.
export function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const entrar = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    const { error: err } = await getSupabase().auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });
    setCargando(false);
    if (err) {
      setError("Email o contraseña incorrectos.");
      return;
    }
    router.replace(adminBase() || "/");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-marca p-4">
      <form onSubmit={entrar} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/logo.png")} alt="La Gloria" className="h-16 w-16 rounded-full ring-2 ring-masa" />
          <h1 className="mt-3 font-display text-xl font-extrabold text-cacao">Panel de gestión</h1>
          <p className="text-sm text-cacao/50">Panadería Argentina La Gloria</p>
        </div>

        <div className="mt-6 space-y-3">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className={INPUT} autoComplete="username" />
          <input type="password" required value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Contraseña" className={INPUT} autoComplete="current-password" />
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 ring-1 ring-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-corteza py-3 font-bold text-cacao transition hover:brightness-105 disabled:opacity-60"
        >
          {cargando ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
          {cargando ? "Ingresando…" : "Ingresar"}
        </button>

        <p className="mt-4 text-center text-xs text-cacao/45">
          Acceso restringido al equipo de La Gloria.
        </p>
      </form>
    </div>
  );
}
