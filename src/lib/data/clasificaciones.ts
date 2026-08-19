import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { CategoryMeta, ClassificationIcon } from "@/lib/types";

interface ClasificacionRow {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  icono: string;
}

function toCategoryMeta(row: ClasificacionRow): CategoryMeta {
  return {
    id: row.id,
    slug: row.slug,
    label: row.nombre,
    descripcion: row.descripcion,
    icon: row.icono as ClassificationIcon,
  };
}

export async function getClasificaciones(): Promise<CategoryMeta[]> {
  const rows = await prisma.clasificacion.findMany({ orderBy: { nombre: "asc" } });
  return rows.map(toCategoryMeta);
}

export interface ClasificacionInput {
  slug: string;
  nombre: string;
  descripcion: string;
  icono: ClassificationIcon;
}

export async function crearClasificacion(input: ClasificacionInput) {
  try {
    const row = await prisma.clasificacion.create({ data: input });
    return toCategoryMeta(row);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("Ya existe una clasificación con ese nombre.");
    }
    throw error;
  }
}

export async function actualizarClasificacion(
  id: string,
  input: Omit<ClasificacionInput, "slug">
) {
  const row = await prisma.clasificacion.update({ where: { id }, data: input });
  return toCategoryMeta(row);
}

export async function eliminarClasificacion(id: string) {
  try {
    await prisma.clasificacion.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      throw new Error(
        "Hay cajas que todavía usan esta clasificación. Reasígnalas antes de eliminarla."
      );
    }
    throw error;
  }
}

export async function contarCajasPorClasificacion(clasificacionId: string) {
  return prisma.caja.count({ where: { clasificacion_id: clasificacionId } });
}
