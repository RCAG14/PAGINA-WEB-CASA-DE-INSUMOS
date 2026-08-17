import { AdminTopbar } from "@/components/admin/admin-topbar";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPedidos } from "@/lib/data/pedidos";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPedidosPage() {
  const pedidos = await getPedidos();

  return (
    <>
      <AdminTopbar title="Pedidos" eyebrow="Gestión de Cajas Amazon y Retornos" />
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
          {pedidos.length.toString().padStart(2, "0")} pedidos registrados en la base de datos
        </p>
        <div className="border border-border bg-card">
          {pedidos.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Todavía no hay pedidos. Se crean automáticamente desde el checkout de la tienda.
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
                  <TableHead className="text-center font-mono-technical text-[10px] uppercase tracking-wider">
                    Cajas
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
                {pedidos.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono-technical text-xs">
                      {order.codigoPedido}
                    </TableCell>
                    <TableCell className="text-sm">{order.cliente}</TableCell>
                    <TableCell className="font-mono-technical text-xs text-muted-foreground">
                      {order.fecha}
                    </TableCell>
                    <TableCell className="text-center font-mono-technical text-xs">
                      {order.items}
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
      </div>
    </>
  );
}
