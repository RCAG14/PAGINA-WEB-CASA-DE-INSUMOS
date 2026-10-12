import { Handshake, Mail, MessageCircle } from "lucide-react";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import { getDictionary } from "@/lib/i18n/locale";
import { HOME_CONTAINER } from "@/lib/layout";
import { buildWhatsAppLink, cn } from "@/lib/utils";
import { MENSAJES_WHATSAPP } from "@/lib/whatsapp";
import { ScrollReveal } from "@/components/site/scroll-reveal";

// Vacía o con solo espacios cuenta como "sin correo": antes dibujaba una fila sin texto.
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null;
const MENSAJE_AFILIADOS = "Hola, quiero información sobre el programa de afiliados de desarrollo web.";

/**
 * Cierre de desarrollo-web: llamado a la acción con el copy propio de este
 * servicio ("Contanos tu proyecto") y WhatsApp directo con el mensaje de
 * desarrollo web. Debajo, en una sola línea, la invitación al programa de
 * afiliados (antes era una sección entera). Identidad, redes y ubicación
 * quedan en el footer compartido (HomeFooter) que va debajo.
 */
export async function WebDevContact() {
  const [whatsappNumero, { dict }] = await Promise.all([
    getNumeroWhatsappPrincipal(),
    getDictionary(),
  ]);
  const t = dict.webdev.contact;
  const af = dict.webdev.affiliates;

  return (
    <section id="contacto" className="scroll-mt-20 bg-background">
      <div className={cn(HOME_CONTAINER, "flex flex-col gap-4 py-12 lg:py-16")}>
        <ScrollReveal className="flex flex-col items-start gap-6 rounded-2xl bg-primary p-6 text-primary-foreground shadow-elevation-md sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-mono-technical text-xs uppercase tracking-wider text-primary-foreground/70">
              {t.eyebrow}
            </span>
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">{t.title}</h2>
            <p className="max-w-xl text-sm text-primary-foreground/85 sm:text-base">
              {t.description}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
            {whatsappNumero && (
              <a
                href={buildWhatsAppLink(whatsappNumero, MENSAJES_WHATSAPP.webdev)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary shadow-elevation-sm transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              >
                <MessageCircle className="size-4" strokeWidth={2} />
                {t.cta}
              </a>
            )}
            {CONTACT_EMAIL && (
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-1.5 text-sm text-primary-foreground/80 hover:text-white"
              >
                <Mail className="size-4 shrink-0" strokeWidth={1.75} />
                {CONTACT_EMAIL}
              </a>
            )}
          </div>
        </ScrollReveal>

        {whatsappNumero && (
          <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-secondary px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-3 text-sm sm:items-center">
              <Handshake className="mt-0.5 size-5 shrink-0 text-primary sm:mt-0" strokeWidth={1.75} />
              <span>
                <span className="font-semibold">{af.title}</span>{" "}
                <span className="text-muted-foreground">{af.description}</span>
              </span>
            </p>
            <a
              href={buildWhatsAppLink(whatsappNumero, MENSAJE_AFILIADOS)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit shrink-0 rounded-lg border border-primary/40 bg-background px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {af.cta}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
