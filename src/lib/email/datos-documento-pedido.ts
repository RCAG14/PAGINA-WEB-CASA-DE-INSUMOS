import { prisma } from "@/lib/prisma";
import { toDecimalNumber } from "@/lib/data/decimal";
import { getLogo } from "@/lib/data/landing";

export interface LineaDocumento {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface DatosDocumentoPedido {
  codigoPedido: string;
  clienteNombre: string;
  clienteEmail: string;
  lugarEntrega: string;
  fecha: string;
  lineas: LineaDocumento[];
  total: number;
  logoUrl: string | null;
}

const fechaFormatter = new Intl.DateTimeFormat("es-BO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

/** Datos compartidos por la cotización y el recibo de compra de un pedido. */
export async function obtenerDatosDocumentoPedido(
  pedidoId: string
): Promise<DatosDocumentoPedido | null> {
  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId },
    include: { cliente: true, detalles: { include: { caja: true } } },
  });

  if (!pedido || !pedido.cliente.email) return null;

  const logo = await getLogo();

  return {
    codigoPedido: pedido.codigo_pedido,
    clienteNombre: pedido.cliente.nombre,
    clienteEmail: pedido.cliente.email,
    lugarEntrega: pedido.cliente.ciudad || pedido.cliente.direccion || "A coordinar",
    fecha: fechaFormatter.format(pedido.fecha_creacion),
    lineas: pedido.detalles.map((d) => {
      const precioUnitario = toDecimalNumber(d.precio_unitario);
      return {
        nombre: d.caja.nombre,
        cantidad: d.cantidad,
        precioUnitario,
        subtotal: precioUnitario * d.cantidad,
      };
    }),
    total: toDecimalNumber(pedido.total_estimado),
    logoUrl: logo?.url ?? null,
  };
}
