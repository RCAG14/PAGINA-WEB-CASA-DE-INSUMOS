"use client";

import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { buildWhatsAppLink, cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { getPaquetesDesarrollo } from "@/lib/data/desarrollo";

type Paquete = Awaited<ReturnType<typeof getPaquetesDesarrollo>>[number];

export function WebDevPricingCard({
  paquete,
  dict,
  whatsappNumero,
}: {
  paquete: Paquete;
  dict: Dictionary["webdev"]["pricing"];
  whatsappNumero: string | null;
}) {
  const mensaje = `Hola, quiero cotizar el paquete ${paquete.nombre} de desarrollo web.`;

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "flex h-full w-full flex-col gap-4 rounded-xl border bg-card/80 p-6 text-left shadow-elevation-md backdrop-blur-md transition-shadow",
          paquete.destacado
            ? "border-primary/60 shadow-glow-primary"
            : "border-border/60 hover:shadow-elevation-lg"
        )}
      >
        {paquete.destacado && (
          <span className="w-fit rounded-full bg-primary px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground shadow-glow-accent">
            {dict.recommended}
          </span>
        )}
        <div>
          <h3 className="font-heading text-lg font-semibold">{paquete.nombre}</h3>
          <p className="text-xs text-muted-foreground">{paquete.tagline}</p>
        </div>

        <p className="font-heading text-3xl font-bold text-primary">
          {formatPrice(paquete.precio)}
        </p>

        <ul className="flex flex-1 flex-col gap-2">
          {paquete.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.5} />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        <span className="font-mono-technical text-[11px] uppercase tracking-wider text-accent underline underline-offset-4">
          {dict.viewDetails}
        </span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <span className="font-mono-technical text-[10px] uppercase tracking-wider text-accent">
            {dict.modalTitle}
          </span>
          <DialogTitle className="flex items-center gap-2 font-heading text-xl">
            {paquete.nombre}
            {paquete.destacado && (
              <span className="rounded-full bg-primary px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground">
                {dict.recommended}
              </span>
            )}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{paquete.tagline}</p>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-x-6 gap-y-2 rounded-lg border border-border/60 bg-background/60 p-4">
            <div>
              <p className="font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground">
                {dict.priceLabel}
              </p>
              <p className="font-heading text-2xl font-bold text-primary">
                {formatPrice(paquete.precio)}
              </p>
            </div>
            <div>
              <p className="font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground">
                {dict.maintenanceLabel}
              </p>
              {paquete.mantenimientoMensual !== null ? (
                <p className="font-heading text-2xl font-bold">
                  {formatPrice(paquete.mantenimientoMensual)}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    {dict.maintenanceSuffix}
                  </span>
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">{dict.maintenanceNote}</p>
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground">
              {dict.featuresLabel}
            </p>
            <ul className="flex flex-col gap-2">
              {paquete.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.5} />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {whatsappNumero ? (
            <a
              href={buildWhatsAppLink(whatsappNumero, mensaje)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center rounded-lg px-4 py-2 text-center font-mono-technical text-xs uppercase tracking-wider transition-all",
                paquete.destacado
                  ? "bg-primary text-primary-foreground shadow-glow-primary hover:bg-primary/90"
                  : "border border-border/60 text-foreground hover:border-primary hover:text-primary"
              )}
            >
              {dict.quoteCta}
            </a>
          ) : (
            <span className="rounded-lg border border-dashed border-accent bg-accent/10 px-4 py-2 text-center font-mono-technical text-[11px] uppercase tracking-wider text-primary">
              {dict.quoteFallback}
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
