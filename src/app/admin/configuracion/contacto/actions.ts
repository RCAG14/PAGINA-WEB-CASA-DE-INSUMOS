"use server";

import { revalidatePath } from "next/cache";
import {
  actualizarNumeroContacto,
  actualizarRedSocial,
  crearNumeroContacto,
  crearRedSocial,
  eliminarNumeroContacto,
  eliminarRedSocial,
  type NumeroContactoInput,
  type RedSocialInput,
} from "@/lib/data/contacto";
import { verifyJefe } from "@/lib/auth/dal";

function revalidarTodo() {
  revalidatePath("/admin/configuracion/contacto");
  revalidatePath("/");
  revalidatePath("/cajas-devoluciones-amazon-bolivia");
  revalidatePath("/checkout");
}

export async function crearRedSocialAction(input: RedSocialInput) {
  await verifyJefe();
  await crearRedSocial(input);
  revalidarTodo();
}

export async function actualizarRedSocialAction(id: string, input: RedSocialInput) {
  await verifyJefe();
  await actualizarRedSocial(id, input);
  revalidarTodo();
}

export async function eliminarRedSocialAction(id: string) {
  await verifyJefe();
  await eliminarRedSocial(id);
  revalidarTodo();
}

export async function crearNumeroContactoAction(input: NumeroContactoInput) {
  await verifyJefe();
  await crearNumeroContacto(input);
  revalidarTodo();
}

export async function actualizarNumeroContactoAction(id: string, input: NumeroContactoInput) {
  await verifyJefe();
  await actualizarNumeroContacto(id, input);
  revalidarTodo();
}

export async function eliminarNumeroContactoAction(id: string) {
  await verifyJefe();
  await eliminarNumeroContacto(id);
  revalidarTodo();
}
