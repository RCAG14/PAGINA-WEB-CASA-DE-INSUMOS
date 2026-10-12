import Image from "next/image";
import { Lock, ShieldCheck, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/locale";
import type { SurpriseBox } from "@/lib/types";

export async function MysteryPanel({ box }: { box: SurpriseBox }) {
  const { dict } = await getDictionary();

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-elevation-sm">
      <div className="flex items-center gap-2 border-b border-border/60 bg-secondary px-4 py-3">
        <Lock className="size-4 text-primary" />
        <p className="font-heading text-base font-semibold text-primary">
          {dict.mysteryPanel.reservedNotice}
        </p>
      </div>

      <div className="flex flex-col gap-5 p-4 sm:p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {dict.mysteryPanel.confirmedClassification}
          </p>
          <p className="font-heading text-lg font-semibold text-primary">
            {box.clasificacion.label}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {dict.mysteryPanel.rangeLabel}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border-2 border-accent bg-secondary p-3">
              <div className="mb-1 flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {dict.mysteryPanel.minGuaranteed}
                </span>
              </div>
              {/* Un valor 0 significa "no cargado": se omite en vez de mostrar Bs 0,00. */}
              {box.valorEstimadoMax > 0 && (
                <p className="font-heading text-xl font-semibold text-primary">
                  {formatPrice(box.valorEstimadoMax)}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {box.cantidadEstimadaMin} {dict.mysteryPanel.minItemsSuffix}
              </p>
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <div className="mb-1 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {dict.mysteryPanel.maxPotential}
                </span>
              </div>
              {box.valorEstimadoMin > 0 && (
                <p className="font-heading text-xl font-semibold">
                  {formatPrice(box.valorEstimadoMin)}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {dict.mysteryPanel.maxItemsPrefix} {box.cantidadEstimadaMax}{" "}
                {dict.mysteryPanel.maxItemsSuffix}
              </p>
            </div>
          </div>
        </div>

        {box.imagenesReferencia.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {dict.mysteryPanel.undisclosedLabel}
            </p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {box.imagenesReferencia.map((url, i) => (
                <div
                  key={url}
                  className="relative aspect-square overflow-hidden rounded-lg border border-accent/70 bg-background"
                >
                  <Image
                    src={url}
                    alt={`Artículo de referencia ${i + 1} — ejemplo de producto en caja sorpresa de devoluciones de Amazon en Bolivia`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{dict.mysteryPanel.footnote}</p>
          </div>
        )}
      </div>
    </div>
  );
}
