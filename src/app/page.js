import { MenuLaGloria } from "@/modules/catalogo/MenuLaGloria";

// El cliente eligió la propuesta B. La raíz pública ("/") ahora sirve el menú (B).
// Las otras propuestas quedan solo por URL directa hasta confirmar su eliminación.
export default function Page() {
  return <MenuLaGloria />;
}
