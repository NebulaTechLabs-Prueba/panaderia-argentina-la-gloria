import { StructuredData } from "./StructuredData";
import { MetaPixel } from "./MetaPixel";

// SEO/píxeles de las páginas PÚBLICAS. Se renderiza solo en "/" y "/menu",
// NO en el layout raíz — así el admin (que comparte layout) sigue siendo estático
// y no queda expuesto al skew de caché/ISR.
export function SeoPublic() {
  return (
    <>
      <StructuredData />
      <MetaPixel />
    </>
  );
}
