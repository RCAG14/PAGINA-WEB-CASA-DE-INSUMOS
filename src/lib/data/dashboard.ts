import { prisma } from "@/lib/prisma";
import { toDecimalNumber } from "@/lib/data/decimal";

export async function getDashboardStats() {
  const [ingresosAgg, pedidosActivos, stockAgg, cajasCount, alertasStock] = await Promise.all([
    prisma.pedido.aggregate({
      _sum: { total_estimado: true },
      where: { estado: { not: "Cancelado" } },
    }),
    prisma.pedido.count({
      where: { estado: { in: ["Pendiente", "En Preparación", "Enviado"] } },
    }),
    prisma.caja.aggregate({ _sum: { stock_disponible: true } }),
    prisma.caja.count(),
    prisma.caja.count({ where: { stock_disponible: { lt: 15 } } }),
  ]);

  return {
    ingresosTotales: toDecimalNumber(ingresosAgg._sum.total_estimado ?? 0),
    pedidosActivos,
    stockTotal: stockAgg._sum.stock_disponible ?? 0,
    cajasCount,
    alertasStock,
  };
}

export async function getStockPorClasificacion() {
  const clasificaciones = await prisma.clasificacion.findMany({
    include: { cajas: { select: { stock_disponible: true } } },
    orderBy: { nombre: "asc" },
  });

  return clasificaciones.map((c) => ({
    categoria: c.nombre,
    stock: c.cajas.reduce((acc, caja) => acc + caja.stock_disponible, 0),
  }));
}

export async function getCajasStockBajo(limite = 15) {
  return prisma.caja.findMany({
    where: { stock_disponible: { lt: limite } },
    orderBy: { stock_disponible: "asc" },
    select: { id: true, nombre: true, sku_lote: true, stock_disponible: true },
  });
}
