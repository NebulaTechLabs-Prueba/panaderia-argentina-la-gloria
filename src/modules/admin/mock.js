// Datos SIMULADOS del panel de gestión. Nada de esto es real todavía: cuando se
// conecte GA4 + eventos propios (Supabase), estos objetos se reemplazan por las
// consultas reales manteniendo la misma forma.

export const RANGOS = ["7 días", "30 días", "90 días"];

export const kpis = [
  { id: "visitas", label: "Visitas", value: "1.240", delta: 12.4, spark: [8, 10, 9, 12, 11, 14, 13, 16, 15, 18, 17, 20] },
  { id: "unicos", label: "Visitantes únicos", value: "892", delta: 8.1, spark: [6, 7, 7, 8, 9, 8, 10, 9, 11, 10, 12, 13] },
  { id: "whatsapp", label: "Pedidos por WhatsApp", value: "76", delta: 15.2, spark: [2, 3, 2, 4, 3, 5, 4, 6, 5, 6, 7, 8] },
  { id: "conv", label: "Tasa de conversión", value: "6,1%", delta: 2.3, spark: [4.8, 5.1, 5.0, 5.4, 5.3, 5.6, 5.5, 5.8, 5.9, 6.0, 6.0, 6.1] },
];

// 30 días de visitas (para el gráfico de línea principal).
export const serieVisitas = [
  28, 34, 30, 41, 38, 52, 60, 44, 39, 47, 55, 63, 58, 49, 42, 51, 66, 72,
  61, 54, 48, 57, 69, 78, 71, 63, 59, 68, 82, 88,
];

// Mismo tramo del PERÍODO ANTERIOR (para comparar). ~18% menos → muestra crecimiento.
export const serieVisitasPrev = serieVisitas.map((v) => Math.round(v * 0.82));

export const fuentes = [
  { label: "Instagram", valor: 42, color: "#E1306C" },
  { label: "Directo", valor: 24, color: "#2f3a7e" },
  { label: "TikTok", valor: 16, color: "#111111" },
  { label: "Google", valor: 10, color: "#ff9900" },
  { label: "Facebook", valor: 8, color: "#1877F2" },
];

export const topProductos = [
  { label: "Milanesa Napolitana", valor: 214 },
  { label: "Facturas", valor: 188 },
  { label: "Pastafrola", valor: 141 },
  { label: "Empanadas de carne", valor: 133 },
  { label: "Choripán", valor: 118 },
  { label: "Alfajores de maicena", valor: 96 },
];

export const embudo = [
  { label: "Vieron un producto", valor: 1240 },
  { label: "Agregaron al carrito", valor: 214 },
  { label: "Enviaron por WhatsApp", valor: 76 },
];

export const dispositivos = [
  { label: "Móvil", valor: 78, color: "#ff9900" },
  { label: "Escritorio", valor: 19, color: "#2f3a7e" },
  { label: "Tablet", valor: 3, color: "#63b0dd" },
];

export const ciudades = [
  { label: "Woodbridge, VA", valor: 512 },
  { label: "Manassas, VA", valor: 143 },
  { label: "Dale City, VA", valor: 98 },
  { label: "Washington, DC", valor: 76 },
  { label: "Otras", valor: 63 },
];

export const conversionesPorProducto = [
  { label: "Parrilla Libre (Domingo)", valor: 22 },
  { label: "Milanesa Napolitana", valor: 15 },
  { label: "Lechón al asador", valor: 11 },
  { label: "Facturas (docena)", valor: 9 },
  { label: "Pastafrola grande", valor: 7 },
];

export const seoKpis = [
  { id: "imp", label: "Impresiones", value: "18.4k", delta: 9.8 },
  { id: "clics", label: "Clics", value: "1.320", delta: 14.1 },
  { id: "ctr", label: "CTR medio", value: "7,2%", delta: 1.1 },
  { id: "pos", label: "Posición media", value: "6,3", delta: 4.2 },
];

export const keywords = [
  { q: "panadería argentina woodbridge", imp: 2140, clics: 268, ctr: "12,5%", pos: 2.1 },
  { q: "facturas woodbridge va", imp: 1610, clics: 190, ctr: "11,8%", pos: 2.8 },
  { q: "empanadas argentinas cerca", imp: 1290, clics: 121, ctr: "9,4%", pos: 4.5 },
  { q: "milanesa napolitana delivery", imp: 980, clics: 74, ctr: "7,6%", pos: 5.9 },
  { q: "asado argentino woodbridge", imp: 870, clics: 66, ctr: "7,6%", pos: 6.2 },
  { q: "alfajores caseros virginia", imp: 640, clics: 38, ctr: "5,9%", pos: 8.1 },
];

export const seoChecklist = [
  { label: "Títulos y meta descripciones", estado: "ok" },
  { label: "Datos estructurados (Local Business)", estado: "ok" },
  { label: "Sitemap.xml enviado a Search Console", estado: "pendiente" },
  { label: "Perfil de Google Business vinculado", estado: "pendiente" },
  { label: "Velocidad (Core Web Vitals)", estado: "alerta" },
  { label: "Versión móvil optimizada", estado: "ok" },
];

export const equipo = [
  { nombre: "Coordinación Marketing", rol: "Administrador", inicial: "M", color: "#2f3a7e" },
  { nombre: "Community Manager", rol: "Editor", inicial: "C", color: "#ff9900" },
  { nombre: "Analista SEO", rol: "Analista", inicial: "S", color: "#63b0dd" },
  { nombre: "La Gloria (dueños)", rol: "Solo lectura", inicial: "G", color: "#16a34a" },
];

// Métricas de calidad de visita (para explicar "tiempo en página" y "rebote").
export const traficoKpis = [
  { id: "sesiones", label: "Sesiones", value: "1.240", delta: 12.4 },
  { id: "tiempo", label: "Tiempo promedio", value: "1m 48s", delta: 6.0 },
  { id: "rebote", label: "Tasa de rebote", value: "38%", delta: -4.2 },
  { id: "pxs", label: "Páginas por sesión", value: "3,4", delta: 2.1 },
];

export const nuevosRecurrentes = [
  { label: "Nuevos", valor: 62, color: "#ff9900" },
  { label: "Recurrentes", valor: 38, color: "#2f3a7e" },
];

// Productos que se ven en la misma visita (afinidad → combos / cross-sell).
export const vistosJuntos = [
  { a: "Milanesa Napolitana", b: "Choripán", veces: 64 },
  { a: "Facturas", b: "Alfajores de maicena", veces: 52 },
  { a: "Empanadas de carne", b: "Empanadas de J y Q", veces: 47 },
  { a: "Parrilla Libre", b: "Lechón al asador", veces: 33 },
  { a: "Pastafrola", b: "Pan francés", veces: 26 },
];

// ── Comportamiento del consumidor (todo simulado) ──

export const consumidorKpis = [
  { id: "ticket", label: "Ticket promedio", value: "$28,40", delta: 4.7 },
  { id: "persona", label: "Gasto por persona", value: "$9,16", delta: 2.1 },
  { id: "abandono", label: "Carritos sin enviar", value: "64,5%", delta: -3.4 },
  { id: "maxpers", label: "Orden más grande", value: "12 pers.", delta: 0 },
];

// Carritos armados vs. pedidos enviados por WhatsApp (abandono de carrito).
export const abandono = { armaron: 214, enviaron: 76 };

export const masAgregado = [
  { label: "Milanesa Napolitana", valor: 168 },
  { label: "Empanadas de carne", valor: 152 },
  { label: "Facturas (docena)", valor: 139 },
  { label: "Choripán", valor: 96 },
  { label: "Pastafrola", valor: 71 },
];

export const menosVendido = [
  { label: "Torta de cumpleaños", valor: 6 },
  { label: "Tarta de verdura", valor: 9 },
  { label: "Milhojas", valor: 12 },
];

// Ingresos estimados por producto (precio × cantidad de los pedidos). Estimado:
// el pedido es una intención, la venta real ocurre en el local.
export const ingresosPorProducto = [
  { label: "Parrilla Libre (Dom)", valor: 1240 },
  { label: "Lechón al asador", valor: 880 },
  { label: "Milanesa Napolitana", valor: 610 },
  { label: "Torta de cumpleaños", valor: 430 },
  { label: "Facturas (docena)", valor: 360 },
];

// Producto que se pide en mayor CANTIDAD por pedido (unidades promedio).
export const cantidadPorPedido = [
  { label: "Facturas (unidad)", valor: 14 },
  { label: "Empanadas", valor: 12 },
  { label: "Alfajores", valor: 8 },
  { label: "Pan francés", valor: 4 },
];

// Tamaño de las órdenes (por total / comensales).
export const tamanoOrdenes = [
  { label: "Pequeñas (1–2 ítems)", valor: 44, color: "#63b0dd" },
  { label: "Medianas (3–4)", valor: 25, color: "#2f3a7e" },
  { label: "Grandes (5+ o grupo)", valor: 9, color: "#ff9900" },
];

// Interacción por día de la semana y por mes (visitas promedio).
export const porDiaSemana = [
  { label: "Lun", valor: 120 },
  { label: "Mar", valor: 108 },
  { label: "Mié", valor: 118 },
  { label: "Jue", valor: 136 },
  { label: "Vie", valor: 182 },
  { label: "Sáb", valor: 224 },
  { label: "Dom", valor: 261 },
];

export const porMes = [
  { label: "Ene", valor: 62 }, { label: "Feb", valor: 58 }, { label: "Mar", valor: 71 },
  { label: "Abr", valor: 76 }, { label: "May", valor: 92 }, { label: "Jun", valor: 96 },
  { label: "Jul", valor: 131 }, { label: "Ago", valor: 101 }, { label: "Sep", valor: 93 },
  { label: "Oct", valor: 99 }, { label: "Nov", valor: 121 }, { label: "Dic", valor: 168 },
];

export const diaPico = "Domingo 6 de diciembre";

// Producto más visto y período con más pedidos, según granularidad.
export const masVistoPeriodo = {
  Día: { valor: "Milanesa Napolitana", detalle: "hoy · 38 vistas" },
  Semana: { valor: "Facturas", detalle: "esta semana · 188 vistas" },
  Mes: { valor: "Empanadas de carne", detalle: "este mes · 512 vistas" },
};
export const pedidosPeriodo = {
  Día: { valor: "Domingo", detalle: "18 pedidos" },
  Semana: { valor: "1–7 dic", detalle: "62 pedidos" },
  Mes: { valor: "Diciembre", detalle: "168 pedidos" },
};
export const GRANOS = ["Día", "Semana", "Mes"];

// Interacción por hora del día (picos de mediodía y noche).
export const porHora = [
  { label: "6h", valor: 8 }, { label: "8h", valor: 24 }, { label: "10h", valor: 41 },
  { label: "12h", valor: 88 }, { label: "14h", valor: 63 }, { label: "16h", valor: 52 },
  { label: "18h", valor: 97 }, { label: "20h", valor: 121 }, { label: "22h", valor: 68 },
];

// Calendario de fechas clave: feriados 🇦🇷 (comunidad) y 🇺🇸 (local Woodbridge, VA)
// que pueden mover la demanda. Simulado / curado, no viene de una API todavía.
export const feriados = [
  { fecha: "1 Ene", nombre: "Año Nuevo", pais: "🇺🇸🇦🇷", impacto: "alto", nota: "Roscas y mesa dulce de fin de año." },
  { fecha: "25 May", nombre: "Revolución de Mayo", pais: "🇦🇷", impacto: "medio", nota: "Empanadas, locro y pastelitos." },
  { fecha: "25 May", nombre: "Memorial Day", pais: "🇺🇸", impacto: "medio", nota: "Fin de semana largo → asados." },
  { fecha: "4 Jul", nombre: "Independence Day", pais: "🇺🇸", impacto: "alto", nota: "Parrilla y reuniones." },
  { fecha: "9 Jul", nombre: "Día de la Independencia", pais: "🇦🇷", impacto: "alto", nota: "Locro, empanadas, pastelitos." },
  { fecha: "20 Jul", nombre: "Día del Amigo", pais: "🇦🇷", impacto: "medio", nota: "Muchas reuniones → pedidos grupales." },
  { fecha: "7 Sep", nombre: "Labor Day", pais: "🇺🇸", impacto: "medio", nota: "Fin de semana largo → asados." },
  { fecha: "26 Nov", nombre: "Thanksgiving", pais: "🇺🇸", impacto: "medio", nota: "Postres y encargos." },
  { fecha: "25 Dic", nombre: "Navidad", pais: "🇺🇸🇦🇷", impacto: "alto", nota: "Pan dulce y mesa dulce." },
  { fecha: "31 Dic", nombre: "Fin de Año", pais: "🇺🇸🇦🇷", impacto: "alto", nota: "Pico anual de pedidos." },
];

export const herramientas = [
  {
    nombre: "Google Analytics 4",
    para: "Tráfico general: visitas, fuentes, dispositivos, geo.",
    estado: "Sin conectar",
    campo: "Measurement ID",
    placeholder: "G-XXXXXXXXXX",
    nota: "Se agrega el script en el sitio público. Los eventos de e-commerce simple (ver producto) también pueden ir acá.",
  },
  {
    nombre: "Eventos propios (Supabase)",
    para: "El embudo del negocio: ver producto → carrito → WhatsApp.",
    estado: "Sin backend",
    campo: "URL del proyecto",
    placeholder: "https://xxxx.supabase.co",
    nota: "Es lo que ninguna herramienta genérica mide bien. Guarda cada evento en una tabla y el panel lo agrega.",
  },
  {
    nombre: "Google Search Console",
    para: "SEO: keywords, impresiones, clics y posición.",
    estado: "Sin conectar",
    campo: "Propiedad verificada",
    placeholder: "sc-domain:tudominio.com",
    nota: "Requiere verificar el dominio. Su API alimenta la sección de SEO.",
  },
  {
    nombre: "WhatsApp Business",
    para: "Destino de los pedidos (ya integrado en el sitio).",
    estado: "Activo (link)",
    campo: "Número",
    placeholder: "+1 571 580 4516",
    nota: "Hoy es un link wa.me. A futuro, la API de WhatsApp Business daría métricas de respuesta.",
  },
];
