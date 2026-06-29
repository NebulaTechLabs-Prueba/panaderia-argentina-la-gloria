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

export const metadata = {
  title: "Panadería Argentina La Gloria",
  description:
    "Catálogo de panadería y pastelería argentina. Armá tu pedido y coordinamos por WhatsApp.",
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
