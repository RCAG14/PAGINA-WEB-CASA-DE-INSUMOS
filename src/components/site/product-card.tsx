"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoxVisual } from "@/components/site/box-visual";
import { BoxTypeBadge } from "@/components/site/box-type-badge";
import { ClassificationBadge } from "@/components/site/classification-badge";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n/locale-context";
import type { Box } from "@/lib/types";

export function ProductCard({ box }: { box: Box }) {
  const { addBox } = useCart();
  const { dict } = useI18n();
  const [added, setAdded] = useState(false);
  const outOfStock = box.stock === 0;
  const margen =
    box.valorRetailEstimado > box.precio
      ? Math.round(((box.valorRetailEstimado - box.precio) / box.precio) * 100)
      : null;

  function handleQuickAdd() {
    if (outOfStock) return;
    addBox(box, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="group flex h-full flex-col border border-border bg-card">
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

        {box.numResenas > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-0.5 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-3"
                  fill={i < Math.round(box.rating) ? "currentColor" : "none"}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span>
              {box.rating.toFixed(1)} · {box.numResenas} {dict.productCard.reviewsSuffix}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>
            {dict.productCard.stockLabel}: {box.stock}
          </span>
          {margen !== null && (
            <span className="font-semibold text-primary">
              +{margen}% {dict.productCard.marginSuffix}
            </span>
          )}
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
            disabled={outOfStock}
            aria-label={outOfStock ? dict.productCard.outOfStock : dict.productCard.addToCart}
            onClick={handleQuickAdd}
          >
            {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
