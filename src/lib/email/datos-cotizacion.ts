import { prisma } from "@/lib/prisma";
import { toDecimalNumber } from "@/lib/data/decimal";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import { getLogo } from "@/lib/data/landing";

export interface LineaCotizacion {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface DatosCotizacionPedido {
  codigoPedido: string;
  clienteNombre: string;
  clienteEmail: string;
  lugarEntrega: string;
  fecha: string;
  lineas: LineaCotizacion[];
  total: number;
  whatsapp: string | null;
  logoUrl: string | null;
}

const fechaFormatter = new Intl.DateTimeFormat("es-BO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export async function obtenerDatosCotizacionPedido(
  pedidoId: string
): Promise<DatosCotizacionPedido | null> {
  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId },
    include: { cliente: true, detalles: { include: { caja: true } } },
  });

  if (!pedido || !pedido.cliente.email) return null;

  const [whatsapp, logo] = await Promise.all([getNumeroWhatsappPrincipal(), getLogo()]);

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
    whatsapp,
    logoUrl: logo?.url ?? null,
  };
}
