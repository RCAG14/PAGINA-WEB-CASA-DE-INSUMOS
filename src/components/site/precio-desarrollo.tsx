"use client";

import { useI18n } from "@/lib/i18n/locale-context";
import { useMoneda } from "@/lib/moneda/moneda-context";
import type { Moneda } from "@/lib/moneda/constants";
import { cn } from "@/lib/utils";

/** Monto de desarrollo web (cargado en USD) en la moneda que eligió el visitante. */
export function PrecioDesarrollo({ usd }: { usd: number }) {
  const { formatMonto } = useMoneda();
  return <>{formatMonto(usd)}</>;
}

const OPCIONES: { value: Moneda; label: string }[] = [
  { value: "USD", label: "US$" },
  { value: "BOB", label: "Bs" },
];

/**
 * Selector USD / Bs de la sección de paquetes. Los precios se publican en
 * dólares; en bolivianos son referenciales, con el tipo de cambio del panel.
 */
export function MonedaToggle({ className }: { className?: string }) {
  const { moneda, setMoneda, tipoCambio } = useMoneda();
  const { dict, locale } = useI18n();
  const t = dict.webdev.pricing;
  const tasa = new Intl.NumberFormat(locale === "en" ? "en-US" : "es-BO", {
    maximumFractionDigits: 4,
  }).format(tipoCambio);

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{t.currencyLabel}</span>
        <div
          role="group"
          aria-label={t.currencyLabel}
          className="flex rounded-lg border border-border/60 bg-card p-0.5 shadow-elevation-sm"
        >
          {OPCIONES.map((opcion) => (
            <button
              key={opcion.value}
              type="button"
              onClick={() => setMoneda(opcion.value)}
              aria-pressed={moneda === opcion.value}
              className={cn(
                "rounded-md px-3 py-1 font-mono-technical text-xs font-semibold transition-colors",
                moneda === opcion.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opcion.label}
            </button>
          ))}
        </div>
      </div>
      {moneda === "BOB" && (
        <p className="text-xs text-muted-foreground">{t.currencyBobNote.replace("{rate}", tasa)}</p>
      )}
    </div>
  );
}
