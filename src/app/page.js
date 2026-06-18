import { HomeCatalogo } from "@/modules/catalogo/HomeCatalogo";

// Home = catálogo público. El componente cliente trae los datos (mock hoy,
// Supabase en el navegador después) y maneja carrito, modal y WhatsApp.
export default function Page() {
  return <HomeCatalogo />;
}
