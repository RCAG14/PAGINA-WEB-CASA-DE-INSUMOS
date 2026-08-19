import { Mail, Star } from "lucide-react";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { Panel } from "@/components/admin/panel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getClientesConHistorial } from "@/lib/data/clientes";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminClientesPage() {
  const clientes = await getClientesConHistorial();

  return (
    <>
      <AdminTopbar title="Clientes" eyebrow="Gestión de Cajas Amazon y Retornos" />
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Historial de compras por cliente, agrupado por correo desde el checkout. Útil para ver
          preferencias y quiénes son tus compradores recurrentes.
        </p>

        <Panel>
          {clientes.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Todavía no hay clientes. Se registran automáticamente desde el checkout.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                    Cliente
                  </TableHead>
                  <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                    Contacto
                  </TableHead>
                  <TableHead className="text-center font-mono-technical text-[10px] uppercase tracking-wider">
                    Pedidos
                  </TableHead>
                  <TableHead className="text-right font-mono-technical text-[10px] uppercase tracking-wider">
                    Total gastado
                  </TableHead>
                  <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                    Producto favorito
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="text-sm font-medium">{c.nombre}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        {c.email && (
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="size-3" strokeWidth={1.5} />
                            {c.email}
                          </span>
                        )}
                        <span className="font-mono-technical text-[10px] text-muted-foreground">
                          {c.telefono}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono-technical text-xs">
                      {c.totalPedidos}
                    </TableCell>
                    <TableCell className="text-right font-mono-technical text-xs font-semibold text-primary">
                      {formatPrice(c.totalGastado)}
                    </TableCell>
                    <TableCell>
                      {c.productoFavorito ? (
                        <span className="flex items-center gap-1.5 text-xs">
                          <Star className="size-3 text-accent" strokeWidth={1.5} />
                          {c.productoFavorito}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Panel>
      </div>
    </>
  );
}
