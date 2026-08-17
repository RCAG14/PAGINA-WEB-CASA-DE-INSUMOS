import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL no está configurada.");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

const CLASIFICACIONES = [
  { slug: "electronica", nombre: "Electrónica y Tecnología", descripcion: "Retornos de dispositivos, audio y accesorios tecnológicos", icono: "electronica" },
  { slug: "joyeria", nombre: "Joyería y Accesorios", descripcion: "Retornos de joyería, bisutería y relojería", icono: "joyeria" },
  { slug: "hogar", nombre: "Hogar y Cocina", descripcion: "Retornos de electrodomésticos y artículos para el hogar", icono: "hogar" },
  { slug: "moda", nombre: "Moda y Calzado", descripcion: "Retornos de indumentaria, calzado y marroquinería", icono: "moda" },
  { slug: "herramientas", nombre: "Herramientas y Ferretería", descripcion: "Retornos de herramientas manuales y eléctricas", icono: "herramientas" },
  { slug: "belleza", nombre: "Belleza y Cuidado Personal", descripcion: "Retornos de cosmética, fragancias y cuidado personal", icono: "belleza" },
  { slug: "juguetes", nombre: "Juguetería y Ocio", descripcion: "Retornos de juguetes, juegos y artículos de entretenimiento", icono: "juguetes" },
  { slug: "mixto", nombre: "Lote Variado / Mixto", descripcion: "Retornos combinados de múltiples categorías en un mismo lote", icono: "mixto" },
] as const;

interface DetalleSeed {
  producto: string;
  precioReferencial: number;
  cantidad: number;
  condicion: string;
  costoAsignado: number;
  precioVentaSugerido: number;
}

interface CajaSeed {
  nombre: string;
  slug: string;
  skuLote: string;
  clasificacion: (typeof CLASIFICACIONES)[number]["slug"];
  tipoVenta: "listada" | "sorpresa";
  descripcionCorta: string;
  descripcionTecnica: string;
  manifiesto: string;
  origen: string;
  centroRetorno: string;
  certificacionAduanera: string;
  gradoLiquidacion: string;
  pesoBruto: string;
  dimensiones: string;
  precioVentaCaja: number;
  stockDisponible: number;
  destacada: boolean;
  rating: number;
  numResenas: number;
  detalle: DetalleSeed[];
  rangoSorpresa?: {
    cantidadMin: number;
    cantidadMax: number;
    valorMin: number;
    valorMax: number;
  };
}

const CAJAS: CajaSeed[] = [
  {
    nombre: "Caja de Retorno Listada — Electrónica Premium",
    slug: "caja-listada-electronica-premium",
    skuLote: "CDI-EL-014",
    clasificacion: "electronica",
    tipoVenta: "listada",
    descripcionCorta: "Manifiesto verificado de retornos de electrónica de consumo de alta rotación.",
    descripcionTecnica: "Lote con manifiesto documentado artículo por artículo, pensado para revendedores que necesitan certeza de contenido antes de comprar.",
    manifiesto: "MAN-EU-88213",
    origen: "Alemania, Reino Unido",
    centroRetorno: "Amazon FC Dortmund (DE)",
    certificacionAduanera: "Verificada — Cert. N.º ADU-22190",
    gradoLiquidacion: "Grado B — Devolución de cliente",
    pesoBruto: "18.4 kg",
    dimensiones: "50 x 40 x 35 cm",
    precioVentaCaja: 1310.0,
    stockDisponible: 14,
    destacada: true,
    rating: 4.6,
    numResenas: 212,
    detalle: [
      { producto: "Auriculares inalámbricos con cancelación de ruido", precioReferencial: 90, cantidad: 3, condicion: "Caja abierta, función no verificada", costoAsignado: 180, precioVentaSugerido: 270 },
      { producto: "Smartwatch deportivo", precioReferencial: 120, cantidad: 2, condicion: "Como nuevo", costoAsignado: 160, precioVentaSugerido: 240 },
      { producto: "Cargador rápido USB-C 65W", precioReferencial: 25, cantidad: 6, condicion: "Nuevo, embalaje reabierto", costoAsignado: 90, precioVentaSugerido: 150 },
      { producto: "Power bank 20.000 mAh", precioReferencial: 40, cantidad: 4, condicion: "Función no verificada", costoAsignado: 100, precioVentaSugerido: 160 },
      { producto: "Altavoz Bluetooth portátil", precioReferencial: 55, cantidad: 2, condicion: "Reacondicionado por el vendedor", costoAsignado: 60, precioVentaSugerido: 110 },
    ],
  },
  {
    nombre: "Caja de Retorno Listada — Joyería y Accesorios",
    slug: "caja-listada-joyeria-accesorios",
    skuLote: "CDI-JY-021",
    clasificacion: "joyeria",
    tipoVenta: "listada",
    descripcionCorta: "Manifiesto de retornos de joyería y bisutería de marca, una de las categorías con mayor margen de reventa.",
    descripcionTecnica: "Lote manifestado con piezas de joyería y relojería devueltas sin reclamo posterior.",
    manifiesto: "MAN-UK-51042",
    origen: "Reino Unido, España",
    centroRetorno: "Amazon FC Doncaster (UK)",
    certificacionAduanera: "Verificada — Cert. N.º ADU-30871",
    gradoLiquidacion: "Grado A/B — Devolución de cliente",
    pesoBruto: "3.1 kg",
    dimensiones: "30 x 24 x 16 cm",
    precioVentaCaja: 1010.0,
    stockDisponible: 9,
    destacada: true,
    rating: 4.8,
    numResenas: 167,
    detalle: [
      { producto: "Anillo chapado en oro 18k", precioReferencial: 60, cantidad: 4, condicion: "Nuevo, sin uso", costoAsignado: 120, precioVentaSugerido: 220 },
      { producto: "Collar de acero inoxidable con dije", precioReferencial: 35, cantidad: 6, condicion: "Nuevo", costoAsignado: 90, precioVentaSugerido: 170 },
      { producto: "Reloj de pulsera analógico", precioReferencial: 80, cantidad: 3, condicion: "Caja abierta, función no verificada", costoAsignado: 120, precioVentaSugerido: 210 },
      { producto: "Pulsera con cristales", precioReferencial: 20, cantidad: 8, condicion: "Nuevo", costoAsignado: 70, precioVentaSugerido: 140 },
    ],
  },
  {
    nombre: "Caja de Retorno Listada — Hogar y Cocina",
    slug: "caja-listada-hogar-cocina",
    skuLote: "CDI-HG-033",
    clasificacion: "hogar",
    tipoVenta: "listada",
    descripcionCorta: "Manifiesto de pequeños electrodomésticos y artículos de cocina devueltos.",
    descripcionTecnica: "Lote de hogar y cocina con manifiesto verificado, orientado a revendedores de marketplace y ferias.",
    manifiesto: "MAN-EU-77034",
    origen: "Alemania, Francia",
    centroRetorno: "Amazon FC Koblenz (DE)",
    certificacionAduanera: "Verificada — Cert. N.º ADU-18820",
    gradoLiquidacion: "Grado B — Devolución de cliente",
    pesoBruto: "21.7 kg",
    dimensiones: "55 x 40 x 38 cm",
    precioVentaCaja: 680.0,
    stockDisponible: 22,
    destacada: false,
    rating: 4.4,
    numResenas: 94,
    detalle: [
      { producto: "Freidora de aire compacta", precioReferencial: 150, cantidad: 1, condicion: "Caja abierta, función no verificada", costoAsignado: 90, precioVentaSugerido: 170 },
      { producto: "Batidora de mano", precioReferencial: 45, cantidad: 2, condicion: "Como nuevo", costoAsignado: 55, precioVentaSugerido: 95 },
      { producto: "Set de cuchillos de cocina", precioReferencial: 60, cantidad: 3, condicion: "Nuevo", costoAsignado: 90, precioVentaSugerido: 165 },
      { producto: "Termo de acero inoxidable", precioReferencial: 20, cantidad: 6, condicion: "Nuevo", costoAsignado: 60, precioVentaSugerido: 105 },
    ],
  },
  {
    nombre: "Caja de Retorno Listada — Herramientas",
    slug: "caja-listada-herramientas",
    skuLote: "CDI-HR-027",
    clasificacion: "herramientas",
    tipoVenta: "listada",
    descripcionCorta: "Manifiesto de herramientas manuales y eléctricas devueltas, con demanda estable en canales B2B.",
    descripcionTecnica: "Lote de herramientas con manifiesto verificado por unidad.",
    manifiesto: "MAN-EU-63390",
    origen: "España, Alemania",
    centroRetorno: "Amazon FC San Fernando (ES)",
    certificacionAduanera: "Verificada — Cert. N.º ADU-40552",
    gradoLiquidacion: "Grado B — Devolución de cliente",
    pesoBruto: "16.2 kg",
    dimensiones: "45 x 35 x 28 cm",
    precioVentaCaja: 590.0,
    stockDisponible: 17,
    destacada: false,
    rating: 4.5,
    numResenas: 58,
    detalle: [
      { producto: "Taladro inalámbrico con batería", precioReferencial: 130, cantidad: 2, condicion: "Función no verificada", costoAsignado: 130, precioVentaSugerido: 240 },
      { producto: "Set de llaves combinadas", precioReferencial: 35, cantidad: 3, condicion: "Nuevo", costoAsignado: 60, precioVentaSugerido: 105 },
      { producto: "Medidor láser de distancia", precioReferencial: 55, cantidad: 2, condicion: "Como nuevo", costoAsignado: 60, precioVentaSugerido: 105 },
    ],
  },
  {
    nombre: "Caja de Retorno Listada — Belleza y Cuidado Personal",
    slug: "caja-listada-belleza",
    skuLote: "CDI-BL-011",
    clasificacion: "belleza",
    tipoVenta: "listada",
    descripcionCorta: "Manifiesto de fragancias, cosmética y dispositivos de cuidado personal devueltos.",
    descripcionTecnica: "Lote de belleza con manifiesto por artículo, alta rotación en canales de reventa minorista.",
    manifiesto: "MAN-EU-29981",
    origen: "Francia, Alemania",
    centroRetorno: "Amazon FC Boves (FR)",
    certificacionAduanera: "Verificada — Cert. N.º ADU-27713",
    gradoLiquidacion: "Grado A/B — Devolución de cliente",
    pesoBruto: "6.8 kg",
    dimensiones: "34 x 26 x 18 cm",
    precioVentaCaja: 480.0,
    stockDisponible: 31,
    destacada: false,
    rating: 4.4,
    numResenas: 63,
    detalle: [
      { producto: "Fragancia de marca 50 ml", precioReferencial: 40, cantidad: 4, condicion: "Caja abierta, producto sellado", costoAsignado: 70, precioVentaSugerido: 130 },
      { producto: "Plancha de cabello", precioReferencial: 45, cantidad: 2, condicion: "Función no verificada", costoAsignado: 40, precioVentaSugerido: 75 },
      { producto: "Set de maquillaje surtido", precioReferencial: 30, cantidad: 5, condicion: "Nuevo", costoAsignado: 65, precioVentaSugerido: 120 },
    ],
  },
  {
    nombre: "Caja Sorpresa Electrónica",
    slug: "caja-sorpresa-electronica",
    skuLote: "CDI-SP-EL-02",
    clasificacion: "electronica",
    tipoVenta: "sorpresa",
    descripcionCorta: "Selección sorpresa de retornos de electrónica. Clasificación confirmada, manifiesto exacto reservado.",
    descripcionTecnica: "Lote de electrónica curado por categoría, con contenido variable por unidad.",
    manifiesto: "Variable por lote",
    origen: "Reino Unido, Alemania",
    centroRetorno: "Red de FC Amazon Europa",
    certificacionAduanera: "Verificada — Cert. N.º ADU-51120",
    gradoLiquidacion: "Grado B — Devolución de cliente",
    pesoBruto: "3.50 - 5.00 kg",
    dimensiones: "40 x 30 x 25 cm",
    precioVentaCaja: 450.0,
    stockDisponible: 27,
    destacada: true,
    rating: 4.7,
    numResenas: 138,
    detalle: [],
    rangoSorpresa: { cantidadMin: 3, cantidadMax: 6, valorMin: 550, valorMax: 950 },
  },
  {
    nombre: "Caja Sorpresa Joyería",
    slug: "caja-sorpresa-joyeria",
    skuLote: "CDI-SP-JY-03",
    clasificacion: "joyeria",
    tipoVenta: "sorpresa",
    descripcionCorta: "La categoría con mayor potencial de artículos de alto valor no reclamado.",
    descripcionTecnica: "Curaduría de nivel premium sobre retornos de joyería y relojería.",
    manifiesto: "Variable por lote",
    origen: "Reino Unido, España",
    centroRetorno: "Red de FC Amazon Europa",
    certificacionAduanera: "Verificada — Cert. N.º ADU-60934",
    gradoLiquidacion: "Grado A/B — Devolución de cliente",
    pesoBruto: "1.20 - 2.10 kg",
    dimensiones: "26 x 20 x 12 cm",
    precioVentaCaja: 620.0,
    stockDisponible: 12,
    destacada: true,
    rating: 4.9,
    numResenas: 201,
    detalle: [],
    rangoSorpresa: { cantidadMin: 2, cantidadMax: 5, valorMin: 750, valorMax: 1400 },
  },
  {
    nombre: "Caja Sorpresa Mixta — Nivel Inicial",
    slug: "caja-sorpresa-mixta-inicial",
    skuLote: "CDI-SP-MX-01",
    clasificacion: "mixto",
    tipoVenta: "sorpresa",
    descripcionCorta: "Punto de entrada ideal para revendedores nuevos: lote variado a precio de liquidación.",
    descripcionTecnica: "Lote mixto de bajo costo de entrada, pensado para evaluar margen y calidad de manifiesto antes de escalar.",
    manifiesto: "Variable por lote",
    origen: "Reino Unido, Alemania, España",
    centroRetorno: "Red de FC Amazon Europa",
    certificacionAduanera: "Verificada — Cert. N.º ADU-70044",
    gradoLiquidacion: "Grado B/C — Devolución de cliente",
    pesoBruto: "2.50 - 4.00 kg",
    dimensiones: "34 x 26 x 18 cm",
    precioVentaCaja: 210.0,
    stockDisponible: 54,
    destacada: false,
    rating: 4.5,
    numResenas: 289,
    detalle: [],
    rangoSorpresa: { cantidadMin: 4, cantidadMax: 8, valorMin: 260, valorMax: 420 },
  },
  {
    nombre: "Caja Sorpresa Premium",
    slug: "caja-sorpresa-premium",
    skuLote: "CDI-SP-PR-03",
    clasificacion: "mixto",
    tipoVenta: "sorpresa",
    descripcionCorta: "Selección sorpresa de mayor valor, combinando electrónica, joyería y artículos de alta demanda.",
    descripcionTecnica: "Curaduría de nivel superior sobre los lotes con mejor manifiesto de origen.",
    manifiesto: "Variable por lote",
    origen: "Reino Unido, Alemania, España",
    centroRetorno: "Red de FC Amazon Europa",
    certificacionAduanera: "Verificada — Cert. N.º ADU-81095",
    gradoLiquidacion: "Grado A/B — Devolución de cliente",
    pesoBruto: "3.00 - 4.60 kg",
    dimensiones: "38 x 28 x 20 cm",
    precioVentaCaja: 900.0,
    stockDisponible: 8,
    destacada: true,
    rating: 4.8,
    numResenas: 46,
    detalle: [],
    rangoSorpresa: { cantidadMin: 3, cantidadMax: 6, valorMin: 1100, valorMax: 2000 },
  },
  {
    nombre: "Caja Sorpresa Juguetería y Ocio",
    slug: "caja-sorpresa-juguetes",
    skuLote: "CDI-SP-JG-01",
    clasificacion: "juguetes",
    tipoVenta: "sorpresa",
    descripcionCorta: "Selección sorpresa de retornos de juguetería y ocio, ideal para reventa de temporada.",
    descripcionTecnica: "Lote curado por categoría con alta rotación en fechas estacionales.",
    manifiesto: "Variable por lote",
    origen: "Reino Unido, Alemania",
    centroRetorno: "Red de FC Amazon Europa",
    certificacionAduanera: "Verificada — Cert. N.º ADU-90128",
    gradoLiquidacion: "Grado B — Devolución de cliente",
    pesoBruto: "2.80 - 4.20 kg",
    dimensiones: "36 x 28 x 22 cm",
    precioVentaCaja: 200.0,
    stockDisponible: 38,
    destacada: false,
    rating: 4.6,
    numResenas: 104,
    detalle: [],
    rangoSorpresa: { cantidadMin: 4, cantidadMax: 9, valorMin: 250, valorMax: 400 },
  },
];

async function main() {
  console.log("Sembrando clasificaciones...");
  const clasificacionesPorSlug = new Map<string, string>();
  for (const c of CLASIFICACIONES) {
    const creada = await prisma.clasificacion.upsert({
      where: { slug: c.slug },
      update: { nombre: c.nombre, descripcion: c.descripcion, icono: c.icono },
      create: c,
    });
    clasificacionesPorSlug.set(c.slug, creada.id);
  }

  console.log("Sembrando cajas y detalle...");
  for (const caja of CAJAS) {
    const clasificacionId = clasificacionesPorSlug.get(caja.clasificacion);
    if (!clasificacionId) throw new Error(`Clasificación no encontrada: ${caja.clasificacion}`);

    const costoTotal =
      caja.tipoVenta === "sorpresa" && caja.rangoSorpresa
        ? Math.round(caja.rangoSorpresa.valorMin * 0.55 * 100) / 100
        : caja.detalle.reduce((acc, d) => acc + d.costoAsignado, 0);

    const camposComunes = {
      nombre: caja.nombre,
      sku_lote: caja.skuLote,
      clasificacion_id: clasificacionId,
      tipo_venta: caja.tipoVenta,
      descripcion_corta: caja.descripcionCorta,
      descripcion_tecnica: caja.descripcionTecnica,
      manifiesto: caja.manifiesto,
      origen: caja.origen,
      centro_retorno: caja.centroRetorno,
      certificacion_aduanera: caja.certificacionAduanera,
      grado_liquidacion: caja.gradoLiquidacion,
      peso_bruto: caja.pesoBruto,
      dimensiones: caja.dimensiones,
      costo_total: costoTotal,
      precio_venta_caja: caja.precioVentaCaja,
      stock_disponible: caja.stockDisponible,
      destacada: caja.destacada,
      rating: caja.rating,
      num_resenas: caja.numResenas,
      cantidad_estimada_min: caja.rangoSorpresa?.cantidadMin ?? null,
      cantidad_estimada_max: caja.rangoSorpresa?.cantidadMax ?? null,
      valor_estimado_min: caja.rangoSorpresa?.valorMin ?? null,
      valor_estimado_max: caja.rangoSorpresa?.valorMax ?? null,
    };

    const cajaCreada = await prisma.caja.upsert({
      where: { slug: caja.slug },
      update: camposComunes,
      create: {
        ...camposComunes,
        slug: caja.slug,
        detalles: {
          create: caja.detalle.map((d) => ({
            cantidad: d.cantidad,
            condicion: d.condicion,
            costo_asignado: d.costoAsignado,
            precio_venta_sugerido: d.precioVentaSugerido,
            producto: {
              create: {
                nombre: d.producto,
                precio_referencial: d.precioReferencial,
              },
            },
          })),
        },
      },
    });

    // Si el tipo de venta es "sorpresa" no debe llevar filas de detalle
    // (usa el rango min/max en su lugar); limpia filas heredadas de siembras previas.
    if (caja.tipoVenta === "sorpresa") {
      await prisma.detalleCaja.deleteMany({ where: { caja_id: cajaCreada.id } });
    }
  }

  console.log(`Listo: ${CLASIFICACIONES.length} clasificaciones, ${CAJAS.length} cajas.`);

  console.log("Sembrando usuario administrador inicial (JEFE)...");
  const ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME || "RCAG21";
  const existente = await prisma.usuario.findUnique({ where: { username: ADMIN_USERNAME } });

  if (existente) {
    console.log(`Usuario "${ADMIN_USERNAME}" ya existe, no se modifica su contraseña.`);
  } else {
    // La contraseña real NUNCA va en el código fuente (este archivo se sube a git).
    // Se lee de .env; si falta, se genera una aleatoria y se imprime una sola vez.
    let password = process.env.SEED_ADMIN_PASSWORD;
    let generada = false;
    if (!password) {
      password = crypto.randomBytes(9).toString("base64url");
      generada = true;
    }
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.usuario.create({
      data: {
        nombre: "Administrador",
        username: ADMIN_USERNAME,
        password_hash: passwordHash,
        rol: "JEFE",
      },
    });

    if (generada) {
      console.log("");
      console.log("=".repeat(60));
      console.log(`Usuario "${ADMIN_USERNAME}" creado con contraseña GENERADA:`);
      console.log(`  ${password}`);
      console.log("Guárdala ahora — no se volverá a mostrar. Para fijar tu");
      console.log("propia contraseña la próxima vez, define SEED_ADMIN_PASSWORD");
      console.log("en tu .env antes de correr el seed.");
      console.log("=".repeat(60));
    } else {
      console.log(`Usuario "${ADMIN_USERNAME}" creado con la contraseña de SEED_ADMIN_PASSWORD.`);
    }
  }
  console.log("Inicia sesión en /admin/login.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
