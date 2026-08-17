"use server";

import { revalidatePath } from "next/cache";
import {
  alternarActivoUsuario,
  crearSocio,
  eliminarUsuario,
  type CrearSocioInput,
} from "@/lib/data/usuarios";
import { verifyJefe } from "@/lib/auth/dal";

export async function crearSocioAction(input: CrearSocioInput) {
  await verifyJefe();
  await crearSocio(input);
  revalidatePath("/admin/cajas/socios");
}

export async function alternarActivoSocioAction(id: string, activo: boolean) {
  await verifyJefe();
  await alternarActivoUsuario(id, activo);
  revalidatePath("/admin/cajas/socios");
}

export async function eliminarSocioAction(id: string) {
  await verifyJefe();
  await eliminarUsuario(id);
  revalidatePath("/admin/cajas/socios");
}
