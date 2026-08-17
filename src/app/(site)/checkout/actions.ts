"use server";

import { crearPedido } from "@/lib/data/pedidos";

export interface CheckoutClienteInput {
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
}

export interface CheckoutLineaInput {
  cajaId: string;
  cantidad: number;
  precioUnitario: number;
}

export async function confirmarPedido(
  cliente: CheckoutClienteInput,
  lineas: CheckoutLineaInput[]
) {
  const { codigoPedido } = await crearPedido({
    cliente,
    lineas: lineas.map((l) => ({
      cajaId: l.cajaId,
      cantidad: l.cantidad,
      precioUnitario: l.precioUnitario,
    })),
  });
  return codigoPedido;
}
