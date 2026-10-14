// Paquetes y extras de Desarrollo Web a Medida. Montos en dólares (USD): el
// sitio puede mostrarlos en bolivianos con el tipo de cambio del panel. Los
// montos del desglose de cada paquete suman su precio, y los extras usan las
// mismas tarifas que los conceptos equivalentes de los paquetes (ej. chatbot =
// US$ 86 en ambos). Los campos `*_en` / `*En` son la traducción al inglés.

export const PAQUETES_DESARROLLO = [
  {
    nombre: "Página Web",
    nombre_en: "Website",
    tagline: "Tu negocio visible en Google con una página propia.",
    tagline_en: "Get your business found on Google with its own website.",
    precio: 71,
    mantenimiento_mensual: 9,
    features: [
      "Landing de 1 sección + 3 pestañas, adaptada a celular y PC",
      "Botón de WhatsApp y enlaces a tus redes sociales",
      "Formulario básico de reservas o contacto",
      "Dominio .com + hosting incluidos por 1 año",
      "Indexación en Google para aparecer en búsquedas",
    ],
    features_en: [
      "1-section landing page + 3 tabs, optimized for mobile and desktop",
      "WhatsApp button and links to your social media",
      "Basic booking or contact form",
      ".com domain + hosting included for 1 year",
      "Google indexing so you show up in searches",
    ],
    desglose: [
      {
        concepto: "Diseño y desarrollo",
        conceptoEn: "Design and development",
        monto: 43,
        motivo:
          "Diseño a medida de 1 sección + 3 pestañas con WhatsApp, formulario y redes, probado en celular y PC.",
        motivoEn:
          "Custom design of 1 section + 3 tabs with WhatsApp, form and social links, tested on mobile and desktop.",
      },
      {
        concepto: "Dominio .com (1er año)",
        conceptoEn: ".com domain (1st year)",
        monto: 17,
        motivo: "Registro anual del nombre de tu web (tunegocio.com). Se renueva cada año.",
        motivoEn: "Yearly registration of your website name (yourbusiness.com). Renewed every year.",
      },
      {
        concepto: "Hosting e indexación (1er año)",
        conceptoEn: "Hosting and indexing (1st year)",
        monto: 11,
        motivo: "Servidor donde vive tu página y alta en Google para que te encuentren.",
        motivoEn: "The server your site lives on, plus Google submission so people can find you.",
      },
    ],
    destacado: false,
    orden: 1,
  },
  {
    nombre: "Tienda Digital Automatizada",
    nombre_en: "Automated Online Store",
    tagline: "Vende en línea y controla pedidos e inventario desde un panel.",
    tagline_en: "Sell online and manage orders and inventory from a dashboard.",
    precio: 187,
    mantenimiento_mensual: 22,
    features: [
      "Todo lo del paquete Página Web",
      "Hasta 3 secciones + carrusel de ofertas editable",
      "Catálogo online con carga de hasta 30 productos",
      "Panel de pedidos e inventario",
      "Base de datos de tus clientes",
      "Dominio + hosting + indexación por 1 año",
      "Pagos en línea disponibles como extra",
    ],
    features_en: [
      "Everything in the Website package",
      "Up to 3 sections + editable offers carousel",
      "Online catalog with up to 30 products loaded",
      "Orders and inventory dashboard",
      "Customer database",
      "Domain + hosting + indexing for 1 year",
      "Online payments available as an extra",
    ],
    desglose: [
      {
        concepto: "Diseño de hasta 3 secciones + carrusel",
        conceptoEn: "Design of up to 3 sections + carousel",
        monto: 72,
        motivo:
          "Diseño de la tienda con un carrusel de ofertas que puedes editar tú mismo, WhatsApp, formulario y redes.",
        motivoEn:
          "Store design with an offers carousel you can edit yourself, WhatsApp, form and social links.",
      },
      {
        concepto: "Catálogo, inventario y pedidos",
        conceptoEn: "Catalog, inventory and orders",
        monto: 72,
        motivo:
          "Catálogo con hasta 30 productos cargados y un panel para controlar stock y gestionar pedidos.",
        motivoEn:
          "Catalog with up to 30 products loaded and a dashboard to track stock and manage orders.",
      },
      {
        concepto: "Base de datos de clientes",
        conceptoEn: "Customer database",
        monto: 14,
        motivo: "Registro de quién te compra para hacer seguimiento y enviar ofertas.",
        motivoEn: "A record of who buys from you, for follow-ups and offers.",
      },
      {
        concepto: "Dominio, hosting e indexación (1er año)",
        conceptoEn: "Domain, hosting and indexing (1st year)",
        monto: 29,
        motivo: "Nombre de tu web, servidor y alta en Google durante el primer año.",
        motivoEn: "Your website name, server and Google submission for the first year.",
      },
    ],
    destacado: true,
    orden: 2,
  },
  {
    nombre: "Sistema Integral",
    nombre_en: "All-in-One System",
    tagline: "Para negocios medianos que necesitan controlar inventario, ventas y equipo.",
    tagline_en: "For mid-sized businesses that need to manage inventory, sales and staff.",
    precio: 517,
    mantenimiento_mensual: 57,
    features: [
      "Sistema web a medida con inventario, pedidos y ventas",
      "Centro de control con ganancias y gráficas",
      "Usuarios con roles: administrador, colaboradores e inversores",
      "Chatbot conectado a tu base de datos",
      "Dominio, hosting y base de datos por 1 año",
      "Apps para el negocio y para empleados disponibles como extra",
    ],
    features_en: [
      "Custom web system with inventory, orders and sales",
      "Control center with profits and charts",
      "Role-based users: admin, staff and investors",
      "Chatbot connected to your database",
      "Domain, hosting and database for 1 year",
      "Business and staff apps available as extras",
    ],
    desglose: [
      {
        concepto: "Sistema web a medida",
        conceptoEn: "Custom web system",
        monto: 259,
        motivo:
          "Análisis de tu negocio, diseño y desarrollo de los módulos de inventario, pedidos y ventas.",
        motivoEn:
          "Analysis of your business, plus design and development of the inventory, orders and sales modules.",
      },
      {
        concepto: "Centro de control y gráficas",
        conceptoEn: "Control center and charts",
        monto: 72,
        motivo: "Reportes de ventas y ganancias para tomar decisiones con datos reales.",
        motivoEn: "Sales and profit reports to make decisions with real data.",
      },
      {
        concepto: "Usuarios y roles",
        conceptoEn: "Users and roles",
        monto: 57,
        motivo:
          "Inicio de sesión para administrador, colaboradores e inversores, cada uno con sus permisos.",
        motivoEn: "Logins for admin, staff and investors, each with their own permissions.",
      },
      {
        concepto: "Chatbot conectado a la base",
        conceptoEn: "Database-connected chatbot",
        monto: 86,
        motivo: "Responde consultas de clientes con datos reales de tu inventario y pedidos.",
        motivoEn: "Answers customer questions with real data from your inventory and orders.",
      },
      {
        concepto: "Dominio, hosting y base de datos (1er año)",
        conceptoEn: "Domain, hosting and database (1st year)",
        monto: 43,
        motivo:
          "Infraestructura del sistema durante el primer año; la base de datos necesita un servidor más robusto.",
        motivoEn:
          "System infrastructure for the first year; the database needs a more robust server.",
      },
    ],
    destacado: false,
    orden: 4,
  },
];

export const EXTRAS_DESARROLLO = [
  {
    nombre: "Sección o página adicional",
    nombre_en: "Extra section or page",
    motivo: "Diseño, maquetado y contenido de una sección más (unas 2 horas de trabajo).",
    motivo_en: "Design, layout and content for one more section (about 2 hours of work).",
    precio: 14,
    unidad: "c/u",
    unidad_en: "each",
    precio_desde: false,
  },
  {
    nombre: "Carga de productos al catálogo",
    nombre_en: "Catalog product upload",
    motivo:
      "Subir fotos, descripciones y precios a mano. La Tienda ya incluye los primeros 30 productos.",
    motivo_en:
      "Uploading photos, descriptions and prices by hand. The Store already includes the first 30 products.",
    precio: 14,
    unidad: "cada 50 productos",
    unidad_en: "per 50 products",
    precio_desde: false,
  },
  {
    nombre: "Pasarela de pago (QR o tarjeta)",
    nombre_en: "Payment gateway (QR or card)",
    motivo:
      "Integración con el banco o proveedor de pagos, pruebas de cobro y confirmación automática del pedido. Las comisiones del proveedor las paga el negocio.",
    motivo_en:
      "Integration with the bank or payment provider, test charges and automatic order confirmation. Provider fees are paid by the business.",
    precio: 57,
    unidad: null,
    unidad_en: null,
    precio_desde: false,
  },
  {
    nombre: "Chatbot con respuestas automáticas",
    nombre_en: "Chatbot with automatic replies",
    motivo:
      "Entrenamiento con la información de tu negocio y conexión con WhatsApp o la web. Ya viene incluido en el Sistema Integral.",
    motivo_en:
      "Trained on your business information and connected to WhatsApp or your website. Already included in the All-in-One System.",
    precio: 86,
    unidad: null,
    unidad_en: null,
    precio_desde: false,
  },
  {
    nombre: "Logo e identidad básica",
    nombre_en: "Logo and basic brand identity",
    motivo: "Logo, paleta de colores y tipografías: es trabajo de diseño gráfico aparte del desarrollo.",
    motivo_en: "Logo, color palette and typography: graphic design work separate from development.",
    precio: 36,
    unidad: null,
    unidad_en: null,
    precio_desde: false,
  },
  {
    nombre: "Correo corporativo",
    nombre_en: "Business email",
    motivo: "Configuración de correos @tunegocio usando el dominio de tu web.",
    motivo_en: "Setup of @yourbusiness email addresses using your website domain.",
    precio: 11,
    unidad: "por cuenta",
    unidad_en: "per account",
    precio_desde: false,
  },
  {
    nombre: "Sitio en dos idiomas",
    nombre_en: "Bilingual website",
    motivo: "Traducción y duplicado de cada sección y del contenido administrable.",
    motivo_en: "Translation and duplication of every section and of the editable content.",
    precio: 36,
    unidad: null,
    unidad_en: null,
    precio_desde: false,
  },
  {
    nombre: "Blog o noticias autoadministrable",
    nombre_en: "Self-managed blog or news",
    motivo: "Módulo para publicar artículos desde un panel; ayuda a posicionarte en Google.",
    motivo_en: "A module to publish articles from a dashboard; helps you rank on Google.",
    precio: 43,
    unidad: null,
    unidad_en: null,
    precio_desde: false,
  },
  {
    nombre: "App del negocio (Android)",
    nombre_en: "Business app (Android)",
    motivo:
      "Aplicación aparte de la web, con su publicación en Play Store. El precio final depende de las funciones.",
    motivo_en:
      "A standalone app separate from the website, published on the Play Store. The final price depends on the features.",
    precio: 359,
    unidad: null,
    unidad_en: null,
    precio_desde: true,
  },
  {
    nombre: "App de empleados",
    nombre_en: "Staff app",
    motivo:
      "Comandas digitales, control de cobros y mensajes para el personal. Depende de cuántos roles y funciones necesites.",
    motivo_en:
      "Digital orders, payment tracking and staff messaging. Depends on how many roles and features you need.",
    precio: 287,
    unidad: null,
    unidad_en: null,
    precio_desde: true,
  },
  {
    nombre: "Cambios fuera del alcance",
    nombre_en: "Out-of-scope changes",
    motivo: "Ajustes pedidos después de la entrega que no estaban en el acuerdo inicial.",
    motivo_en: "Adjustments requested after delivery that weren't part of the original agreement.",
    precio: 7,
    unidad: "por hora",
    unidad_en: "per hour",
    precio_desde: false,
  },
];
