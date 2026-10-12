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
import { cn } from "@/lib/utils";
import type { Box } from "@/lib/types";

export function ProductCard({ box }: { box: Box }) {
  const { addBox } = useCart();
  const { dict } = useI18n();
  const [added, setAdded] = useState(false);
  const outOfStock = box.stock === 0;
  const tieneValorEstimado = box.valorRetailEstimado > box.precio;

  function handleQuickAdd() {
    if (outOfStock) return;
    addBox(box, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-elevation-sm transition-[transform,box-shadow,border-color] duration-300 ease-out",
        outOfStock ? "opacity-80" : "hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevation-lg"
      )}
    >
      <Link href={`/productos/${box.slug}`} className="relative block">
        <BoxVisual
          box={box}
          className={cn(
            "rounded-none border-0 border-b transition-opacity group-hover:opacity-90",
            outOfStock && "grayscale"
          )}
        />
        {outOfStock && (
          <span className="absolute inset-x-0 top-1/2 mx-auto w-fit -translate-y-1/2 rounded-full bg-foreground/85 px-4 py-1.5 text-sm font-semibold text-background">
            {dict.productCard.soldOut}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <ClassificationBadge clasificacion={box.clasificacion} />
          <BoxTypeBadge tipo={box.tipo} />
        </div>

        <Link href={`/productos/${box.slug}`}>
          <h3 className="font-heading text-base font-semibold leading-snug text-foreground transition-colors hover:text-primary">
            {box.nombre}
          </h3>
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground">{box.descripcionCorta}</p>

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

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div className="flex flex-col">
            <span className="font-heading text-xl font-bold text-primary">
              {formatPrice(box.precio)}
            </span>
            {/* Valor estimado sin tachar: tachado parecía un descuento. */}
            {tieneValorEstimado && (
              <span className="text-xs text-muted-foreground">
                {dict.productCard.estimatedValue}: {formatPrice(box.valorRetailEstimado)}
              </span>
            )}
            {!outOfStock && (
              <span className="text-xs font-medium text-accent">
                {box.stock} {dict.productCard.available}
              </span>
            )}
          </div>
          {!outOfStock && (
            <Button
              size="icon"
              variant={added ? "secondary" : "default"}
              aria-label={dict.productCard.addToCart}
              onClick={handleQuickAdd}
            >
              {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
