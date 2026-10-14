"use client";

import { useRef } from "react";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildWhatsAppLink, cn } from "@/lib/utils";
import { PrecioDesarrollo } from "@/components/site/precio-desarrollo";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { getPaquetesDesarrollo } from "@/lib/data/desarrollo";

type Paquete = Awaited<ReturnType<typeof getPaquetesDesarrollo>>[number];

// La tarjeta resume; la lista completa está en el detalle.
const FEATURES_EN_TARJETA = 4;

const SECTION_LABEL = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2 text-sm">
          <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2} />
          <span className="text-foreground/80">{feature}</span>
        </li>
      ))}
    </ul>
  );
}

export function WebDevPricingCard({
  paquete,
  dict,
  whatsappNumero,
}: {
  paquete: Paquete;
  dict: Dictionary["webdev"]["pricing"];
  whatsappNumero: string | null;
}) {
  const mensaje = `Hola, quiero cotizar el paquete ${paquete.nombreEs} de desarrollo web.`;
  // El foco inicial va al título: si fuera al primer elemento enfocable (el
  // botón de cotizar, al fondo), el modal se abriría desplazado hacia abajo.
  const titleRef = useRef<HTMLHeadingElement>(null);

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "group flex h-full w-full cursor-pointer flex-col gap-4 rounded-xl border bg-card/80 p-6 text-left shadow-elevation-md backdrop-blur-md transition-shadow",
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
          <p className="text-sm text-muted-foreground">{paquete.tagline}</p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-heading text-3xl font-bold text-primary">
            <PrecioDesarrollo usd={paquete.precio} />
          </p>
          {/* El mantenimiento es un costo recurrente: se muestra antes de abrir
              el detalle para que el precio no sorprenda después. */}
          {paquete.mantenimientoMensual !== null && (
            <p className="text-xs text-muted-foreground">
              + <PrecioDesarrollo usd={paquete.mantenimientoMensual} /> {dict.maintenanceSuffix}{" "}
              {dict.maintenanceCardNote}
            </p>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <FeatureList features={paquete.features.slice(0, FEATURES_EN_TARJETA)} />
          {paquete.features.length > FEATURES_EN_TARJETA && (
            <p className="pl-6 text-sm font-medium text-accent">
              +{paquete.features.length - FEATURES_EN_TARJETA} {dict.moreFeatures}
            </p>
          )}
        </div>

        {/* La tarjeta entera abre el detalle; esto solo lo hace evidente. */}
        <span
          className={cn(
            "mt-1 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
            paquete.destacado
              ? "bg-primary text-primary-foreground"
              : "border border-primary/40 text-primary group-hover:bg-primary/5"
          )}
        >
          {dict.viewDetails}
          <ArrowRight className="size-4" />
        </span>
      </DialogTrigger>

      {/* Contenido desplazable + pie fijo con el botón de cotizar, siempre visible. */}
      <DialogContent
        initialFocus={titleRef}
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <div className="flex flex-col gap-5 overflow-y-auto p-5 sm:p-6">
          <DialogHeader className="pr-8">
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              {dict.modalTitle}
            </span>
            <DialogTitle
              ref={titleRef}
              tabIndex={-1}
              className="flex flex-wrap items-center gap-2 font-heading text-xl outline-none"
            >
              {paquete.nombre}
              {paquete.destacado && (
                <span className="rounded-full bg-primary px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground">
                  {dict.recommended}
                </span>
              )}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{paquete.tagline}</p>
          </DialogHeader>

          <div className="grid gap-4 rounded-xl bg-secondary p-4 sm:grid-cols-2">
            <div>
              <p className={SECTION_LABEL}>{dict.priceLabel}</p>
              <p className="font-heading text-2xl font-bold text-primary">
                <PrecioDesarrollo usd={paquete.precio} />
              </p>
            </div>
            <div>
              <p className={SECTION_LABEL}>{dict.maintenanceLabel}</p>
              {paquete.mantenimientoMensual !== null ? (
                <p className="font-heading text-2xl font-bold">
                  <PrecioDesarrollo usd={paquete.mantenimientoMensual} />{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    {dict.maintenanceSuffix}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">{dict.maintenanceNote}</p>
              )}
            </div>
            {paquete.mantenimientoMensual !== null && (
              <p className="text-xs leading-relaxed text-muted-foreground sm:col-span-2">
                {dict.maintenanceExplain}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <p className={SECTION_LABEL}>{dict.featuresLabel}</p>
            <FeatureList features={paquete.features} />
          </div>

          {/* El desglose responde "¿por qué cuesta esto?": útil pero secundario,
              por eso va plegado en vez de repetir la lista de lo incluido. */}
          {paquete.desglose.length > 0 && (
            <Accordion className="rounded-xl border border-border/60 px-4">
              <AccordionItem value="desglose" className="border-none">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold">{dict.breakdownLabel}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {dict.breakdownHint}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="flex flex-col divide-y divide-border/60">
                    {paquete.desglose.map((item) => (
                      <li
                        key={item.concepto}
                        className="flex items-start justify-between gap-4 py-2.5"
                      >
                        <div>
                          <p className="text-sm font-medium">{item.concepto}</p>
                          {item.motivo && (
                            <p className="text-xs text-muted-foreground">{item.motivo}</p>
                          )}
                        </div>
                        <span className="shrink-0 font-mono-technical text-sm font-semibold text-primary">
                          <PrecioDesarrollo usd={item.monto} />
                        </span>
                      </li>
                    ))}
                    <li className="flex items-center justify-between gap-4 pt-2.5">
                      <span className="text-sm font-semibold">{dict.breakdownTotal}</span>
                      <span className="font-mono-technical text-sm font-bold text-primary">
                        <PrecioDesarrollo usd={paquete.precio} />
                      </span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>

        <div className="border-t border-border/60 bg-popover p-4 sm:px-6">
          {whatsappNumero ? (
            <a
              href={buildWhatsAppLink(whatsappNumero, mensaje)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <MessageCircle className="size-4" strokeWidth={2} />
              {dict.quoteCta}
            </a>
          ) : (
            <span className="block rounded-lg border border-dashed border-accent bg-accent/10 px-4 py-2 text-center font-mono-technical text-[11px] uppercase tracking-wider text-primary">
              {dict.quoteFallback}
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
