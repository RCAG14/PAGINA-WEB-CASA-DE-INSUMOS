import { ChevronDown } from "lucide-react";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import {
  getExtrasDesarrollo,
  getPaquetesDesarrollo,
} from "@/lib/data/desarrollo";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

// Columnas fijas compartidas por el encabezado y cada fila de extras, para que
// el motivo y el costo queden alineados en todas las filas.
const EXTRAS_COLS =
  "sm:grid-cols-[13rem_minmax(0,1fr)_8.5rem] lg:grid-cols-[16rem_minmax(0,1fr)_8.5rem] sm:gap-x-6";
import { getDictionary } from "@/lib/i18n/locale";
import { HOME_CONTAINER } from "@/lib/layout";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { WebDevPricingCard } from "@/components/site/webdev-pricing-card";

export async function WebDevPricing() {
  const [paquetes, extras, whatsappNumero, { dict }] = await Promise.all([
    getPaquetesDesarrollo(),
    getExtrasDesarrollo(),
    getNumeroWhatsappPrincipal(),
    getDictionary(),
  ]);

  if (paquetes.length === 0) return null;

  return (
    <section
      id="paquetes"
      className="scroll-mt-20 border-b border-border bg-background"
    >
      <div className={cn(HOME_CONTAINER, "py-12 lg:py-16")}>
        <ScrollReveal className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
            {dict.webdev.pricing.eyebrow}
          </span>
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            {dict.webdev.pricing.title}
          </h2>
          <p className="max-w-2xl text-pretty text-base text-muted-foreground">
            {dict.webdev.pricing.description}
          </p>
        </ScrollReveal>

        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-5">
          {paquetes.map((paquete, i) => (
            <ScrollReveal
              key={paquete.id}
              delayMs={i * 100}
              className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.834rem)]"
            >
              <WebDevPricingCard
                paquete={paquete}
                dict={dict.webdev.pricing}
                whatsappNumero={whatsappNumero}
              />
            </ScrollReveal>
          ))}
        </div>

        {extras.length > 0 && (
          <ScrollReveal className="mx-auto mt-10 max-w-5xl">
            {/* Plegado por defecto: los extras son opcionales y la tabla completa
                alargaba mucho la página. <details> nativo: sin JS y accesible. */}
            <details className="group overflow-hidden rounded-xl border border-border/60 bg-card shadow-elevation-sm">
              <summary className="flex cursor-pointer list-none flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 [&::-webkit-details-marker]:hidden">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                    {dict.webdev.pricing.extrasEyebrow}
                  </span>
                  <h3 className="font-heading text-lg font-semibold">
                    {dict.webdev.pricing.extrasTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {dict.webdev.pricing.extrasDescription}
                  </p>
                </div>
                <span className="flex w-fit shrink-0 items-center gap-2 rounded-lg border border-primary/40 px-4 py-2.5 text-sm font-semibold text-primary transition-colors group-hover:bg-primary/5">
                  {dict.webdev.pricing.extrasToggle} ({extras.length})
                  <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                </span>
              </summary>

              <div className="border-t border-border/60">
                <div
                  className={cn(
                    "hidden border-b border-border/60 bg-muted/40 px-5 py-2.5 font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground sm:grid",
                    EXTRAS_COLS,
                  )}
                >
                  <span>{dict.webdev.pricing.extrasColExtra}</span>
                  <span>{dict.webdev.pricing.extrasColReason}</span>
                  <span className="text-right">
                    {dict.webdev.pricing.extrasColPrice}
                  </span>
                </div>
                <ul className="divide-y divide-border/60">
                  {extras.map((extra) => (
                    <li
                      key={extra.id}
                      className={cn(
                        "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1 px-5 py-3.5 transition-colors hover:bg-muted/30 sm:items-center",
                        EXTRAS_COLS,
                      )}
                    >
                      <span className="text-sm font-medium leading-snug">
                        {extra.nombre}
                      </span>
                      <span className="col-span-2 row-start-2 text-xs leading-relaxed text-muted-foreground sm:col-span-1 sm:row-start-auto">
                        {extra.motivo}
                      </span>
                      {/* Precio arriba y "desde"/unidad debajo, ambos alineados a la
                        derecha: así el ancho de la columna no depende de la unidad. */}
                      <span className="col-start-2 row-start-1 flex flex-col items-end text-right sm:col-start-auto sm:row-start-auto">
                        <span className="font-mono-technical text-sm font-semibold whitespace-nowrap text-primary">
                          {extra.precioDesde && (
                            <span className="mr-1 text-[10px] font-normal uppercase text-muted-foreground">
                              {dict.webdev.pricing.extrasFrom}
                            </span>
                          )}
                          {formatPrice(extra.precio)}
                        </span>
                        {extra.unidad && (
                          <span className="text-[11px] text-muted-foreground">
                            {extra.unidad}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
