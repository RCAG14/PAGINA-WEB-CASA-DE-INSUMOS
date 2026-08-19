import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pendiente: "border-border text-muted-foreground",
  "En Preparación": "border-accent text-primary bg-accent/15",
  Enviado: "border-primary/40 text-primary bg-primary/5",
  Entregado: "border-primary bg-primary text-primary-foreground",
  Cancelado: "border-destructive/40 text-destructive bg-destructive/10",
};

export function OrderStatusBadge({ estado }: { estado: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider",
        STATUS_STYLES[estado]
      )}
    >
      {estado}
    </span>
  );
}
