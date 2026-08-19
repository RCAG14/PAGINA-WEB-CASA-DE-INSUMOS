import { Check } from "lucide-react";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import { getPaquetesDesarrollo } from "@/lib/data/desarrollo";
import { buildWhatsAppLink, cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/locale";
import { ScrollReveal } from "@/components/site/scroll-reveal";

export async function WebDevPricing() {
  const [paquetes, whatsappNumero, { dict }] = await Promise.all([
    getPaquetesDesarrollo(),
    getNumeroWhatsappPrincipal(),
    getDictionary(),
  ]);

  if (paquetes.length === 0) return null;

  return (
    <section
      id="paquetes"
      className="flex min-h-screen items-center border-b border-border bg-background"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <ScrollReveal className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
            {dict.webdev.pricing.eyebrow}
          </span>
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            {dict.webdev.pricing.title}
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {dict.webdev.pricing.description}
          </p>
        </ScrollReveal>

        <div className="grid gap-4 lg:grid-cols-3">
          {paquetes.map((paquete, i) => {
            const mensaje = `Hola, quiero cotizar el paquete ${paquete.nombre} de desarrollo web.`;
            return (
              <ScrollReveal key={paquete.id} delayMs={i * 100}>
                <div
                  className={cn(
                    "flex h-full flex-col gap-4 rounded-xl border bg-card/80 p-6 shadow-elevation-md backdrop-blur-md transition-shadow",
                    paquete.destacado
                      ? "border-primary/60 shadow-glow-primary"
                      : "border-border/60 hover:shadow-elevation-lg"
                  )}
                >
                  {paquete.destacado && (
                    <span className="w-fit rounded-full bg-primary px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground shadow-glow-accent">
                      {dict.webdev.pricing.recommended}
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
                      {dict.webdev.pricing.quoteCta}
                    </a>
                  ) : (
                    <span className="rounded-lg border border-dashed border-accent bg-accent/10 px-4 py-2 text-center font-mono-technical text-[11px] uppercase tracking-wider text-primary">
                      {dict.webdev.pricing.quoteFallback}
                    </span>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
