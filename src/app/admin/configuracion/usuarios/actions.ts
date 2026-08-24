"use server";

import { revalidatePath } from "next/cache";
import {
  actualizarRolUsuario,
  alternarActivoUsuario,
  contarJefesActivos,
  crearUsuarioStaff,
  eliminarUsuario,
  getUsuarioById,
  type CrearUsuarioStaffInput,
  type RolStaff,
} from "@/lib/data/usuarios";
import { verifyJefe } from "@/lib/auth/dal";

export async function crearUsuarioAction(input: CrearUsuarioStaffInput) {
  await verifyJefe();
  await crearUsuarioStaff(input);
  revalidatePath("/admin/configuracion/usuarios");
}

export async function actualizarRolUsuarioAction(id: string, rol: RolStaff) {
  const session = await verifyJefe();

  if (id === session.userId && rol !== "JEFE") {
    throw new Error("No puedes quitarte a ti mismo el rol de Jefe.");
  }
  if (rol === "SOCIO") {
    const quedan = await contarJefesActivos(id);
    if (quedan === 0) {
      throw new Error("Debe quedar al menos un Jefe activo en el sistema.");
    }
  }

  await actualizarRolUsuario(id, rol);
  revalidatePath("/admin/configuracion/usuarios");
}

export async function alternarActivoUsuarioAction(id: string, activo: boolean) {
  const session = await verifyJefe();

  if (id === session.userId && !activo) {
    throw new Error("No puedes desactivar tu propia cuenta.");
  }
  if (!activo) {
    const objetivo = await getUsuarioById(id);
    if (objetivo?.rol === "JEFE") {
      const quedan = await contarJefesActivos(id);
      if (quedan === 0) {
        throw new Error("Debe quedar al menos un Jefe activo en el sistema.");
      }
    }
  }

  await alternarActivoUsuario(id, activo);
  revalidatePath("/admin/configuracion/usuarios");
}

export async function eliminarUsuarioAction(id: string) {
  const session = await verifyJefe();

  if (id === session.userId) {
    throw new Error("No puedes eliminar tu propia cuenta.");
  }

  const objetivo = await getUsuarioById(id);
  if (objetivo?.rol === "JEFE") {
    const quedan = await contarJefesActivos(id);
    if (quedan === 0) {
      throw new Error("Debe quedar al menos un Jefe activo en el sistema.");
    }
  }

  await eliminarUsuario(id);
  revalidatePath("/admin/configuracion/usuarios");
}
