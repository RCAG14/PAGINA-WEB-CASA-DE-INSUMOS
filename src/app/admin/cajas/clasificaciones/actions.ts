"use server";

import { revalidatePath } from "next/cache";
import {
  actualizarClasificacion,
  crearClasificacion,
  eliminarClasificacion,
  type ClasificacionInput,
} from "@/lib/data/clasificaciones";
import { slugify } from "@/lib/utils";
import { verifyJefe } from "@/lib/auth/dal";

export async function crearClasificacionAction(input: Omit<ClasificacionInput, "slug">) {
  await verifyJefe();
  await crearClasificacion({ ...input, slug: slugify(input.nombre) });
  revalidatePath("/admin/cajas/clasificaciones");
  revalidatePath("/");
  revalidatePath("/cajas-devoluciones-amazon-bolivia");
}

export async function actualizarClasificacionAction(
  id: string,
  input: Omit<ClasificacionInput, "slug">
) {
  await verifyJefe();
  await actualizarClasificacion(id, input);
  revalidatePath("/admin/cajas/clasificaciones");
  revalidatePath("/");
  revalidatePath("/cajas-devoluciones-amazon-bolivia");
}

export async function eliminarClasificacionAction(id: string) {
  await verifyJefe();
  await eliminarClasificacion(id);
  revalidatePath("/admin/cajas/clasificaciones");
  revalidatePath("/");
  revalidatePath("/cajas-devoluciones-amazon-bolivia");
}
