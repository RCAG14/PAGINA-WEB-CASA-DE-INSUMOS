"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/site/quantity-stepper";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n/locale-context";
import type { Box } from "@/lib/types";

export function AddToCartPanel({ box }: { box: Box }) {
  const { addBox } = useCart();
  const { dict } = useI18n();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = box.stock === 0;

  function handleAdd() {
    addBox(box, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-elevation-sm">
      <div className="flex items-center justify-between">
        <span className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
          {dict.addToCartPanel.quantity}
        </span>
        <span className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
          {box.stock} {dict.addToCartPanel.inStockSuffix}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <QuantityStepper value={qty} max={Math.max(box.stock, 1)} onChange={setQty} />
        <span className="font-mono-technical text-xl font-semibold text-primary">
          {formatPrice(box.precio * qty)}
        </span>
      </div>

      <Button
        size="lg"
        disabled={outOfStock}
        onClick={handleAdd}
        className="w-full"
        variant={added ? "secondary" : "default"}
      >
        {outOfStock ? (
          dict.addToCartPanel.outOfStock
        ) : added ? (
          <>
            <Check className="size-4" /> {dict.addToCartPanel.added}
          </>
        ) : (
          <>
            <ShoppingCart className="size-4" /> {dict.addToCartPanel.addToCart}
          </>
        )}
      </Button>
    </div>
  );
}
