// Paquetes y extras de Desarrollo Web a Medida. Los montos del desglose de cada
// paquete suman su precio, y los extras usan las mismas tarifas que los
// conceptos equivalentes de los paquetes (ej. chatbot = Bs 600 en ambos).

export const PAQUETES_DESARROLLO = [
  {
    nombre: "Página Web",
    tagline: "Tu negocio visible en Google con una página propia.",
    precio: 500,
    mantenimiento_mensual: 60,
    features: [
      "Landing de 1 sección + 3 pestañas, adaptada a celular y PC",
      "Botón de WhatsApp y enlaces a tus redes sociales",
      "Formulario básico de reservas o contacto",
      "Dominio .com + hosting incluidos por 1 año",
      "Indexación en Google para aparecer en búsquedas",
    ],
    desglose: [
      {
        concepto: "Diseño y desarrollo",
        monto: 300,
        motivo:
          "Diseño a medida de 1 sección + 3 pestañas con WhatsApp, formulario y redes, probado en celular y PC.",
      },
      {
        concepto: "Dominio .com (1er año)",
        monto: 120,
        motivo: "Registro anual del nombre de tu web (tunegocio.com). Se renueva cada año.",
      },
      {
        concepto: "Hosting e indexación (1er año)",
        monto: 80,
        motivo: "Servidor donde vive tu página y alta en Google para que te encuentren.",
      },
    ],
    destacado: false,
    orden: 1,
  },
  {
    nombre: "Tienda Digital Automatizada",
    tagline: "Vende en línea y controla pedidos e inventario desde un panel.",
    precio: 1300,
    mantenimiento_mensual: 150,
    features: [
      "Todo lo del paquete Página Web",
      "Hasta 3 secciones + carrusel de ofertas editable",
      "Catálogo online con carga de hasta 30 productos",
      "Panel de pedidos e inventario",
      "Base de datos de tus clientes",
      "Dominio + hosting + indexación por 1 año",
      "Pagos en línea disponibles como extra",
    ],
    desglose: [
      {
        concepto: "Diseño de hasta 3 secciones + carrusel",
        monto: 500,
        motivo:
          "Diseño de la tienda con un carrusel de ofertas que puedes editar tú mismo, WhatsApp, formulario y redes.",
      },
      {
        concepto: "Catálogo, inventario y pedidos",
        monto: 500,
        motivo:
          "Catálogo con hasta 30 productos cargados y un panel para controlar stock y gestionar pedidos.",
      },
      {
        concepto: "Base de datos de clientes",
        monto: 100,
        motivo: "Registro de quién te compra para hacer seguimiento y enviar ofertas.",
      },
      {
        concepto: "Dominio, hosting e indexación (1er año)",
        monto: 200,
        motivo: "Nombre de tu web, servidor y alta en Google durante el primer año.",
      },
    ],
    destacado: true,
    orden: 2,
  },
  {
    nombre: "Sistema Integral",
    tagline: "Para negocios medianos que necesitan controlar inventario, ventas y equipo.",
    precio: 3600,
    mantenimiento_mensual: 400,
    features: [
      "Sistema web a medida con inventario, pedidos y ventas",
      "Centro de control con ganancias y gráficas",
      "Usuarios con roles: administrador, colaboradores e inversores",
      "Chatbot conectado a tu base de datos",
      "Dominio, hosting y base de datos por 1 año",
      "Apps para el negocio y para empleados disponibles como extra",
    ],
    desglose: [
      {
        concepto: "Sistema web a medida",
        monto: 1800,
        motivo:
          "Análisis de tu negocio, diseño y desarrollo de los módulos de inventario, pedidos y ventas.",
      },
      {
        concepto: "Centro de control y gráficas",
        monto: 500,
        motivo: "Reportes de ventas y ganancias para tomar decisiones con datos reales.",
      },
      {
        concepto: "Usuarios y roles",
        monto: 400,
        motivo:
          "Inicio de sesión para administrador, colaboradores e inversores, cada uno con sus permisos.",
      },
      {
        concepto: "Chatbot conectado a la base",
        monto: 600,
        motivo: "Responde consultas de clientes con datos reales de tu inventario y pedidos.",
      },
      {
        concepto: "Dominio, hosting y base de datos (1er año)",
        monto: 300,
        motivo:
          "Infraestructura del sistema durante el primer año; la base de datos necesita un servidor más robusto.",
      },
    ],
    destacado: false,
    orden: 4,
  },
];

export const EXTRAS_DESARROLLO = [
  {
    nombre: "Sección o página adicional",
    motivo: "Diseño, maquetado y contenido de una sección más (unas 2 horas de trabajo).",
    precio: 100,
    unidad: "c/u",
    precio_desde: false,
  },
  {
    nombre: "Carga de productos al catálogo",
    motivo:
      "Subir fotos, descripciones y precios a mano. La Tienda ya incluye los primeros 30 productos.",
    precio: 100,
    unidad: "cada 50 productos",
    precio_desde: false,
  },
  {
    nombre: "Pasarela de pago (QR o tarjeta)",
    motivo:
      "Integración con el banco o proveedor de pagos, pruebas de cobro y confirmación automática del pedido. Las comisiones del proveedor las paga el negocio.",
    precio: 400,
    unidad: null,
    precio_desde: false,
  },
  {
    nombre: "Chatbot con respuestas automáticas",
    motivo:
      "Entrenamiento con la información de tu negocio y conexión con WhatsApp o la web. Ya viene incluido en el Sistema Integral.",
    precio: 600,
    unidad: null,
    precio_desde: false,
  },
  {
    nombre: "Logo e identidad básica",
    motivo: "Logo, paleta de colores y tipografías: es trabajo de diseño gráfico aparte del desarrollo.",
    precio: 250,
    unidad: null,
    precio_desde: false,
  },
  {
    nombre: "Correo corporativo",
    motivo: "Configuración de correos @tunegocio usando el dominio de tu web.",
    precio: 80,
    unidad: "por cuenta",
    precio_desde: false,
  },
  {
    nombre: "Sitio en dos idiomas",
    motivo: "Traducción y duplicado de cada sección y del contenido administrable.",
    precio: 250,
    unidad: null,
    precio_desde: false,
  },
  {
    nombre: "Blog o noticias autoadministrable",
    motivo: "Módulo para publicar artículos desde un panel; ayuda a posicionarte en Google.",
    precio: 300,
    unidad: null,
    precio_desde: false,
  },
  {
    nombre: "App del negocio (Android)",
    motivo:
      "Aplicación aparte de la web, con su publicación en Play Store. El precio final depende de las funciones.",
    precio: 2500,
    unidad: null,
    precio_desde: true,
  },
  {
    nombre: "App de empleados",
    motivo:
      "Comandas digitales, control de cobros y mensajes para el personal. Depende de cuántos roles y funciones necesites.",
    precio: 2000,
    unidad: null,
    precio_desde: true,
  },
  {
    nombre: "Cambios fuera del alcance",
    motivo: "Ajustes pedidos después de la entrega que no estaban en el acuerdo inicial.",
    precio: 50,
    unidad: "por hora",
    precio_desde: false,
  },
];
