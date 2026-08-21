"use client";

import Image from "next/image";
import { Lock, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n/locale-context";
import { CLASSIFICATION_ICON_MAP } from "@/lib/classification-icons";
import { cn } from "@/lib/utils";
import type { Box } from "@/lib/types";

interface BoxVisualProps {
  box: Pick<Box, "nombre" | "tipo" | "clasificacion" | "specs" | "imagenUrl" | "destacada">;
  className?: string;
  iconClassName?: string;
}

export function BoxVisual({ box, className, iconClassName }: BoxVisualProps) {
  const { dict } = useI18n();
  const Icon = CLASSIFICATION_ICON_MAP[box.clasificacion.icon];
  const isSurprise = box.tipo === "sorpresa";

  return (
    <div
      className={cn(
        "relative aspect-4/3 w-full overflow-hidden rounded-xl border",
        isSurprise ? "border-dashed border-accent/60" : "border-border/60",
        "bg-grid-technical bg-card",
        className
      )}
    >
      <div className="absolute left-2 top-2 rounded-md bg-background/70 px-1.5 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
        {box.specs.skuCaja}
      </div>

      {isSurprise && (
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full border border-dashed border-accent/70 bg-background/80 px-1.5 py-0.5 font-mono-technical text-[9px] uppercase tracking-wider text-primary">
          <Lock className="size-2.5" />
          {dict.boxVisual.contentReserved}
        </div>
      )}

      {box.destacada && (
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-accent px-1.5 py-0.5 font-mono-technical text-[9px] uppercase tracking-wider text-accent-foreground shadow-glow-accent">
          <Sparkles className="size-2.5" />
          {dict.boxVisual.featuredBadge}
        </div>
      )}

      {box.imagenUrl ? (
        <Image
          src={box.imagenUrl}
          alt={`${box.nombre} — caja de devoluciones de Amazon en Bolivia, categoría ${box.clasificacion.label}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div
            className={cn(
              "flex items-center justify-center rounded-xl border-2",
              isSurprise
                ? "border-dashed border-accent bg-accent/10"
                : "border-primary bg-primary/5",
              "size-16 sm:size-20"
            )}
          >
            <Icon
              className={cn(
                "size-8 sm:size-10",
                isSurprise ? "text-primary/70" : "text-primary",
                iconClassName
              )}
              strokeWidth={1.5}
            />
          </div>
        </div>
      )}
    </div>
  );
}
