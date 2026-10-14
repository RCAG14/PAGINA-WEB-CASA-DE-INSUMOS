import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { toDecimalNumber } from "@/lib/data/decimal";
import { deleteFromSupabaseStorage } from "@/lib/supabase";
import type { Locale } from "@/lib/i18n/dictionaries";

// Todos los montos de desarrollo web están en dólares (USD). Los campos `*En`
// son la traducción al inglés: si están vacíos, la vista pública usa el español.

function throwFriendlyUniqueError(error: unknown, message: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new Error(message);
  }
  throw error;
}

/** Texto en el idioma del visitante, o el español si falta la traducción. */
function traducir(es: string, en: string | null | undefined, locale: Locale) {
  return locale === "en" && en?.trim() ? en : es;
}

function textoOpcional(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

export interface DesgloseItem {
  concepto: string;
  monto: number;
  motivo: string;
  conceptoEn: string | null;
  motivoEn: string | null;
}

/** Normaliza la columna JSON `desglose` — descarta entradas mal formadas. */
function parseDesglose(value: Prisma.JsonValue): DesgloseItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const { concepto, monto, motivo, conceptoEn, motivoEn } = item as Record<string, unknown>;
    if (typeof concepto !== "string" || typeof monto !== "number") return [];
    return [
      {
        concepto,
        monto,
        motivo: typeof motivo === "string" ? motivo : "",
        conceptoEn: textoOpcional(conceptoEn),
        motivoEn: textoOpcional(motivoEn),
      },
    ];
  });
}

export interface PaqueteDesarrolloInput {
  nombre: string;
  nombreEn: string | null;
  tagline: string;
  taglineEn: string | null;
  precio: number;
  mantenimientoMensual: number | null;
  features: string[];
  featuresEn: string[];
  desglose: DesgloseItem[];
  destacado: boolean;
  activo: boolean;
}

export async function getPaquetesDesarrolloAdmin() {
  const rows = await prisma.paqueteDesarrollo.findMany({ orderBy: { orden: "asc" } });
  // El campo `precio` es un Decimal de Prisma — no es un objeto plano serializable
  // a través del límite Server → Client Component, por eso se convierte a number aquí.
  return rows.map(({ mantenimiento_mensual, nombre_en, tagline_en, features_en, ...p }) => ({
    ...p,
    nombreEn: nombre_en,
    taglineEn: tagline_en,
    featuresEn: features_en,
    precio: toDecimalNumber(p.precio),
    desglose: parseDesglose(p.desglose),
    mantenimientoMensual:
      mantenimiento_mensual === null ? null : toDecimalNumber(mantenimiento_mensual),
  }));
}

/** Paquetes visibles, con los textos ya en el idioma del visitante. */
export async function getPaquetesDesarrollo(locale: Locale) {
  const rows = await prisma.paqueteDesarrollo.findMany({
    where: { activo: true },
    orderBy: { orden: "asc" },
  });
  return rows.map((p) => ({
    id: p.id,
    nombre: traducir(p.nombre, p.nombre_en, locale),
    // El mensaje de WhatsApp llega al negocio: siempre con el nombre en español.
    nombreEs: p.nombre,
    tagline: traducir(p.tagline, p.tagline_en, locale),
    precio: toDecimalNumber(p.precio),
    mantenimientoMensual:
      p.mantenimiento_mensual === null ? null : toDecimalNumber(p.mantenimiento_mensual),
    features: locale === "en" && p.features_en.length > 0 ? p.features_en : p.features,
    desglose: parseDesglose(p.desglose).map((d) => ({
      concepto: traducir(d.concepto, d.conceptoEn, locale),
      monto: d.monto,
      motivo: traducir(d.motivo, d.motivoEn, locale),
    })),
    destacado: p.destacado,
  }));
}

/** Precio (USD) del paquete activo más barato — referencia "desde" de la portada. */
export async function getPrecioMinimoPaquetes(): Promise<number | null> {
  const { _min } = await prisma.paqueteDesarrollo.aggregate({
    where: { activo: true },
    _min: { precio: true },
  });
  return _min.precio === null ? null : toDecimalNumber(_min.precio);
}

function toPaqueteData({
  mantenimientoMensual,
  desglose,
  nombreEn,
  taglineEn,
  featuresEn,
  ...rest
}: PaqueteDesarrolloInput) {
  return {
    ...rest,
    nombre_en: nombreEn?.trim() || null,
    tagline_en: taglineEn?.trim() || null,
    features_en: featuresEn,
    desglose: desglose as unknown as Prisma.InputJsonValue,
    mantenimiento_mensual: mantenimientoMensual,
  };
}

export async function crearPaqueteDesarrollo(input: PaqueteDesarrolloInput) {
  const count = await prisma.paqueteDesarrollo.count();
  try {
    return await prisma.paqueteDesarrollo.create({
      data: { ...toPaqueteData(input), orden: count },
    });
  } catch (error) {
    throwFriendlyUniqueError(error, "Ya existe un paquete con ese nombre.");
  }
}

export async function actualizarPaqueteDesarrollo(id: string, input: PaqueteDesarrolloInput) {
  try {
    return await prisma.paqueteDesarrollo.update({
      where: { id },
      data: toPaqueteData(input),
    });
  } catch (error) {
    throwFriendlyUniqueError(error, "Ya existe un paquete con ese nombre.");
  }
}

export async function eliminarPaqueteDesarrollo(id: string) {
  await prisma.paqueteDesarrollo.delete({ where: { id } });
}

export async function actualizarOrdenPaqueteDesarrollo(id: string, orden: number) {
  await prisma.paqueteDesarrollo.update({ where: { id }, data: { orden } });
}

export interface ExtraDesarrolloInput {
  nombre: string;
  nombreEn: string | null;
  motivo: string;
  motivoEn: string | null;
  precio: number;
  unidad: string | null;
  unidadEn: string | null;
  precioDesde: boolean;
  activo: boolean;
}

function toExtraData({ precioDesde, nombreEn, motivoEn, unidadEn, ...rest }: ExtraDesarrolloInput) {
  return {
    ...rest,
    nombre_en: nombreEn?.trim() || null,
    motivo_en: motivoEn?.trim() || null,
    unidad_en: unidadEn?.trim() || null,
    precio_desde: precioDesde,
  };
}

export async function getExtrasDesarrolloAdmin() {
  const rows = await prisma.extraDesarrollo.findMany({ orderBy: { orden: "asc" } });
  return rows.map((e) => ({
    id: e.id,
    nombre: e.nombre,
    nombreEn: e.nombre_en,
    motivo: e.motivo,
    motivoEn: e.motivo_en,
    precio: toDecimalNumber(e.precio),
    unidad: e.unidad,
    unidadEn: e.unidad_en,
    precioDesde: e.precio_desde,
    activo: e.activo,
    orden: e.orden,
  }));
}

/** Extras visibles, con los textos ya en el idioma del visitante. */
export async function getExtrasDesarrollo(locale: Locale) {
  const rows = await prisma.extraDesarrollo.findMany({
    where: { activo: true },
    orderBy: { orden: "asc" },
  });
  return rows.map((e) => ({
    id: e.id,
    nombre: traducir(e.nombre, e.nombre_en, locale),
    motivo: traducir(e.motivo, e.motivo_en, locale),
    precio: toDecimalNumber(e.precio),
    unidad: e.unidad === null ? null : traducir(e.unidad, e.unidad_en, locale),
    precioDesde: e.precio_desde,
  }));
}

export async function crearExtraDesarrollo(input: ExtraDesarrolloInput) {
  const count = await prisma.extraDesarrollo.count();
  try {
    return await prisma.extraDesarrollo.create({ data: { ...toExtraData(input), orden: count } });
  } catch (error) {
    throwFriendlyUniqueError(error, "Ya existe un extra con ese nombre.");
  }
}

export async function actualizarExtraDesarrollo(id: string, input: ExtraDesarrolloInput) {
  try {
    return await prisma.extraDesarrollo.update({ where: { id }, data: toExtraData(input) });
  } catch (error) {
    throwFriendlyUniqueError(error, "Ya existe un extra con ese nombre.");
  }
}

export async function eliminarExtraDesarrollo(id: string) {
  await prisma.extraDesarrollo.delete({ where: { id } });
}

export async function actualizarOrdenExtraDesarrollo(id: string, orden: number) {
  await prisma.extraDesarrollo.update({ where: { id }, data: { orden } });
}

export interface TrabajoRealizadoInput {
  titulo: string;
  tituloEn: string | null;
  categoria: string;
  categoriaEn: string | null;
  descripcion: string;
  descripcionEn: string | null;
  imagenUrl: string | null;
  imagenPath: string | null;
  enlace: string | null;
  activo: boolean;
}

function toTrabajoData(input: TrabajoRealizadoInput) {
  return {
    titulo: input.titulo,
    titulo_en: input.tituloEn?.trim() || null,
    categoria: input.categoria,
    categoria_en: input.categoriaEn?.trim() || null,
    descripcion: input.descripcion,
    descripcion_en: input.descripcionEn?.trim() || null,
    imagen_url: input.imagenUrl,
    imagen_path: input.imagenPath,
    enlace: input.enlace,
    activo: input.activo,
  };
}

export async function getTrabajosRealizadosAdmin() {
  return prisma.trabajoRealizado.findMany({ orderBy: { orden: "asc" } });
}

/** Trabajos visibles, con los textos ya en el idioma del visitante. */
export async function getTrabajosRealizados(locale: Locale) {
  const rows = await prisma.trabajoRealizado.findMany({
    where: { activo: true },
    orderBy: { orden: "asc" },
  });
  return rows.map((t) => ({
    id: t.id,
    titulo: traducir(t.titulo, t.titulo_en, locale),
    categoria: traducir(t.categoria, t.categoria_en, locale),
    descripcion: traducir(t.descripcion, t.descripcion_en, locale),
    imagenUrl: t.imagen_url,
    enlace: t.enlace,
  }));
}

/** Cantidad de trabajos visibles — dato "Proyectos realizados" del hero. */
export async function contarTrabajosRealizados() {
  return prisma.trabajoRealizado.count({ where: { activo: true } });
}

export async function crearTrabajoRealizado(input: TrabajoRealizadoInput) {
  const count = await prisma.trabajoRealizado.count();
  return prisma.trabajoRealizado.create({
    data: { ...toTrabajoData(input), orden: count },
  });
}

export async function actualizarTrabajoRealizado(id: string, input: TrabajoRealizadoInput) {
  const anterior = await prisma.trabajoRealizado.findUnique({ where: { id } });

  await prisma.trabajoRealizado.update({
    where: { id },
    data: toTrabajoData(input),
  });

  // Si el admin reemplazó la imagen (nuevo path), limpia el asset viejo en Supabase Storage.
  if (anterior?.imagen_path && anterior.imagen_path !== input.imagenPath) {
    await deleteFromSupabaseStorage(anterior.imagen_path).catch(() => {});
  }
}

export async function actualizarOrdenTrabajoRealizado(id: string, orden: number) {
  await prisma.trabajoRealizado.update({ where: { id }, data: { orden } });
}

export async function eliminarTrabajoRealizado(id: string) {
  const row = await prisma.trabajoRealizado.delete({ where: { id } });
  if (row.imagen_path) {
    await deleteFromSupabaseStorage(row.imagen_path).catch(() => {});
  }
}
