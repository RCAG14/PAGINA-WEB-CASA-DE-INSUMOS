import { ListChecks, ShieldQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Box } from "@/lib/types";

export function BoxTypeBadge({
  tipo,
  className,
}: {
  tipo: Box["tipo"];
  className?: string;
}) {
  const isSurprise = tipo === "sorpresa";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border px-2 py-0.5 font-mono-technical text-[10px] font-medium uppercase tracking-wider",
        isSurprise
          ? "border-dashed border-accent text-primary bg-accent/15"
          : "border-primary/30 bg-primary text-primary-foreground",
        className
      )}
    >
      {isSurprise ? (
        <ShieldQuestion className="size-3" />
      ) : (
        <ListChecks className="size-3" />
      )}
      {isSurprise ? "Caja sorpresa" : "Caja listada"}
    </span>
  );
}
