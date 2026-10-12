import Image from "next/image";
import { CLASSIFICATION_ICON_MAP } from "@/lib/classification-icons";
import { cn } from "@/lib/utils";
import type { CartLine } from "@/lib/types";

/** Miniatura de una línea del carrito: la foto de la caja o, si no hay, el ícono de su categoría. */
export function CartThumb({ line, className }: { line: CartLine; className?: string }) {
  const Icon = CLASSIFICATION_ICON_MAP[line.clasificacionIcono];
  return (
    <div
      className={cn(
        "relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-secondary",
        className
      )}
    >
      {line.imagenUrl ? (
        <Image src={line.imagenUrl} alt="" fill sizes="64px" className="object-cover" />
      ) : (
        <Icon className="size-6 text-primary" strokeWidth={1.5} />
      )}
    </div>
  );
}
