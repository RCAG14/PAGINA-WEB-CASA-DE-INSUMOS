import { prisma } from "@/lib/prisma";
import { toDecimalNumber } from "@/lib/data/decimal";
import { enviarDocumentoPedido } from "@/lib/email/enviar-documento-pedido";
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
  const resultado = await prisma.$transaction(async (tx) => {
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

  // El pedido nace en "Pendiente": se envía la cotización fuera de la
  // transacción para no bloquear el checkout si el correo tarda o falla.
  await enviarDocumentoPedido(resultado.pedidoId, "cotizacion");

  return resultado;
}

const pedidoSelect = {
  id: true,
  codigo_pedido: true,
  fecha_creacion: true,
  total_estimado: true,
  estado: true,
  cliente: { select: { nombre: true } },
  detalles: { select: { cantidad: true } },
} as const;

function toAdminOrder(p: {
  id: string;
  codigo_pedido: string;
  fecha_creacion: Date;
  total_estimado: unknown;
  estado: string;
  cliente: { nombre: string };
  detalles: { cantidad: number }[];
}): AdminOrder {
  return {
    id: p.id,
    codigoPedido: p.codigo_pedido,
    cliente: p.cliente.nombre,
    fecha: p.fecha_creacion.toISOString().slice(0, 10),
    total: toDecimalNumber(p.total_estimado),
    items: p.detalles.reduce((acc, d) => acc + d.cantidad, 0),
    estado: p.estado as OrderStatus,
  };
}

export async function getPedidos(): Promise<AdminOrder[]> {
  const rows = await prisma.pedido.findMany({
    select: pedidoSelect,
    orderBy: { fecha_creacion: "desc" },
  });

  return rows.map(toAdminOrder);
}

/** Solo los `limite` pedidos más recientes — usado por el dashboard, que no necesita la tabla completa. */
export async function getPedidosRecientes(limite = 5): Promise<AdminOrder[]> {
  const rows = await prisma.pedido.findMany({
    select: pedidoSelect,
    orderBy: { fecha_creacion: "desc" },
    take: limite,
  });

  return rows.map(toAdminOrder);
}

export async function actualizarEstadoPedido(id: string, nuevoEstado: OrderStatus) {
  const pedido = await prisma.pedido.findUniqueOrThrow({
    where: { id },
    include: { detalles: true },
  });

  if (pedido.estado === nuevoEstado) return;

  // El estado se puede corregir en cualquier momento (p.ej. si se marcó
  // "Entregado" o "Cancelado" por error). Solo Cancelado afecta el stock,
  // así que se ajusta la reserva al entrar o salir de ese estado.
  const entrandoACancelado = nuevoEstado === "Cancelado";
  const saliendoDeCancelado = pedido.estado === "Cancelado";

  await prisma.$transaction(async (tx) => {
    if (entrandoACancelado) {
      for (const detalle of pedido.detalles) {
        await tx.caja.update({
          where: { id: detalle.caja_id },
          data: { stock_disponible: { increment: detalle.cantidad } },
        });
        await tx.movimientoInventario.create({
          data: {
            tipo_entidad: "Caja",
            entidad_id: detalle.caja_id,
            cantidad_cambio: detalle.cantidad,
            motivo: "Cancelacion",
          },
        });
      }
    } else if (saliendoDeCancelado) {
      for (const detalle of pedido.detalles) {
        const resultado = await tx.caja.updateMany({
          where: { id: detalle.caja_id, stock_disponible: { gte: detalle.cantidad } },
          data: { stock_disponible: { decrement: detalle.cantidad } },
        });
        if (resultado.count === 0) {
          throw new Error(
            "No hay stock suficiente para volver a reservar este pedido cancelado."
          );
        }
        await tx.movimientoInventario.create({
          data: {
            tipo_entidad: "Caja",
            entidad_id: detalle.caja_id,
            cantidad_cambio: -detalle.cantidad,
            motivo: "Reserva",
          },
        });
      }
    }

    await tx.pedido.update({
      where: { id },
      data: { estado: nuevoEstado },
    });
  });

  // Cotización al entrar/volver a "Pendiente" o al pasar a "En Preparación";
  // recibo de compra al marcar "Entregado". Ambos correos van solo al
  // cliente (ver enviarDocumentoPedido).
  if (nuevoEstado === "Pendiente" || nuevoEstado === "En Preparación") {
    await enviarDocumentoPedido(id, "cotizacion");
  } else if (nuevoEstado === "Entregado") {
    await enviarDocumentoPedido(id, "recibo");
  }
}
