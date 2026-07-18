import { MenuLaGloria } from "@/modules/catalogo/MenuLaGloria";
import { SeoPublic } from "@/components/SeoPublic";
import { metadataPublica } from "@/lib/seo/metadata";

export function generateMetadata() {
  return metadataPublica("/menu/");
}

// Propuesta B: "menú digital" fiel al menú impreso, con foco en el producto y
// animaciones fluidas. Reutiliza datos, carrito y flujo de WhatsApp de la app.
export default function MenuPage() {
  return (
    <>
      <MenuLaGloria />
      <SeoPublic />
    </>
  );
}
