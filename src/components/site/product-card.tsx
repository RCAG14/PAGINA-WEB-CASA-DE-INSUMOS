"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoxVisual } from "@/components/site/box-visual";
import { BoxTypeBadge } from "@/components/site/box-type-badge";
import { ClassificationBadge } from "@/components/site/classification-badge";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import type { Box } from "@/lib/types";

export function ProductCard({ box }: { box: Box }) {
  const { addBox } = useCart();
  const [added, setAdded] = useState(false);
  const margen =
    box.valorRetailEstimado > box.precio
      ? Math.round(((box.valorRetailEstimado - box.precio) / box.precio) * 100)
      : null;

  function handleQuickAdd() {
    addBox(box, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="group flex flex-col border border-border bg-card">
      <Link href={`/productos/${box.slug}`} className="block">
        <BoxVisual box={box} className="transition-opacity group-hover:opacity-90" />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <ClassificationBadge clasificacion={box.clasificacion} />
          <BoxTypeBadge tipo={box.tipo} />
        </div>

        <Link href={`/productos/${box.slug}`}>
          <h3 className="font-heading text-sm font-semibold leading-snug text-foreground hover:text-primary">
            {box.nombre}
          </h3>
        </Link>

        <p className="line-clamp-2 text-xs text-muted-foreground">
          {box.descripcionCorta}
        </p>

        <div className="flex items-center justify-between font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>Stock: {box.stock}</span>
          {margen !== null && <span className="font-semibold text-primary">+{margen}% margen</span>}
        </div>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex flex-col">
            {margen !== null && (
              <span className="font-mono-technical text-[11px] text-muted-foreground line-through">
                {formatPrice(box.valorRetailEstimado)}
              </span>
            )}
            <span className="font-mono-technical text-base font-semibold text-primary">
              {formatPrice(box.precio)}
            </span>
          </div>
          <Button
            size="icon"
            variant={added ? "secondary" : "default"}
            aria-label="Agregar al carrito"
            onClick={handleQuickAdd}
          >
            {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
