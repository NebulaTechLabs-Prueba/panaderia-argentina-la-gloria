// Píxel de Meta (Facebook / Instagram). Dormido hasta que haya un ID cargado en
// el panel → Campañas (business_settings.meta_pixel_id). Server component: si no
// hay ID, no renderiza nada. Los eventos se ven en el Administrador de Eventos de Meta.
import Script from "next/script";
import { getSettingsServer } from "@/lib/seo/settings";

export async function MetaPixel() {
  const s = await getSettingsServer();
  const id = s?.meta_pixel_id?.trim();
  if (!id || !/^\d{5,}$/.test(id)) return null;
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`} />
      </noscript>
    </>
  );
}
