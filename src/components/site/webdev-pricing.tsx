import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import { getPaquetesDesarrollo } from "@/lib/data/desarrollo";
import { getDictionary } from "@/lib/i18n/locale";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { WebDevPricingCard } from "@/components/site/webdev-pricing-card";

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

        <div className="flex flex-wrap justify-center gap-4">
          {paquetes.map((paquete, i) => (
            <ScrollReveal
              key={paquete.id}
              delayMs={i * 100}
              className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]"
            >
              <WebDevPricingCard
                paquete={paquete}
                dict={dict.webdev.pricing}
                whatsappNumero={whatsappNumero}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
