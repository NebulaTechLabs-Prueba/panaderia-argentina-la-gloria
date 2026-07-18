import { MenuLaGloria } from "@/modules/catalogo/MenuLaGloria";
import { SeoPublic } from "@/components/SeoPublic";
import { metadataPublica } from "@/lib/seo/metadata";

export function generateMetadata() {
  return metadataPublica("/");
}

// El cliente eligió la propuesta B. La raíz pública ("/") sirve el menú (B).
export default function Page() {
  return (
    <>
      <MenuLaGloria />
      <SeoPublic />
    </>
  );
}
