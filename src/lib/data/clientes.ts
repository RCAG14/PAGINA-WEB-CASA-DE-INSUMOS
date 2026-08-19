import { prisma } from "@/lib/prisma";
import { toDecimalNumber } from "@/lib/data/decimal";

export interface ClienteConHistorial {
  id: string;
  nombre: string;
  email: string | null;
  telefono: string;
  totalPedidos: number;
  totalGastado: number;
  productoFavorito: string | null;
}

export async function getClientesConHistorial(): Promise<ClienteConHistorial[]> {
  const clientes = await prisma.cliente.findMany({
    select: {
      id: true,
      nombre: true,
      email: true,
      telefono: true,
      pedidos: {
        select: {
          estado: true,
          total_estimado: true,
          detalles: { select: { cantidad: true, caja: { select: { nombre: true } } } },
        },
      },
    },
    orderBy: { creado_en: "desc" },
  });

  return clientes.map((c) => {
    const totalGastado = c.pedidos
      .filter((p) => p.estado !== "Cancelado")
      .reduce((acc, p) => acc + toDecimalNumber(p.total_estimado), 0);

    const cantidadPorCaja = new Map<string, number>();
    for (const p of c.pedidos) {
      for (const d of p.detalles) {
        cantidadPorCaja.set(d.caja.nombre, (cantidadPorCaja.get(d.caja.nombre) ?? 0) + d.cantidad);
      }
    }
    const favorito = [...cantidadPorCaja.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return {
      id: c.id,
      nombre: c.nombre,
      email: c.email,
      telefono: c.telefono,
      totalPedidos: c.pedidos.length,
      totalGastado,
      productoFavorito: favorito,
    };
  });
}
