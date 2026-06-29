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
import { IDS_CON_FOTO } from "./imagenesLocales";
import { asset } from "@/lib/config/constants";

// Pequeño delay para simular red y poder probar estados de carga/skeletons.
const SIMULAR_LATENCIA_MS = 250;
const demora = (valor) =>
  new Promise((resolve) => setTimeout(() => resolve(valor), SIMULAR_LATENCIA_MS));

// Asigna la FOTO REAL (local, en /public/productos/p-<id>.jpg) a los productos
// que ya la tienen. Los demás quedan con imagen_url null → la UI muestra el
// placeholder de marca con "Próximamente". Respeta una imagen_url ya cargada.
function conImagenesLocales(productos) {
  return productos.map((p) => {
    if (p.imagen_url) return p;
    if (IDS_CON_FOTO.has(p.id)) return { ...p, imagen_url: asset(`/productos/${p.id}.jpg`) };
    return p;
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
  return demora(conImagenesLocales(ordenados));
}

// Ajustes del negocio (fila única). Prefija las rutas de imágenes locales
// (logo/portada) con el basePath para que carguen en GitHub Pages.
export async function getAjustes() {
  const ajustes = {
    ...ajustesMock,
    logo_url: ajustesMock.logo_url ? asset(ajustesMock.logo_url) : null,
    portada_url: ajustesMock.portada_url ? asset(ajustesMock.portada_url) : null,
  };
  return demora(ajustes);
}
