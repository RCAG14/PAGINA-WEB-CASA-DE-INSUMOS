"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { actualizarEstadoPedidoAction } from "@/app/admin/cajas/pedidos/actions";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUSES, type AdminOrder, type OrderStatus } from "@/lib/types";

interface PendingAction {
  id: string;
  codigoPedido: string;
  estadoActual: OrderStatus;
  nuevoEstado: OrderStatus;
}

export function PedidosTable({ pedidos }: { pedidos: AdminOrder[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  function handleConfirm() {
    if (!pendingAction) return;
    const { id, nuevoEstado } = pendingAction;
    setError(null);
    setUpdatingId(id);
    setPendingAction(null);
    startTransition(async () => {
      try {
        await actualizarEstadoPedidoAction(id, nuevoEstado);
        router.refresh();
      } catch {
        setError("No se pudo actualizar el estado del pedido. Intentá de nuevo.");
      } finally {
        setUpdatingId(null);
      }
    });
  }

  const involucraStock =
    pendingAction?.nuevoEstado === "Cancelado" || pendingAction?.estadoActual === "Cancelado";

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p className="border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
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
            <TableHead className="text-right font-mono-technical text-[10px] uppercase tracking-wider">
              Cambiar estado
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((order) => {
            const pendienteDeEste = isPending && updatingId === order.id;
            return (
              <TableRow key={order.id}>
                <TableCell className="font-mono-technical text-xs">{order.codigoPedido}</TableCell>
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
                <TableCell>
                  <div className="flex justify-end">
                    <Select
                      value={order.estado}
                      disabled={pendienteDeEste}
                      onValueChange={(value) => {
                        if (!value || value === order.estado) return;
                        setPendingAction({
                          id: order.id,
                          codigoPedido: order.codigoPedido,
                          estadoActual: order.estado,
                          nuevoEstado: value as OrderStatus,
                        });
                      }}
                    >
                      <SelectTrigger className="w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((estado) => (
                          <SelectItem key={estado} value={estado}>
                            {estado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog
        open={pendingAction !== null}
        onOpenChange={(open) => {
          if (!open) setPendingAction(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cambiar el estado del pedido?</DialogTitle>
            <DialogDescription>
              El pedido <strong>{pendingAction?.codigoPedido}</strong> pasará de{" "}
              <strong>{pendingAction?.estadoActual}</strong> a{" "}
              <strong>{pendingAction?.nuevoEstado}</strong>.
              {involucraStock &&
                (pendingAction?.nuevoEstado === "Cancelado"
                  ? " Se repondrá el stock reservado de las cajas de este pedido."
                  : " Se volverá a descontar el stock reservado de las cajas de este pedido.")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingAction(null)}>
              Volver
            </Button>
            <Button
              variant={pendingAction?.nuevoEstado === "Cancelado" ? "destructive" : "default"}
              onClick={handleConfirm}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
