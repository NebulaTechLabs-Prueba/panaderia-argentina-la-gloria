# Panel de gestión (admin) — estado y consideraciones

Panel orientado al equipo de marketing: tráfico, conversiones, SEO, catálogo y equipo.

## Estado actual
- **Todo SIMULADO.** No hay backend ni analítica real conectada.
- Vive como ruta **`/admin`** dentro del mismo proyecto estático (GitHub Pages). A futuro se moverá a un **subdominio** (`admin.` o `gestion.`) cuando haya dominio propio.
- El nav de propuestas (A/B/C) y los sonidos de click se **ocultan/silencian** en `/admin`.
- Código: `src/modules/admin/` (`AdminPanel.jsx`, `widgets.jsx`, `mock.js`). Los datos de `mock.js` tienen la **misma forma** que tendrán las consultas reales, así el salto a datos reales es un reemplazo, no una reescritura.

## Arquitectura objetivo (cuando haya backend)
```
Sitio público (estático)  ──emite eventos──►  GA4 (tráfico)
                          ──emite eventos──►  Supabase (embudo del negocio)
Search Console  ──API──►  Panel  ◄──lee──  Supabase
```
El panel **solo lee y muestra**. No mueve Vercel: puede correr estático (lectura vía API del cliente) o migrarse a un host con servidor si se necesita proteger claves.

## Herramientas — consideraciones
| Herramienta | Para qué | Consideración |
|---|---|---|
| **Google Analytics 4** | Tráfico general: visitas, fuentes, dispositivos, geo. | Script en el sitio público. Gratis y completo, pero usa cookies → conviene aviso de consentimiento. |
| **Eventos propios (Supabase)** | Embudo del negocio: ver producto → carrito → **WhatsApp**. | Es EL valor: ninguna herramienta genérica mide bien el click a WhatsApp. Tabla de eventos + agregación. |
| **Google Search Console** | SEO: keywords, impresiones, clics, posición. | Requiere verificar el dominio (falta dominio). Su API alimenta la sección SEO. |
| **WhatsApp Business** | Destino de los pedidos. | Hoy es link `wa.me`. La API de WhatsApp Business daría métricas de respuesta (opcional, con costo). |

## Modelo de eventos propios (borrador)
Tabla `eventos`: `id`, `tipo` (`ver_producto` | `add_carrito` | `enviar_whatsapp`), `producto_id?`, `sesion_id`, `fuente?` (utm/referrer), `dispositivo`, `creado_en`.
Con eso se arman: embudo, top productos, conversiones por producto y tasa de conversión.

## Conversión clave
El negocio no tiene checkout: **la conversión es el click en “Enviar pedido por WhatsApp”.** Todos los tableros deben orientarse a ese evento.

## Próximos pasos sugeridos
1. Aprobar el diseño visual del panel (esta entrega).
2. Definir dominio → subdominio del panel.
3. Crear proyecto Supabase + tabla de eventos + auth del equipo.
4. Instrumentar el sitio público (GA4 + eventos propios).
5. Reemplazar `mock.js` por consultas reales.
