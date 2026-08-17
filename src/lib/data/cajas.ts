import { prisma } from "@/lib/prisma";
import { toDecimalNumber } from "@/lib/data/decimal";
import { slugify } from "@/lib/utils";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import type { Prisma } from "@/generated/prisma/client";
import type { Box, BoxItemSpec, CategoryMeta, ClassificationIcon } from "@/lib/types";

const cajaInclude = {
  clasificacion: true,
  detalles: { include: { producto: true } },
} satisfies Prisma.CajaInclude;

type CajaConRelaciones = Prisma.CajaGetPayload<{ include: typeof cajaInclude }>;

function mapClasificacion(c: CajaConRelaciones["clasificacion"]): CategoryMeta {
  return {
    id: c.id,
    slug: c.slug,
    label: c.nombre,
    descripcion: c.descripcion,
    icon: c.icono as ClassificationIcon,
  };
}

export function toBoxViewModel(caja: CajaConRelaciones): Box {
  const esSorpresa = caja.tipo_venta === "sorpresa";

  const valorRetailEstimado = esSorpresa
    ? toDecimalNumber(caja.valor_estimado_min)
    : caja.detalles.reduce((acc, d) => acc + toDecimalNumber(d.precio_venta_sugerido) * d.cantidad, 0);

  const base = {
    id: caja.id,
    slug: caja.slug,
    nombre: caja.nombre,
    clasificacion: mapClasificacion(caja.clasificacion),
    imagenUrl: caja.imagen_url,
    precio: toDecimalNumber(caja.precio_venta_caja),
    valorRetailEstimado,
    stock: caja.stock_disponible,
    descripcionCorta: caja.descripcion_corta,
    descripcionTecnica: caja.descripcion_tecnica,
    specs: {
      skuCaja: caja.sku_lote,
      manifiesto: caja.manifiesto,
      origen: caja.origen,
      centroRetorno: caja.centro_retorno,
      certificacionAduanera: caja.certificacion_aduanera,
      gradoLiquidacion: caja.grado_liquidacion,
      pesoBruto: caja.peso_bruto,
      dimensiones: caja.dimensiones,
    },
    destacada: caja.destacada,
    rating: toDecimalNumber(caja.rating),
    numResenas: caja.num_resenas,
  };

  if (esSorpresa) {
    return {
      ...base,
      tipo: "sorpresa",
      cantidadEstimadaMin: caja.cantidad_estimada_min ?? 0,
      cantidadEstimadaMax: caja.cantidad_estimada_max ?? 0,
      valorEstimadoMin: toDecimalNumber(caja.valor_estimado_min),
      valorEstimadoMax: toDecimalNumber(caja.valor_estimado_max),
    };
  }

  const contenido: BoxItemSpec[] = caja.detalles.map((d) => ({
    productoId: d.producto_id,
    nombre: d.producto.nombre,
    cantidad: d.cantidad,
    condicion: d.condicion,
    precioReferencial: toDecimalNumber(d.producto.precio_referencial),
    precioVentaSugerido: toDecimalNumber(d.precio_venta_sugerido),
  }));

  return { ...base, tipo: "listada", contenido };
}

export async function getCajas(): Promise<Box[]> {
  const rows = await prisma.caja.findMany({ include: cajaInclude, orderBy: { creado_en: "desc" } });
  return rows.map(toBoxViewModel);
}

export async function getCajaBySlug(slug: string): Promise<Box | null> {
  const row = await prisma.caja.findUnique({ where: { slug }, include: cajaInclude });
  return row ? toBoxViewModel(row) : null;
}

export async function getCajaEditableById(id: string) {
  return prisma.caja.findUnique({ where: { id } });
}

export interface DetalleCajaInput {
  nombre: string;
  precioReferencial: number;
  cantidad: number;
  condicion: string;
  costoAsignado: number;
  precioVentaSugerido: number;
}

export interface RangoSorpresaInput {
  cantidadMin: number;
  cantidadMax: number;
  valorMin: number;
  valorMax: number;
}

export interface CrearCajaInput {
  nombre: string;
  skuLote: string;
  clasificacionId: string;
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
  costoTotal: number;
  precioVentaCaja: number;
  stockDisponible: number;
  /** Usado cuando tipoVenta === "listada". */
  detalle: DetalleCajaInput[];
  /** Usado cuando tipoVenta === "sorpresa". */
  rangoSorpresa?: RangoSorpresaInput;
  /** Foto del lote ya subida a Cloudinary (opcional). */
  imagenUrl?: string | null;
  imagenPublicId?: string | null;
}

export async function crearCajaConDetalle(input: CrearCajaInput) {
  const slug = `${slugify(input.nombre)}-${Date.now().toString(36).slice(-4)}`;
  const esSorpresa = input.tipoVenta === "sorpresa";

  const caja = await prisma.caja.create({
    data: {
      nombre: input.nombre,
      slug,
      sku_lote: input.skuLote,
      clasificacion_id: input.clasificacionId,
      tipo_venta: input.tipoVenta,
      descripcion_corta: input.descripcionCorta,
      descripcion_tecnica: input.descripcionTecnica,
      manifiesto: input.manifiesto,
      origen: input.origen,
      centro_retorno: input.centroRetorno,
      certificacion_aduanera: input.certificacionAduanera,
      grado_liquidacion: input.gradoLiquidacion,
      peso_bruto: input.pesoBruto,
      dimensiones: input.dimensiones,
      costo_total: input.costoTotal,
      precio_venta_caja: input.precioVentaCaja,
      stock_disponible: input.stockDisponible,
      imagen_url: input.imagenUrl ?? null,
      imagen_public_id: input.imagenPublicId ?? null,
      cantidad_estimada_min: esSorpresa ? input.rangoSorpresa?.cantidadMin : null,
      cantidad_estimada_max: esSorpresa ? input.rangoSorpresa?.cantidadMax : null,
      valor_estimado_min: esSorpresa ? input.rangoSorpresa?.valorMin : null,
      valor_estimado_max: esSorpresa ? input.rangoSorpresa?.valorMax : null,
      detalles: esSorpresa
        ? undefined
        : {
            create: input.detalle.map((d) => ({
              cantidad: d.cantidad,
              condicion: d.condicion,
              costo_asignado: d.costoAsignado,
              precio_venta_sugerido: d.precioVentaSugerido,
              producto: {
                create: { nombre: d.nombre, precio_referencial: d.precioReferencial },
              },
            })),
          },
    },
  });

  await prisma.movimientoInventario.create({
    data: {
      tipo_entidad: "Caja",
      entidad_id: caja.id,
      cantidad_cambio: input.stockDisponible,
      motivo: "Ingreso",
    },
  });

  return caja.id;
}

export interface ActualizarCajaInput {
  nombre: string;
  skuLote: string;
  clasificacionId: string;
  tipoVenta: "listada" | "sorpresa";
  descripcionCorta: string;
  costoTotal: number;
  precioVentaCaja: number;
  stockDisponible: number;
  /** Foto del lote ya subida a Cloudinary (opcional). */
  imagenUrl?: string | null;
  imagenPublicId?: string | null;
}

export async function actualizarCajaCore(id: string, input: ActualizarCajaInput) {
  const anterior = await prisma.caja.findUnique({
    where: { id },
    select: { imagen_public_id: true },
  });

  await prisma.caja.update({
    where: { id },
    data: {
      nombre: input.nombre,
      sku_lote: input.skuLote,
      clasificacion_id: input.clasificacionId,
      tipo_venta: input.tipoVenta,
      descripcion_corta: input.descripcionCorta,
      costo_total: input.costoTotal,
      precio_venta_caja: input.precioVentaCaja,
      stock_disponible: input.stockDisponible,
      imagen_url: input.imagenUrl ?? null,
      imagen_public_id: input.imagenPublicId ?? null,
    },
  });

  if (
    anterior?.imagen_public_id &&
    anterior.imagen_public_id !== (input.imagenPublicId ?? null)
  ) {
    await deleteFromCloudinary(anterior.imagen_public_id, "image").catch(() => {});
  }
}

export async function eliminarCaja(id: string) {
  const caja = await prisma.caja.delete({ where: { id } });
  if (caja.imagen_public_id) {
    await deleteFromCloudinary(caja.imagen_public_id, "image").catch(() => {});
  }
}
