import { Geist, Fraunces } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Sans para el cuerpo; serif display (Fraunces) para títulos: aire artesanal.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700"],
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
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
