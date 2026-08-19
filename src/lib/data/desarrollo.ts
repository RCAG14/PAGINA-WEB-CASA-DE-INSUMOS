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

export interface PaqueteDesarrolloInput {
  nombre: string;
  tagline: string;
  precio: number;
  features: string[];
  destacado: boolean;
  activo: boolean;
}

export async function getPaquetesDesarrolloAdmin() {
  const rows = await prisma.paqueteDesarrollo.findMany({ orderBy: { orden: "asc" } });
  // El campo `precio` es un Decimal de Prisma — no es un objeto plano serializable
  // a través del límite Server → Client Component, por eso se convierte a number aquí.
  return rows.map((p) => ({ ...p, precio: toDecimalNumber(p.precio) }));
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
    features: p.features,
    destacado: p.destacado,
  }));
}

export async function crearPaqueteDesarrollo(input: PaqueteDesarrolloInput) {
  const count = await prisma.paqueteDesarrollo.count();
  try {
    return await prisma.paqueteDesarrollo.create({ data: { ...input, orden: count } });
  } catch (error) {
    throwFriendlyUniqueError(error, "Ya existe un paquete con ese nombre.");
  }
}

export async function actualizarPaqueteDesarrollo(id: string, input: PaqueteDesarrolloInput) {
  try {
    return await prisma.paqueteDesarrollo.update({ where: { id }, data: input });
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
