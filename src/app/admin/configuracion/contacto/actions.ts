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

function revalidarTodo() {
  revalidatePath("/admin/configuracion/contacto");
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/checkout");
}

export async function crearRedSocialAction(input: RedSocialInput) {
  await crearRedSocial(input);
  revalidarTodo();
}

export async function actualizarRedSocialAction(id: string, input: RedSocialInput) {
  await actualizarRedSocial(id, input);
  revalidarTodo();
}

export async function eliminarRedSocialAction(id: string) {
  await eliminarRedSocial(id);
  revalidarTodo();
}

export async function crearNumeroContactoAction(input: NumeroContactoInput) {
  await crearNumeroContacto(input);
  revalidarTodo();
}

export async function actualizarNumeroContactoAction(id: string, input: NumeroContactoInput) {
  await actualizarNumeroContacto(id, input);
  revalidarTodo();
}

export async function eliminarNumeroContactoAction(id: string) {
  await eliminarNumeroContacto(id);
  revalidarTodo();
}
