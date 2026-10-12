import { getLogo } from "@/lib/data/landing";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import { getDictionary } from "@/lib/i18n/locale";
import { getSession } from "@/lib/auth/session";
import { HomeHeader } from "@/components/site/home-header";
import { HomeFooter } from "@/components/site/home-footer";
import { LandingChoices } from "@/components/site/landing-choices";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { WhatsAppServicePicker } from "@/components/site/whatsapp-bubble";
import { MapPin, MessageCircle, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { HOME_CONTAINER } from "@/lib/layout";

const ABOUT_ICONS = [MapPin, MessageCircle, ListChecks];

export async function LandingScreen() {
  const [logo, whatsappNumero, { dict }, session] = await Promise.all([
    getLogo(),
    getNumeroWhatsappPrincipal(),
    getDictionary(),
    getSession(),
  ]);
  const logoUrl = logo?.url ?? null;

  return (
    <>
      <HomeHeader
        logoUrl={logoUrl}
        session={session ? { nombre: session.nombre, rol: session.rol } : null}
      />

      <main className="flex-1">
        <LandingChoices />

        <section id="sobre-nosotros" className="border-b border-border bg-muted/40">
          <div className={cn(HOME_CONTAINER, "flex flex-col gap-8 py-12 lg:gap-10 lg:py-16")}>
            {/* Escritorio: texto a la izquierda y puntos apilados a la derecha, para
                no dejar media pantalla vacía. Tablet: puntos en 3 columnas debajo. */}
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
              <ScrollReveal className="flex flex-col gap-3">
                <span className="font-mono-technical text-sm text-primary">
                  {dict.homeLanding.aboutEyebrow}
                </span>
                <h2 className="text-balance font-heading text-2xl font-semibold sm:text-3xl">
                  {dict.homeLanding.aboutTitle}
                </h2>
                <p className="text-base leading-relaxed text-foreground/80">
                  {dict.homeLanding.aboutDescription}
                </p>
              </ScrollReveal>

              <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {dict.homeLanding.aboutPoints.map((punto, i) => {
                  const Icon = ABOUT_ICONS[i];
                  return (
                    <li key={punto.titulo}>
                      <ScrollReveal delayMs={i * 80} className="h-full">
                        <div className="flex h-full items-start gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-elevation-sm sm:flex-col sm:gap-3 sm:p-5 lg:flex-row lg:items-center lg:gap-4">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="size-5" strokeWidth={1.75} />
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <h3 className="font-heading text-base font-semibold">{punto.titulo}</h3>
                            <p className="text-sm text-muted-foreground">{punto.descripcion}</p>
                          </div>
                        </div>
                      </ScrollReveal>
                    </li>
                  );
                })}
              </ul>
            </div>

            {whatsappNumero && (
              <ScrollReveal className="flex flex-col items-start gap-4 rounded-2xl bg-primary p-6 text-primary-foreground shadow-elevation-md sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div className="flex flex-col gap-1">
                  <h2 className="font-heading text-xl font-semibold sm:text-2xl">
                    {dict.homeLanding.contactTitle}
                  </h2>
                  <p className="text-sm text-primary-foreground/85 sm:text-base">
                    {dict.homeLanding.contactDescription}
                  </p>
                </div>
                <WhatsAppServicePicker
                  numero={whatsappNumero}
                  className="flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary shadow-elevation-sm transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                >
                  {dict.homeLanding.contactCta}
                </WhatsAppServicePicker>
              </ScrollReveal>
            )}
          </div>
        </section>
      </main>

      <HomeFooter
        logoUrl={logoUrl}
        whatsappNumero={whatsappNumero}
        containerClassName={HOME_CONTAINER}
      />
    </>
  );
}
