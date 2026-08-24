"use server";

import { revalidatePath } from "next/cache";
import {
  actualizarContenidoLanding,
  actualizarOrdenContenidoLanding,
  crearContenidoLanding,
  eliminarContenidoLanding,
  type ContenidoLandingInput,
} from "@/lib/data/landing";
import { verifyJefe } from "@/lib/auth/dal";

function revalidarTodo() {
  revalidatePath("/admin/configuracion/landing");
  revalidatePath("/");
  revalidatePath("/cajas-devoluciones-amazon-bolivia");
}

export async function crearContenidoLandingAction(input: ContenidoLandingInput) {
  await verifyJefe();
  await crearContenidoLanding(input);
  revalidarTodo();
}

export async function actualizarContenidoLandingAction(id: string, input: ContenidoLandingInput) {
  await verifyJefe();
  await actualizarContenidoLanding(id, input);
  revalidarTodo();
}

export async function eliminarContenidoLandingAction(id: string) {
  await verifyJefe();
  await eliminarContenidoLanding(id);
  revalidarTodo();
}

export async function reordenarContenidoLandingAction(
  idA: string,
  ordenA: number,
  idB: string,
  ordenB: number
) {
  await verifyJefe();
  await Promise.all([
    actualizarOrdenContenidoLanding(idA, ordenB),
    actualizarOrdenContenidoLanding(idB, ordenA),
  ]);
  revalidarTodo();
}
