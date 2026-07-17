// Google Analytics 4. Dormido hasta que haya un Measurement ID cargado en
// Ajustes → Integraciones (business_settings.ga_measurement_id). Server
// component: si no hay ID, no renderiza nada.
import Script from "next/script";
import { getSettingsServer } from "@/lib/seo/settings";

export async function Analytics() {
  const s = await getSettingsServer();
  const ga = s?.ga_measurement_id?.trim();
  if (!ga || !/^G-[A-Z0-9]+$/i.test(ga)) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga}');`}
      </Script>
    </>
  );
}
