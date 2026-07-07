"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { asset } from "@/lib/config/constants";

const INPUT = "w-full rounded-lg border border-cacao/15 px-3 py-2.5 text-sm text-cacao outline-none focus:border-marca";

// Login SIMULADO del panel. Sin backend no hay autenticación real: cualquier dato
// entra y solo deja una marca de "sesión" en sessionStorage para el flujo.
export function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const entrar = (e) => {
    e.preventDefault();
    try {
      sessionStorage.setItem("la-gloria:admin", "1");
    } catch {}
    router.replace("/admin");
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
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className={INPUT} />
          <input type="password" required value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Contraseña" className={INPUT} />
        </div>

        <button type="submit" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-corteza py-3 font-bold text-cacao transition hover:brightness-105">
          <LogIn className="h-5 w-5" /> Ingresar
        </button>

        <p className="mt-4 text-center text-xs text-cacao/45">
          Demo · sin backend. Cualquier dato ingresa. La autenticación real llega con Supabase.
        </p>
      </form>
    </div>
  );
}
