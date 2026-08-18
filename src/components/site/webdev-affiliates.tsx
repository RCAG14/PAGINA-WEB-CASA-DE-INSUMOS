import { Handshake, MessageCircle } from "lucide-react";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import { buildWhatsAppLink } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n/locale";
import { ScrollReveal } from "@/components/site/scroll-reveal";

const MENSAJE_AFILIADOS = "Hola, quiero información sobre el programa de afiliados de desarrollo web.";

export async function WebDevAffiliates() {
  const [whatsappNumero, { dict }] = await Promise.all([
    getNumeroWhatsappPrincipal(),
    getDictionary(),
  ]);

  return (
    <section
      id="afiliados"
      className="flex min-h-screen items-center border-b border-border bg-card"
    >
      <ScrollReveal className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6">
        <span className="flex size-12 items-center justify-center border border-primary/30 bg-primary/5 text-primary">
          <Handshake className="size-6" strokeWidth={1.5} />
        </span>
        <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
          {dict.webdev.affiliates.eyebrow}
        </span>
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
          {dict.webdev.affiliates.title}
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground">{dict.webdev.affiliates.description}</p>

        {whatsappNumero ? (
          <a
            href={buildWhatsAppLink(whatsappNumero, MENSAJE_AFILIADOS)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-accent bg-accent/15 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/25"
          >
            <MessageCircle className="size-4" strokeWidth={1.5} />
            {dict.webdev.affiliates.cta}
          </a>
        ) : (
          <span className="border border-dashed border-accent bg-accent/10 px-4 py-2 font-mono-technical text-[11px] uppercase tracking-wider text-primary">
            {dict.webdev.affiliates.fallback}
          </span>
        )}
      </ScrollReveal>
    </section>
  );
}
