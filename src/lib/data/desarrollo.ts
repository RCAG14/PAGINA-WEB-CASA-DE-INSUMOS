import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { toDecimalNumber } from "@/lib/data/decimal";
import { deleteFromSupabaseStorage } from "@/lib/supabase";

function throwFriendlyUniqueError(error: unknown, message: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new Error(message);
  }
  throw error;
}

export interface DesgloseItem {
  concepto: string;
  monto: number;
  motivo: string;
}

/** Normaliza la columna JSON `desglose` — descarta entradas mal formadas. */
function parseDesglose(value: Prisma.JsonValue): DesgloseItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const { concepto, monto, motivo } = item as Record<string, unknown>;
    if (typeof concepto !== "string" || typeof monto !== "number") return [];
    return [{ concepto, monto, motivo: typeof motivo === "string" ? motivo : "" }];
  });
}

export interface PaqueteDesarrolloInput {
  nombre: string;
  tagline: string;
  precio: number;
  mantenimientoMensual: number | null;
  features: string[];
  desglose: DesgloseItem[];
  destacado: boolean;
  activo: boolean;
}

export async function getPaquetesDesarrolloAdmin() {
  const rows = await prisma.paqueteDesarrollo.findMany({ orderBy: { orden: "asc" } });
  // El campo `precio` es un Decimal de Prisma — no es un objeto plano serializable
  // a través del límite Server → Client Component, por eso se convierte a number aquí.
  return rows.map(({ mantenimiento_mensual, ...p }) => ({
    ...p,
    precio: toDecimalNumber(p.precio),
    desglose: parseDesglose(p.desglose),
    mantenimientoMensual:
      mantenimiento_mensual === null ? null : toDecimalNumber(mantenimiento_mensual),
  }));
}

export async function getPaquetesDesarrollo() {
  const rows = await prisma.paqueteDesarrollo.findMany({
    where: { activo: true },
    orderBy: { orden: "asc" },
  });
  return rows.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    tagline: p.tagline,
    precio: toDecimalNumber(p.precio),
    mantenimientoMensual:
      p.mantenimiento_mensual === null ? null : toDecimalNumber(p.mantenimiento_mensual),
    features: p.features,
    desglose: parseDesglose(p.desglose),
    destacado: p.destacado,
  }));
}

export async function crearPaqueteDesarrollo(input: PaqueteDesarrolloInput) {
  const count = await prisma.paqueteDesarrollo.count();
  const { mantenimientoMensual, desglose, ...rest } = input;
  try {
    return await prisma.paqueteDesarrollo.create({
      data: {
        ...rest,
        desglose: desglose as unknown as Prisma.InputJsonValue,
        mantenimiento_mensual: mantenimientoMensual,
        orden: count,
      },
    });
  } catch (error) {
    throwFriendlyUniqueError(error, "Ya existe un paquete con ese nombre.");
  }
}

export async function actualizarPaqueteDesarrollo(id: string, input: PaqueteDesarrolloInput) {
  const { mantenimientoMensual, desglose, ...rest } = input;
  try {
    return await prisma.paqueteDesarrollo.update({
      where: { id },
      data: {
        ...rest,
        desglose: desglose as unknown as Prisma.InputJsonValue,
        mantenimiento_mensual: mantenimientoMensual,
      },
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
  motivo: string;
  precio: number;
  unidad: string | null;
  precioDesde: boolean;
  activo: boolean;
}

function mapExtra(e: {
  id: string;
  nombre: string;
  motivo: string;
  precio: Prisma.Decimal;
  unidad: string | null;
  precio_desde: boolean;
  activo: boolean;
  orden: number;
}) {
  return {
    id: e.id,
    nombre: e.nombre,
    motivo: e.motivo,
    precio: toDecimalNumber(e.precio),
    unidad: e.unidad,
    precioDesde: e.precio_desde,
    activo: e.activo,
    orden: e.orden,
  };
}

function toExtraData({ precioDesde, ...rest }: ExtraDesarrolloInput) {
  return { ...rest, precio_desde: precioDesde };
}

export async function getExtrasDesarrolloAdmin() {
  const rows = await prisma.extraDesarrollo.findMany({ orderBy: { orden: "asc" } });
  return rows.map(mapExtra);
}

export async function getExtrasDesarrollo() {
  const rows = await prisma.extraDesarrollo.findMany({
    where: { activo: true },
    orderBy: { orden: "asc" },
  });
  return rows.map(mapExtra);
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
  categoria: string;
  descripcion: string;
  imagenUrl: string | null;
  imagenPath: string | null;
  enlace: string | null;
  activo: boolean;
}

export async function getTrabajosRealizadosAdmin() {
  return prisma.trabajoRealizado.findMany({ orderBy: { orden: "asc" } });
}

export async function getTrabajosRealizados() {
  return prisma.trabajoRealizado.findMany({
    where: { activo: true },
    orderBy: { orden: "asc" },
  });
}

export async function crearTrabajoRealizado(input: TrabajoRealizadoInput) {
  const count = await prisma.trabajoRealizado.count();
  return prisma.trabajoRealizado.create({
    data: {
      titulo: input.titulo,
      categoria: input.categoria,
      descripcion: input.descripcion,
      imagen_url: input.imagenUrl,
      imagen_path: input.imagenPath,
      enlace: input.enlace,
      activo: input.activo,
      orden: count,
    },
  });
}

export async function actualizarTrabajoRealizado(id: string, input: TrabajoRealizadoInput) {
  const anterior = await prisma.trabajoRealizado.findUnique({ where: { id } });

  await prisma.trabajoRealizado.update({
    where: { id },
    data: {
      titulo: input.titulo,
      categoria: input.categoria,
      descripcion: input.descripcion,
      imagen_url: input.imagenUrl,
      imagen_path: input.imagenPath,
      enlace: input.enlace,
      activo: input.activo,
    },
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
