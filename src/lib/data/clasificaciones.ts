import { prisma } from "@/lib/prisma";
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
  const row = await prisma.clasificacion.create({ data: input });
  return toCategoryMeta(row);
}

export async function actualizarClasificacion(
  id: string,
  input: Omit<ClasificacionInput, "slug">
) {
  const row = await prisma.clasificacion.update({ where: { id }, data: input });
  return toCategoryMeta(row);
}

export async function eliminarClasificacion(id: string) {
  await prisma.clasificacion.delete({ where: { id } });
}

export async function contarCajasPorClasificacion(clasificacionId: string) {
  return prisma.caja.count({ where: { clasificacion_id: clasificacionId } });
}
