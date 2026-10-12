import { CreditCard, MessageCircle, PackageSearch, ShoppingCart } from "lucide-react";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import { getDictionary } from "@/lib/i18n/locale";
import { HOME_CONTAINER } from "@/lib/layout";
import { buildWhatsAppLink, cn } from "@/lib/utils";
import { MENSAJES_WHATSAPP } from "@/lib/whatsapp";
import { ScrollReveal } from "@/components/site/scroll-reveal";

const STEP_ICONS = [PackageSearch, ShoppingCart, CreditCard];

/**
 * "Cómo comprar" del catálogo de cajas: los 3 pasos reales del flujo (carrito →
 * checkout con reserva de 48 h → pago con QR y envío por WhatsApp) y debajo el
 * contacto directo. Reemplaza la antigua sección "Sobre nosotros", que ocupaba
 * una pantalla entera sin decir cómo se compra.
 */
export async function HowToBuy() {
  const [whatsappNumero, { dict }] = await Promise.all([
    getNumeroWhatsappPrincipal(),
    getDictionary(),
  ]);
  const t = dict.howToBuy;

  return (
    <section id="como-comprar" className="scroll-mt-20 border-t border-border bg-muted/40">
      <div className={cn(HOME_CONTAINER, "flex flex-col gap-8 py-12 lg:py-16")}>
        <ScrollReveal className="flex flex-col items-center gap-2 text-center">
          <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
            {t.eyebrow}
          </span>
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">{t.title}</h2>
        </ScrollReveal>

        <ol className="grid gap-4 md:grid-cols-3">
          {t.steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <li key={step.titulo}>
                <ScrollReveal delayMs={i * 80} className="h-full">
                  <div className="flex h-full items-start gap-4 rounded-xl border border-border/60 bg-card p-5 shadow-elevation-sm">
                    <span className="relative flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" strokeWidth={1.75} />
                      <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                    </span>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-heading text-base font-semibold">{step.titulo}</h3>
                      <p className="text-sm text-muted-foreground">{step.descripcion}</p>
                    </div>
                  </div>
                </ScrollReveal>
              </li>
            );
          })}
        </ol>

        {whatsappNumero && (
          <ScrollReveal className="flex flex-col items-start gap-4 rounded-2xl bg-primary p-6 text-primary-foreground shadow-elevation-md sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex flex-col gap-1">
              <h2 className="font-heading text-xl font-semibold sm:text-2xl">{t.contactTitle}</h2>
              <p className="text-sm text-primary-foreground/85 sm:text-base">{t.contactDescription}</p>
            </div>
            <a
              href={buildWhatsAppLink(whatsappNumero, MENSAJES_WHATSAPP.cajas)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary shadow-elevation-sm transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              <MessageCircle className="size-4" strokeWidth={2} />
              {t.contactCta}
            </a>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
