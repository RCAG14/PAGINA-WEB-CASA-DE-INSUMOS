"use server";

import { revalidatePath } from "next/cache";
import { actualizarEstadoPedido } from "@/lib/data/pedidos";
import type { OrderStatus } from "@/lib/types";

export async function actualizarEstadoPedidoAction(id: string, nuevoEstado: OrderStatus) {
  await actualizarEstadoPedido(id, nuevoEstado);
  revalidatePath("/admin/cajas/pedidos");
  revalidatePath("/admin/cajas/inventario");
  revalidatePath("/admin/cajas");
  revalidatePath("/admin");
  revalidatePath("/cajas-devoluciones-amazon-bolivia");
  revalidatePath("/");
}
