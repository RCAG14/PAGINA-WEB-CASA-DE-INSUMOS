"use server";

import { revalidatePath } from "next/cache";
import { alternarModulo, type ModuloClave } from "@/lib/data/modulos";
import { verifyJefe } from "@/lib/auth/dal";

export async function alternarModuloAction(clave: ModuloClave, activo: boolean) {
  await verifyJefe();
  await alternarModulo(clave, activo);
  revalidatePath("/admin/configuracion/modulos");
  revalidatePath("/admin");
}
