import {
  AtSign,
  Camera,
  Link2,
  Mail,
  Music2,
  Square,
  ThumbsUp,
  Video,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { getNumeroWhatsappPrincipal, getRedesSociales } from "@/lib/data/contacto";
import { getLogo } from "@/lib/data/landing";
import { getDictionary } from "@/lib/i18n/locale";
import { LandingServiceButtons } from "@/components/site/landing-service-buttons";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { AccountNav } from "@/components/site/account-nav";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { ScrollDownButton } from "@/components/site/scroll-down-button";
import { WhatsAppBubble } from "@/components/site/whatsapp-bubble";
import { getSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const PLATAFORMA_LABEL: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X / Twitter",
  otro: "Sitio",
};

const PLATAFORMA_ICON: Record<string, LucideIcon> = {
  instagram: Camera,
  facebook: ThumbsUp,
  tiktok: Music2,
  youtube: Video,
  x: AtSign,
  otro: Link2,
};

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? null;

export async function LandingScreen() {
  const [logo, redesSociales, whatsappNumero, { dict }, session] = await Promise.all([
    getLogo(),
    getRedesSociales(),
    getNumeroWhatsappPrincipal(),
    getDictionary(),
    getSession(),
  ]);

  return (
    <div className="flex h-screen flex-col snap-y snap-proximity overflow-y-auto scroll-smooth">
      <section className="bg-blueprint-dark relative flex min-h-screen shrink-0 snap-start items-center overflow-hidden border-b border-sidebar-foreground/10">
        <LanguageSwitcher className="absolute left-4 top-4 text-sidebar-foreground sm:left-6 sm:top-6" />
        <AccountNav
          session={session ? { nombre: session.nombre, rol: session.rol } : null}
          className="absolute right-4 top-4 text-sidebar-foreground sm:right-6 sm:top-6"
        />

        <ScrollReveal className="relative mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6">
          <span
            className={cn(
              "relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-sidebar-foreground/20 shadow-glow-accent",
              logo ? "bg-sidebar-foreground/95" : "bg-sidebar-foreground/5"
            )}
          >
            {logo ? (
              <Image
                src={logo.url}
                alt="Casa Insumos"
                fill
                sizes="64px"
                className="object-contain p-1.5"
              />
            ) : (
              <Square className="size-7 text-sidebar-foreground" strokeWidth={2} />
            )}
          </span>

          <h1 className="font-heading text-4xl font-bold uppercase tracking-wide text-sidebar-foreground sm:text-5xl">
            Casa Insumos
          </h1>
          <p className="font-mono-technical text-xs uppercase tracking-wider text-sidebar-foreground/70 sm:text-sm">
            {dict.homeLanding.tagline}
          </p>
          <p className="max-w-xl text-base text-sidebar-foreground/80 sm:text-lg">
            {dict.homeLanding.description}
          </p>

          <ScrollDownButton
            targetId="landing-servicios"
            label={dict.homeLanding.scrollToServices}
            className="mt-4 text-sidebar-foreground"
          />
        </ScrollReveal>
      </section>

      <section
        id="landing-servicios"
        className="flex min-h-screen shrink-0 snap-start items-center border-b border-border bg-background"
      >
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
          <ScrollReveal className="mb-8 flex flex-col items-center gap-2 text-center">
            <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
              {dict.homeLanding.servicesEyebrow}
            </span>
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              {dict.homeLanding.servicesTitle}
            </h2>
          </ScrollReveal>
          <LandingServiceButtons />
        </div>
      </section>

      <footer className="shrink-0 snap-start bg-sidebar text-sidebar-foreground">
        <ScrollReveal className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6">
          <span className="font-heading text-sm font-bold uppercase tracking-wide">
            Casa Insumos
          </span>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {CONTACT_EMAIL && (
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 text-sm text-sidebar-foreground/80 hover:text-accent"
              >
                <Mail className="size-3.5 shrink-0" strokeWidth={1.5} />
                {CONTACT_EMAIL}
              </a>
            )}
          </div>

          {redesSociales.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {redesSociales.map((r) => {
                const Icon = PLATAFORMA_ICON[r.plataforma] ?? Link2;
                return (
                  <a
                    key={r.id}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={PLATAFORMA_LABEL[r.plataforma] ?? r.plataforma}
                    className="flex items-center gap-1.5 border border-sidebar-foreground/20 px-2.5 py-1.5 text-xs text-sidebar-foreground/80 transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon className="size-3.5" strokeWidth={1.5} />
                    {PLATAFORMA_LABEL[r.plataforma] ?? r.plataforma}
                  </a>
                );
              })}
            </div>
          )}

          <p className="font-mono-technical text-[10px] uppercase tracking-wider text-sidebar-foreground/50">
            © 2026 Casa Insumos
          </p>
        </ScrollReveal>
      </footer>

      <WhatsAppBubble numero={whatsappNumero} />
    </div>
  );
}
