"use server";

import { revalidatePath } from "next/cache";
import {
  actualizarExtraDesarrollo,
  actualizarOrdenExtraDesarrollo,
  crearExtraDesarrollo,
  eliminarExtraDesarrollo,
  type ExtraDesarrolloInput,
  actualizarOrdenPaqueteDesarrollo,
  actualizarOrdenTrabajoRealizado,
  actualizarPaqueteDesarrollo,
  actualizarTrabajoRealizado,
  crearPaqueteDesarrollo,
  crearTrabajoRealizado,
  eliminarPaqueteDesarrollo,
  eliminarTrabajoRealizado,
  type PaqueteDesarrolloInput,
  type TrabajoRealizadoInput,
} from "@/lib/data/desarrollo";
import { verifyJefe } from "@/lib/auth/dal";

function revalidarTodo() {
  revalidatePath("/admin/desarrollo-web");
  revalidatePath("/desarrollo-web");
}

export async function crearPaqueteDesarrolloAction(input: PaqueteDesarrolloInput) {
  await verifyJefe();
  await crearPaqueteDesarrollo(input);
  revalidarTodo();
}

export async function actualizarPaqueteDesarrolloAction(
  id: string,
  input: PaqueteDesarrolloInput
) {
  await verifyJefe();
  await actualizarPaqueteDesarrollo(id, input);
  revalidarTodo();
}

export async function eliminarPaqueteDesarrolloAction(id: string) {
  await verifyJefe();
  await eliminarPaqueteDesarrollo(id);
  revalidarTodo();
}

export async function reordenarPaqueteDesarrolloAction(
  idA: string,
  ordenA: number,
  idB: string,
  ordenB: number
) {
  await verifyJefe();
  await Promise.all([
    actualizarOrdenPaqueteDesarrollo(idA, ordenB),
    actualizarOrdenPaqueteDesarrollo(idB, ordenA),
  ]);
  revalidarTodo();
}

export async function crearExtraDesarrolloAction(input: ExtraDesarrolloInput) {
  await verifyJefe();
  await crearExtraDesarrollo(input);
  revalidarTodo();
}

export async function actualizarExtraDesarrolloAction(id: string, input: ExtraDesarrolloInput) {
  await verifyJefe();
  await actualizarExtraDesarrollo(id, input);
  revalidarTodo();
}

export async function eliminarExtraDesarrolloAction(id: string) {
  await verifyJefe();
  await eliminarExtraDesarrollo(id);
  revalidarTodo();
}

export async function reordenarExtraDesarrolloAction(
  idA: string,
  ordenA: number,
  idB: string,
  ordenB: number
) {
  await verifyJefe();
  await Promise.all([
    actualizarOrdenExtraDesarrollo(idA, ordenB),
    actualizarOrdenExtraDesarrollo(idB, ordenA),
  ]);
  revalidarTodo();
}

export async function crearTrabajoRealizadoAction(input: TrabajoRealizadoInput) {
  await verifyJefe();
  await crearTrabajoRealizado(input);
  revalidarTodo();
}

export async function actualizarTrabajoRealizadoAction(
  id: string,
  input: TrabajoRealizadoInput
) {
  await verifyJefe();
  await actualizarTrabajoRealizado(id, input);
  revalidarTodo();
}

export async function eliminarTrabajoRealizadoAction(id: string) {
  await verifyJefe();
  await eliminarTrabajoRealizado(id);
  revalidarTodo();
}

export async function reordenarTrabajoRealizadoAction(
  idA: string,
  ordenA: number,
  idB: string,
  ordenB: number
) {
  await verifyJefe();
  await Promise.all([
    actualizarOrdenTrabajoRealizado(idA, ordenB),
    actualizarOrdenTrabajoRealizado(idB, ordenA),
  ]);
  revalidarTodo();
}
