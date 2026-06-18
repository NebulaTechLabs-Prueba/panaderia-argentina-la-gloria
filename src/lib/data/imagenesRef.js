// ⚠ SOLO DEMO: fotos de REFERENCIA (Unsplash) por categoría, mientras no haya
// fotos reales de los productos de La Gloria. Curadas a mano y verificadas (200).
// Son ilustrativas del tipo de producto, NO los platos reales del local.
// Reemplazar cargando `imagen_url` real en cada producto (o USAR_IMAGENES_REF=false).
const P = "?w=600&h=450&fit=crop&auto=format&q=70";
const u = (id) => `https://images.unsplash.com/photo-${id}${P}`;

export const IMAGENES_REF = {
  "cat-cafeteria": [u("1511920170033-f8396924c348"), u("1497515114629-f71d768fd07c"), u("1506619216599-9d16d0903dfd")],
  "cat-bebidas": [u("1581636625402-29b2a704ef13"), u("1629186235045-80d4147d90dc"), u("1605712916345-6ef6bcc2e29c")],
  "cat-milanesas": [u("1682970078535-cd0cf994ee96"), u("1599921841143-819065a55cc6"), u("1665056511905-1ca20935db27")],
  "cat-pasteleria": [u("1623334044303-241021148842"), u("1555507036-ab1f4038808a"), u("1691480162735-9b91238080f6")],
  "cat-pastas": [u("1611270629569-8b357cb88da9"), u("1546549032-9571cd6b27df"), u("1608897013039-887f21d8c804")],
  "cat-pizzas": [u("1571066811602-716837d681de"), u("1598023696416-0193a0bcd302"), u("1579751626657-72bc17010498")],
  "cat-empanadas": [u("1548228586-171fb0887ac0"), u("1624128082323-beb6b8b508db"), u("1608039783021-6116a558f0c5")],
  "cat-parrilla": [u("1508615263227-c5d58c1e5821"), u("1558030137-a56c1b004fa3"), u("1504564321107-4aa3efddb5bd")],
};
