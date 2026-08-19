import { HelpCircle, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/locale";
import type { SurpriseBox } from "@/lib/types";

export async function MysteryPanel({ box }: { box: SurpriseBox }) {
  const { dict } = await getDictionary();
  const placeholders = Array.from({ length: Math.min(box.cantidadEstimadaMax, 12) });

  return (
    <div className="overflow-hidden rounded-xl border border-dashed border-accent bg-accent/5 shadow-elevation-sm">
      <div className="flex items-center gap-2 border-b border-dashed border-accent bg-sidebar px-3 py-2">
        <Lock className="size-3.5 text-sidebar-foreground" />
        <p className="font-mono-technical text-[11px] uppercase tracking-wider text-sidebar-foreground">
          {dict.mysteryPanel.reservedNotice}
        </p>
      </div>

      <div className="flex flex-col gap-5 p-4">
        <div>
          <p className="font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground">
            {dict.mysteryPanel.confirmedClassification}
          </p>
          <p className="font-heading text-lg font-semibold text-primary">
            {box.clasificacion.label}
          </p>
        </div>

        <div>
          <p className="mb-2 font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground">
            {dict.mysteryPanel.rangeLabel}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border-2 border-accent bg-accent/15 p-3 shadow-glow-accent">
              <div className="mb-1 flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" />
                <span className="font-mono-technical text-[10px] font-bold uppercase tracking-wider text-primary">
                  {dict.mysteryPanel.minGuaranteed}
                </span>
              </div>
              <p className="font-heading text-xl font-semibold text-primary">
                {formatPrice(box.valorEstimadoMin)}
              </p>
              <p className="text-xs text-muted-foreground">
                {box.cantidadEstimadaMin} {dict.mysteryPanel.minItemsSuffix}
              </p>
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <div className="mb-1 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-muted-foreground" />
                <span className="font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground">
                  {dict.mysteryPanel.maxPotential}
                </span>
              </div>
              <p className="font-heading text-xl font-semibold">
                {formatPrice(box.valorEstimadoMax)}
              </p>
              <p className="text-xs text-muted-foreground">
                {dict.mysteryPanel.maxItemsPrefix} {box.cantidadEstimadaMax}{" "}
                {dict.mysteryPanel.maxItemsSuffix}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground">
            {dict.mysteryPanel.undisclosedLabel}
          </p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {placeholders.map((_, i) => (
              <div
                key={i}
                className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-accent/70 bg-background"
              >
                <HelpCircle className="size-4 text-accent" strokeWidth={1.5} />
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{dict.mysteryPanel.footnote}</p>
        </div>
      </div>
    </div>
  );
}
