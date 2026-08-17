import { DollarSign, Package, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { DescargarReportePdfButton } from "@/components/admin/descargar-reporte-pdf-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getProductosMasVendidos,
  getUsuariosRegistrados,
  getVentasTotales,
  getVisitasEstimadas,
} from "@/lib/data/metricas";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SocioDashboardPage() {
  const [ventas, usuariosRegistrados, visitas, productos] = await Promise.all([
    getVentasTotales(),
    getUsuariosRegistrados(),
    getVisitasEstimadas(),
    getProductosMasVendidos(5),
  ]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
            Métricas
          </span>
          <h2 className="font-heading text-xl font-semibold sm:text-2xl">
            Resumen de desempeño
          </h2>
          <p className="text-sm text-muted-foreground">
            Vista de solo lectura. No puedes crear, editar ni eliminar cajas ni pedidos desde
            este panel.
          </p>
        </div>
        <DescargarReportePdfButton
          data={{
            totalVentas: ventas.totalVentas,
            cantidadPedidos: ventas.cantidadPedidos,
            usuariosRegistrados,
            visitasTotal: visitas.total,
            visitas30Dias: visitas.ultimos30Dias,
            productos,
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Ventas totales"
          value={formatPrice(ventas.totalVentas)}
          icon={DollarSign}
          helper={`${ventas.cantidadPedidos} pedidos registrados`}
        />
        <StatCard
          label="Usuarios registrados"
          value={String(usuariosRegistrados)}
          icon={Users}
          helper="Clientes con al menos un pedido"
        />
        <StatCard
          label="Tráfico estimado"
          value={String(visitas.total)}
          icon={TrendingUp}
          helper={`${visitas.ultimos30Dias} visitas en los últimos 30 días`}
        />
        <StatCard
          label="Cajas en el top"
          value={String(productos.length)}
          icon={ShoppingBag}
          helper="Productos más vendidos listados abajo"
        />
      </div>

      <div className="border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
            Cajas más vendidas
          </p>
          <Package className="size-4 text-muted-foreground" />
        </div>
        {productos.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Todavía no hay ventas registradas.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                  Caja
                </TableHead>
                <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                  SKU
                </TableHead>
                <TableHead className="text-right font-mono-technical text-[10px] uppercase tracking-wider">
                  Unidades vendidas
                </TableHead>
                <TableHead className="text-right font-mono-technical text-[10px] uppercase tracking-wider">
                  Ingreso generado
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((p) => (
                <TableRow key={p.cajaId}>
                  <TableCell className="text-sm font-medium">{p.nombre}</TableCell>
                  <TableCell className="font-mono-technical text-xs text-muted-foreground">
                    {p.skuLote}
                  </TableCell>
                  <TableCell className="text-right font-mono-technical text-xs font-semibold">
                    {p.unidadesVendidas}
                  </TableCell>
                  <TableCell className="text-right font-mono-technical text-xs font-semibold text-primary">
                    {formatPrice(p.ingresoGenerado)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
