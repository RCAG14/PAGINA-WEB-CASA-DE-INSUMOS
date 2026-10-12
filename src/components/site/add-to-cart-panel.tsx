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
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-elevation-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-muted-foreground">
          {dict.addToCartPanel.quantity}
        </span>
        <span className="text-sm text-muted-foreground">
          {dict.productPage.total}:{" "}
          <span className="font-heading text-lg font-bold text-primary">
            {formatPrice(box.precio * qty)}
          </span>
        </span>
      </div>

      {/* Cantidad y botón en una sola fila: menos alto y la acción más a mano. */}
      <div className="flex items-center gap-3">
        <QuantityStepper value={qty} max={Math.max(box.stock, 1)} onChange={setQty} />
        <Button
          size="lg"
          disabled={outOfStock}
          onClick={handleAdd}
          className="flex-1"
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
    </div>
  );
}
