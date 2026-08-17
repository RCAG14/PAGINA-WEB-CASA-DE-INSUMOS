"use server";

import { revalidatePath } from "next/cache";
import {
  actualizarClasificacion,
  crearClasificacion,
  eliminarClasificacion,
  type ClasificacionInput,
} from "@/lib/data/clasificaciones";
import { slugify } from "@/lib/utils";

export async function crearClasificacionAction(input: Omit<ClasificacionInput, "slug">) {
  await crearClasificacion({ ...input, slug: slugify(input.nombre) });
  revalidatePath("/admin/cajas/clasificaciones");
  revalidatePath("/");
  revalidatePath("/catalogo");
}

export async function actualizarClasificacionAction(
  id: string,
  input: Omit<ClasificacionInput, "slug">
) {
  await actualizarClasificacion(id, input);
  revalidatePath("/admin/cajas/clasificaciones");
  revalidatePath("/");
  revalidatePath("/catalogo");
}

export async function eliminarClasificacionAction(id: string) {
  await eliminarClasificacion(id);
  revalidatePath("/admin/cajas/clasificaciones");
  revalidatePath("/");
  revalidatePath("/catalogo");
}
