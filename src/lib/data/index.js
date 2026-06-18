// ────────────────────────────────────────────────────────────────────────────
// CAPA DE ACCESO A DATOS
// El resto de la app SOLO importa desde acá. Hoy resuelve con datos mock; mañana
// se reemplaza el cuerpo de cada función por una consulta a Supabase (en el
// navegador, vía lib/supabase/client) y la UI no cambia.
//
//   Ejemplo futuro:
//     import { supabase } from "@/lib/supabase/client";
//     export async function getCategorias() {
//       const { data, error } = await supabase
//         .from("categories").select("*").eq("activa", true).order("orden");
//       if (error) throw error;
//       return data;
//     }
// ────────────────────────────────────────────────────────────────────────────

import { categoriasMock } from "./mock/categorias";
import { productosMock } from "./mock/productos";
import { ajustesMock } from "./mock/ajustes";
import { IMAGENES_REF } from "./imagenesRef";
import { USAR_IMAGENES_REF } from "@/lib/config/constants";

// Pequeño delay para simular red y poder probar estados de carga/skeletons.
const SIMULAR_LATENCIA_MS = 250;
const demora = (valor) =>
  new Promise((resolve) => setTimeout(() => resolve(valor), SIMULAR_LATENCIA_MS));

// ⚠ SOLO DEMO: asigna una foto de referencia (mapa curado por categoría) a los
// productos sin imagen propia, rotando entre las fotos de su categoría para dar
// variedad. Con fotos reales en imagen_url, o USAR_IMAGENES_REF=false, no corre.
function conImagenesRef(productos) {
  if (!USAR_IMAGENES_REF) return productos;
  const usadasPorCat = {};
  return productos.map((p) => {
    if (p.imagen_url) return p;
    const fotos = IMAGENES_REF[p.categoria_id];
    if (!fotos || fotos.length === 0) return p;
    const n = usadasPorCat[p.categoria_id] ?? 0;
    usadasPorCat[p.categoria_id] = n + 1;
    return { ...p, imagen_url: fotos[n % fotos.length] };
  });
}

// Solo categorías activas, ordenadas (lo que vería el público).
export async function getCategorias() {
  const data = categoriasMock
    .filter((c) => c.activa)
    .sort((a, b) => a.orden - b.orden);
  return demora(data);
}

// Productos para el catálogo público: incluye los no disponibles para poder
// mostrarlos como "agotado" (no se ocultan). Ordenados por categoría y orden.
export async function getProductos() {
  const ordenados = [...productosMock].sort((a, b) => a.orden - b.orden);
  return demora(conImagenesRef(ordenados));
}

// Ajustes del negocio (fila única).
export async function getAjustes() {
  return demora(ajustesMock);
}
