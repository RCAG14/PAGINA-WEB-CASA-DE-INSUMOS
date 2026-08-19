import { AdminTopbar } from "@/components/admin/admin-topbar";
import { PedidosTable } from "@/components/admin/pedidos-table";
import { Panel } from "@/components/admin/panel";
import { getPedidos } from "@/lib/data/pedidos";

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
        <Panel>
          {pedidos.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Todavía no hay pedidos. Se crean automáticamente desde el checkout de la tienda.
            </p>
          ) : (
            <PedidosTable pedidos={pedidos} />
          )}
        </Panel>
      </div>
    </>
  );
}
