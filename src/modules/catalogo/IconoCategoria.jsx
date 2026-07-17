"use client";

import {
  Coffee, CupSoda, Sandwich, Croissant, Utensils, Pizza, Flame,
  Cake, CakeSlice, Cookie, Beef, Drumstick, Salad, Soup, IceCreamCone,
  Wine, Beer, Candy, Egg, Fish, Milk, GlassWater, Ham, Apple, Cherry,
  Donut, Popcorn, Wheat, ChefHat, CookingPot,
} from "lucide-react";

// Empanada y parrilla no existen en lucide → SVG propios (línea, mismo estilo).
function Empanada({ className, strokeWidth = 1.6 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 14c0-5 3.6-8 8-8s8 3 8 8c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2Z" />
      <path d="M6 16c1-.8 2-.8 3 0s2 .8 3 0 2-.8 3 0 2 .8 3 0" />
      <path d="M9 10.5l.8 1.4M12 9.8l.8 1.4M15 10.5l.8 1.4" />
    </svg>
  );
}

function Parrilla({ className, strokeWidth = 1.6 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3c1.5 2.5 3 4 3 6a3 3 0 1 1-6 0c0-1 .5-1.8 1-2.5" />
      <path d="M4 17h16M6 20h12M5 17l1 3M19 17l-1 3M12 17v3" />
    </svg>
  );
}

const REGISTRO = {
  // Base
  cafe: Coffee,
  bebida: CupSoda,
  sandwich: Sandwich,
  factura: Croissant,
  pasta: Utensils,
  pizza: Pizza,
  empanada: Empanada,
  parrilla: Parrilla,
  asado: Flame,
  // Panadería / pastelería
  pan: Wheat,
  torta: Cake,
  porcion: CakeSlice,
  galleta: Cookie,
  helado: IceCreamCone,
  dona: Donut,
  dulce: Candy,
  huevo: Egg,
  // Comidas
  carne: Beef,
  pollo: Drumstick,
  pescado: Fish,
  jamon: Ham,
  ensalada: Salad,
  sopa: Soup,
  olla: CookingPot,
  chef: ChefHat,
  // Bebidas / otros
  vino: Wine,
  cerveza: Beer,
  leche: Milk,
  agua: GlassWater,
  fruta: Apple,
  cereza: Cherry,
  pochoclo: Popcorn,
};

// Lista de claves disponibles (para el selector del admin).
export const ICONOS_CATEGORIA = Object.keys(REGISTRO);

// Devuelve el ícono de línea de una categoría (fallback: Croissant).
export function IconoCategoria({ icono, className }) {
  const Icono = REGISTRO[icono] ?? Croissant;
  return <Icono className={className} />;
}
