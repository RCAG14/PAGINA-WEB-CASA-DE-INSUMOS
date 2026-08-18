import Link from "next/link";
import { AlertTriangle, Boxes, ClipboardList, DollarSign, PackageCheck } from "lucide-react";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { StatCard } from "@/components/admin/stat-card";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { StockByCategoryChart } from "@/components/admin/stock-by-category-chart";
import { TrafficAnalyticsSection } from "@/components/admin/traffic-analytics-section";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDashboardStats, getStockPorClasificacion, getCajasStockBajo } from "@/lib/data/dashboard";
import { getTraficoPorDia } from "@/lib/data/metricas";
import { getPedidos } from "@/lib/data/pedidos";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CajasDashboardPage() {
  const [stats, stockPorCategoria, stockBajo, pedidos, trafico] = await Promise.all([
    getDashboardStats(),
    getStockPorClasificacion(),
    getCajasStockBajo(),
    getPedidos(),
    getTraficoPorDia(30),
  ]);

  return (
    <>
      <AdminTopbar title="Dashboard" eyebrow="Gestión de Cajas Amazon y Retornos" />
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Ingresos registrados"
            value={formatPrice(stats.ingresosTotales)}
            icon={DollarSign}
            helper="Suma de pedidos no cancelados"
          />
          <StatCard
            label="Pedidos activos"
            value={String(stats.pedidosActivos)}
            icon={ClipboardList}
            helper="Pendientes, en preparación o enviados"
          />
          <StatCard
            label="Cajas en catálogo"
            value={String(stats.cajasCount)}
            icon={PackageCheck}
            helper={`${stats.stockTotal} unidades en stock`}
          />
          <StatCard
            label="Alertas de stock"
            value={String(stats.alertasStock)}
            icon={AlertTriangle}
            helper="SKU con menos de 15 unidades"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="border border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
                Stock disponible por clasificación
              </p>
              <Boxes className="size-4 text-muted-foreground" />
            </div>
            <StockByCategoryChart data={stockPorCategoria} />
          </div>

          <div className="border border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
                SKU con stock bajo
              </p>
              <Link
                href="/admin/cajas/inventario"
                className="font-mono-technical text-[10px] uppercase tracking-wider text-primary hover:underline"
              >
                Ver inventario
              </Link>
            </div>
            {stockBajo.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No hay cajas con stock bajo registradas.
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {stockBajo.map((box) => (
                  <li key={box.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium leading-tight">{box.nombre}</span>
                      <span className="font-mono-technical text-[10px] text-muted-foreground">
                        {box.sku_lote}
                      </span>
                    </div>
                    <span className="border border-destructive/40 bg-destructive/10 px-2 py-0.5 font-mono-technical text-[11px] font-semibold text-destructive">
                      {box.stock_disponible} u.
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
              Pedidos recientes
            </p>
            <Link
              href="/admin/cajas/pedidos"
              className="font-mono-technical text-[10px] uppercase tracking-wider text-primary hover:underline"
            >
              Ver todos
            </Link>
          </div>
          {pedidos.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Todavía no hay pedidos registrados en la base de datos.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                    Pedido
                  </TableHead>
                  <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                    Cliente
                  </TableHead>
                  <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                    Fecha
                  </TableHead>
                  <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                    Estado
                  </TableHead>
                  <TableHead className="text-right font-mono-technical text-[10px] uppercase tracking-wider">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.slice(0, 5).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono-technical text-xs">
                      {order.codigoPedido}
                    </TableCell>
                    <TableCell className="text-sm">{order.cliente}</TableCell>
                    <TableCell className="font-mono-technical text-xs text-muted-foreground">
                      {order.fecha}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge estado={order.estado} />
                    </TableCell>
                    <TableCell className="text-right font-mono-technical text-xs font-semibold">
                      {formatPrice(order.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <TrafficAnalyticsSection dataCajas={trafico.cajas} dataWebdev={trafico.webdev} />
      </div>
    </>
  );
}
