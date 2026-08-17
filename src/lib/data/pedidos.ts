import { prisma } from "@/lib/prisma";
import { toDecimalNumber } from "@/lib/data/decimal";
import type { AdminOrder, OrderStatus } from "@/lib/types";

function generarCodigoPedido(secuencia: number) {
  return `PED-${10000 + secuencia}`;
}

export interface CrearPedidoInput {
  cliente: {
    nombre: string;
    telefono: string;
    email?: string;
    direccion?: string;
    ciudad?: string;
  };
  lineas: { cajaId: string; cantidad: number; precioUnitario: number }[];
}

export async function crearPedido(input: CrearPedidoInput) {
  return prisma.$transaction(async (tx) => {
    // Si el cliente ya compró antes con el mismo correo, se reutiliza su
    // registro (para acumular historial de compras) en vez de duplicarlo.
    const datosCliente = {
      nombre: input.cliente.nombre,
      telefono: input.cliente.telefono,
      direccion: input.cliente.direccion,
      ciudad: input.cliente.ciudad,
    };
    const cliente = input.cliente.email
      ? await tx.cliente.upsert({
          where: { email: input.cliente.email },
          update: datosCliente,
          create: { ...datosCliente, email: input.cliente.email },
        })
      : await tx.cliente.create({ data: datosCliente });

    const totalEstimado = input.lineas.reduce(
      (acc, l) => acc + l.precioUnitario * l.cantidad,
      0
    );
    const conteo = await tx.pedido.count();
    const codigoPedido = generarCodigoPedido(conteo + 1);

    const fechaExpiracion = new Date();
    fechaExpiracion.setHours(fechaExpiracion.getHours() + 48);

    const pedido = await tx.pedido.create({
      data: {
        codigo_pedido: codigoPedido,
        cliente_id: cliente.id,
        estado: "Pendiente",
        total_estimado: totalEstimado,
        fecha_expiracion_reserva: fechaExpiracion,
        detalles: {
          create: input.lineas.map((l) => ({
            caja_id: l.cajaId,
            cantidad: l.cantidad,
            precio_unitario: l.precioUnitario,
          })),
        },
      },
    });

    for (const linea of input.lineas) {
      await tx.caja.update({
        where: { id: linea.cajaId },
        data: { stock_disponible: { decrement: linea.cantidad } },
      });
      await tx.movimientoInventario.create({
        data: {
          tipo_entidad: "Caja",
          entidad_id: linea.cajaId,
          cantidad_cambio: -linea.cantidad,
          motivo: "Reserva",
        },
      });
    }

    return { codigoPedido: pedido.codigo_pedido, pedidoId: pedido.id };
  });
}

export async function getPedidos(): Promise<AdminOrder[]> {
  const rows = await prisma.pedido.findMany({
    include: { cliente: true, detalles: true },
    orderBy: { fecha_creacion: "desc" },
  });

  return rows.map((p) => ({
    id: p.id,
    codigoPedido: p.codigo_pedido,
    cliente: p.cliente.nombre,
    fecha: p.fecha_creacion.toISOString().slice(0, 10),
    total: toDecimalNumber(p.total_estimado),
    items: p.detalles.reduce((acc, d) => acc + d.cantidad, 0),
    estado: p.estado as OrderStatus,
  }));
}
