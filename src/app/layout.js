import { Geist, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { StructuredData } from "@/components/StructuredData";

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

export const metadata = {
  metadataBase: new URL("https://panaderia-lagloria.com"),
  title: "Panadería Argentina La Gloria — facturas, empanadas y parrilla · Alexandria, VA",
  description:
    "Panadería y pastelería argentina en Alexandria/Woodbridge, VA. Facturas, medialunas, alfajores, empanadas, milanesas, pizzas y parrilla los domingos. Armá tu pedido y lo coordinamos por WhatsApp.",
  keywords: [
    "panadería argentina", "facturas", "medialunas", "empanadas argentinas", "alfajores",
    "milanesas", "pizza argentina", "parrilla", "Alexandria VA", "Woodbridge VA",
    "comida argentina", "pastelería",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://panaderia-lagloria.com/",
    siteName: "Panadería Argentina La Gloria",
    title: "Panadería Argentina La Gloria — Alexandria/Woodbridge, VA",
    description: "Facturas, empanadas, milanesas, pizzas y parrilla argentina. Armá tu pedido por WhatsApp.",
    images: [{ url: "/logo.png", width: 389, height: 384, alt: "Panadería Argentina La Gloria" }],
  },
  twitter: {
    card: "summary",
    title: "Panadería Argentina La Gloria — Alexandria/Woodbridge, VA",
    description: "Facturas, empanadas, milanesas, pizzas y parrilla argentina. Pedí por WhatsApp.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
        <StructuredData />
      </body>
    </html>
  );
}
