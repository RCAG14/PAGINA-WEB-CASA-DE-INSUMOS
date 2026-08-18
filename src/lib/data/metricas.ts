import { prisma } from "@/lib/prisma";
import { toDecimalNumber } from "@/lib/data/decimal";

export async function getVentasTotales() {
  const agg = await prisma.pedido.aggregate({
    _sum: { total_estimado: true },
    _count: true,
    where: { estado: { not: "Cancelado" } },
  });

  return {
    totalVentas: toDecimalNumber(agg._sum.total_estimado ?? 0),
    cantidadPedidos: agg._count,
  };
}

export async function getUsuariosRegistrados() {
  return prisma.cliente.count();
}

export async function getVisitasEstimadas() {
  const [total, ultimos30Dias] = await Promise.all([
    prisma.metricaVisita.count(),
    prisma.metricaVisita.count({
      where: { creado_en: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    }),
  ]);
  return { total, ultimos30Dias };
}

export interface PuntoTrafico {
  fecha: string;
  visitas: number;
}

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Serie diaria de visitas de los últimos `dias`, separada por negocio a
 * partir del prefijo de ruta (no hay tracking por sitio, así que se infiere:
 * `/desarrollo-web/*` es Páginas Web, el resto es Cajas). Una sola consulta
 * y agregación en memoria — el volumen de `metricas_visita` es chico y no
 * hay precedente de `$queryRaw` en el proyecto.
 */
export async function getTraficoPorDia(
  dias = 30
): Promise<{ cajas: PuntoTrafico[]; webdev: PuntoTrafico[] }> {
  const desde = new Date();
  desde.setUTCHours(0, 0, 0, 0);
  desde.setUTCDate(desde.getUTCDate() - (dias - 1));

  const visitas = await prisma.metricaVisita.findMany({
    where: { creado_en: { gte: desde } },
    select: { ruta: true, creado_en: true },
  });

  const conteoCajas = new Map<string, number>();
  const conteoWebdev = new Map<string, number>();
  for (const v of visitas) {
    const conteo = v.ruta.startsWith("/desarrollo-web") ? conteoWebdev : conteoCajas;
    const key = dayKey(v.creado_en);
    conteo.set(key, (conteo.get(key) ?? 0) + 1);
  }

  const cajas: PuntoTrafico[] = [];
  const webdev: PuntoTrafico[] = [];
  for (let i = 0; i < dias; i++) {
    const d = new Date(desde);
    d.setUTCDate(d.getUTCDate() + i);
    const key = dayKey(d);
    cajas.push({ fecha: key, visitas: conteoCajas.get(key) ?? 0 });
    webdev.push({ fecha: key, visitas: conteoWebdev.get(key) ?? 0 });
  }

  return { cajas, webdev };
}

export interface ProductoMasVendido {
  cajaId: string;
  nombre: string;
  skuLote: string;
  unidadesVendidas: number;
  ingresoGenerado: number;
}

export async function getProductosMasVendidos(limite = 5): Promise<ProductoMasVendido[]> {
  const agrupado = await prisma.pedidoDetalle.groupBy({
    by: ["caja_id"],
    _sum: { cantidad: true, precio_unitario: true },
    orderBy: { _sum: { cantidad: "desc" } },
    take: limite,
  });

  if (agrupado.length === 0) return [];

  const cajas = await prisma.caja.findMany({
    where: { id: { in: agrupado.map((g) => g.caja_id) } },
    select: { id: true, nombre: true, sku_lote: true },
  });
  const cajaPorId = new Map(cajas.map((c) => [c.id, c]));

  // Ingreso real por caja (precio_unitario varía por línea, así que se recalcula sumando las líneas).
  const detalles = await prisma.pedidoDetalle.findMany({
    where: { caja_id: { in: agrupado.map((g) => g.caja_id) } },
    select: { caja_id: true, cantidad: true, precio_unitario: true },
  });
  const ingresoPorCaja = new Map<string, number>();
  for (const d of detalles) {
    const actual = ingresoPorCaja.get(d.caja_id) ?? 0;
    ingresoPorCaja.set(d.caja_id, actual + toDecimalNumber(d.precio_unitario) * d.cantidad);
  }

  return agrupado.map((g) => {
    const caja = cajaPorId.get(g.caja_id);
    return {
      cajaId: g.caja_id,
      nombre: caja?.nombre ?? "Caja eliminada",
      skuLote: caja?.sku_lote ?? "—",
      unidadesVendidas: g._sum.cantidad ?? 0,
      ingresoGenerado: ingresoPorCaja.get(g.caja_id) ?? 0,
    };
  });
}
