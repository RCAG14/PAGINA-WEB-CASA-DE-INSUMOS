import { getLogo } from "@/lib/data/landing";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import { getDictionary } from "@/lib/i18n/locale";
import { getSession } from "@/lib/auth/session";
import { HomeHeader } from "@/components/site/home-header";
import { HomeFooter } from "@/components/site/home-footer";
import { HomeHero } from "@/components/site/home-hero";
import { LandingServiceButtons } from "@/components/site/landing-service-buttons";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { WhatsAppBubble } from "@/components/site/whatsapp-bubble";

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
        <HomeHero />

        <section
          id="sobre-nosotros"
          className="flex min-h-screen items-start border-b border-border bg-background"
        >
          <ScrollReveal className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 px-4 py-14 text-center sm:px-6">
            <span className="font-mono-technical text-sm text-primary">
              {dict.homeLanding.aboutEyebrow}
            </span>
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              {dict.homeLanding.aboutTitle}
            </h2>
            <p className="text-base leading-relaxed text-foreground/80">
              {dict.homeLanding.aboutDescription}
            </p>
          </ScrollReveal>
        </section>

        <section
          id="servicios"
          className="flex min-h-screen items-start border-b border-border bg-muted/40"
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
            <ScrollReveal className="mb-8 flex flex-col items-center gap-2 text-center">
              <span className="font-mono-technical text-sm text-primary">
                {dict.homeLanding.servicesEyebrow}
              </span>
              <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
                {dict.homeLanding.servicesTitle}
              </h2>
            </ScrollReveal>
            <LandingServiceButtons />
          </div>
        </section>
      </main>

      <HomeFooter logoUrl={logoUrl} />
      <WhatsAppBubble numero={whatsappNumero} />
    </>
  );
}
