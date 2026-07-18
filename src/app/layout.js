import { Geist, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Tipografía del manual de marca: Poppins para títulos, sans para el cuerpo.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

// Metadata por defecto (estática). El SEO completo (OG/keywords/verificación) y la
// analítica viven en las páginas públicas vía `metadataPublica` + `<SeoPublic/>`,
// para no meter un fetch en el layout compartido con el admin.
export const metadata = {
  metadataBase: new URL("https://panaderia-lagloria.com"),
  title: "Panadería Argentina La Gloria",
  description: "Panadería y pastelería argentina en Alexandria/Woodbridge, VA.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
