import { NextResponse } from "next/server";

// Sirve el panel de gestión desde su propio subdominio:
//   admin.panaderia-lagloria.com  →  árbol /admin del mismo proyecto.
//
// En el subdominio "admin.*" reescribimos (sin cambiar la URL de la barra) las
// rutas hacia /admin: la raíz "/" pasa a "/admin" y, p. ej., "/login" a
// "/admin/login". Las rutas que ya empiezan con /admin pasan sin tocar (por si
// se accede directo). Los assets estáticos se excluyen en el matcher.
export function proxy(request) {
  const host = (request.headers.get("host") || "").split(":")[0];
  const url = request.nextUrl;

  if (host.startsWith("admin.") && !url.pathname.startsWith("/admin")) {
    url.pathname = url.pathname === "/" ? "/admin" : `/admin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Excluir _next (chunks/imagenes) y cualquier archivo con extensión (logo.png,
  // favicon, etc.) para no reescribir assets ni romper CSS/JS.
  matcher: ["/((?!_next/|.*\\..*).*)"],
};
