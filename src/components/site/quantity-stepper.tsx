"use client";

import { Minus, Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n/locale-context";

export function QuantityStepper({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const { dict } = useI18n();

  return (
    <div className="flex items-center border border-border">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label={dict.cartSheet.decreaseQty}
        className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="w-10 text-center font-mono-technical text-sm">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={dict.cartSheet.increaseQty}
        className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
