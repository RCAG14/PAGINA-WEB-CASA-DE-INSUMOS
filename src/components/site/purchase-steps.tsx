"use client";

import { Check } from "lucide-react";
import { useI18n } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

/**
 * Indicador de pasos de la compra (carrito → tus datos → confirmar por
 * WhatsApp) para que el cliente sepa dónde está y cuánto le falta.
 * `actual` es el índice del paso en curso; con `completo` todos quedan hechos.
 */
export function PurchaseSteps({ actual, completo = false }: { actual: number; completo?: boolean }) {
  const { dict } = useI18n();
  const pasos = dict.purchaseSteps.steps;

  return (
    <ol className="flex items-center gap-2 text-sm" aria-label={dict.purchaseSteps.label}>
      {pasos.map((paso, i) => {
        const hecho = completo || i < actual;
        const enCurso = !completo && i === actual;
        return (
          <li key={paso} className="flex items-center gap-2">
            <span
              aria-current={enCurso ? "step" : undefined}
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                hecho && "bg-primary text-primary-foreground",
                enCurso && "border-2 border-primary text-primary",
                !hecho && !enCurso && "border border-border text-muted-foreground"
              )}
            >
              {hecho ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
            </span>
            <span
              className={cn(
                "hidden sm:inline",
                enCurso ? "font-semibold text-foreground" : "text-muted-foreground"
              )}
            >
              {paso}
            </span>
            {i < pasos.length - 1 && <span className="mx-1 h-px w-6 bg-border sm:w-10" />}
          </li>
        );
      })}
    </ol>
  );
}
