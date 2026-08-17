"use server";

import { revalidatePath } from "next/cache";
import {
  actualizarCajaCore,
  crearCajaConDetalle,
  eliminarCaja,
  type ActualizarCajaInput,
  type CrearCajaInput,
} from "@/lib/data/cajas";

export async function crearCajaAction(input: CrearCajaInput) {
  const id = await crearCajaConDetalle(input);
  revalidatePath("/admin/cajas/inventario");
  revalidatePath("/admin/cajas");
  revalidatePath("/");
  return id;
}

export async function actualizarCajaAction(id: string, input: ActualizarCajaInput) {
  await actualizarCajaCore(id, input);
  revalidatePath("/admin/cajas/inventario");
  revalidatePath("/");
  revalidatePath("/catalogo");
}

export async function eliminarCajaAction(id: string) {
  await eliminarCaja(id);
  revalidatePath("/admin/cajas/inventario");
  revalidatePath("/admin/cajas");
  revalidatePath("/");
  revalidatePath("/catalogo");
}
