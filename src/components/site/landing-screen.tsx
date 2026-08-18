import {
  AtSign,
  Camera,
  Link2,
  Mail,
  MessageCircle,
  Music2,
  Square,
  ThumbsUp,
  Video,
  type LucideIcon,
} from "lucide-react";
import { getNumeroWhatsappPrincipal, getRedesSociales } from "@/lib/data/contacto";
import { getLogo } from "@/lib/data/landing";
import { buildWhatsAppLink } from "@/lib/utils";
import { LandingServiceButtons } from "@/components/site/landing-service-buttons";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { ScrollDownButton } from "@/components/site/scroll-down-button";

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
const MENSAJE_WHATSAPP = "Hola, quiero más información sobre Casa de Insumos.";

export async function LandingScreen() {
  const [logo, redesSociales, whatsappNumero] = await Promise.all([
    getLogo(),
    getRedesSociales(),
    getNumeroWhatsappPrincipal(),
  ]);

  return (
    <div className="flex flex-col">
      <section className="bg-blueprint-dark relative flex min-h-screen items-center overflow-hidden border-b border-primary-foreground/10">
        <ScrollReveal className="relative mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6">
          <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden border-2 border-primary-foreground/70 bg-primary-foreground/5">
            {logo ? (
              // Logo cargado por el administrador — dimensiones/formato variables.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo.url}
                alt="Casa de Insumos"
                className="h-full w-full object-contain p-1.5"
              />
            ) : (
              <Square className="size-7 text-primary-foreground" strokeWidth={2} />
            )}
          </span>

          <h1 className="font-heading text-4xl font-bold uppercase tracking-wide text-primary-foreground sm:text-5xl">
            Casa de Insumos
          </h1>
          <p className="font-mono-technical text-xs uppercase tracking-wider text-primary-foreground/70 sm:text-sm">
            Distribución técnica por caja
          </p>
          <p className="max-w-xl text-base text-primary-foreground/80 sm:text-lg">
            Cajas de retorno de Amazon, cotizaciones, importaciones y desarrollo web a medida
            para revendedores e importadores.
          </p>

          <ScrollDownButton
            targetId="landing-servicios"
            label="Servicios"
            className="mt-4 text-primary-foreground"
          />
        </ScrollReveal>
      </section>

      <section
        id="landing-servicios"
        className="flex min-h-screen items-center border-b border-border bg-background"
      >
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
          <ScrollReveal className="mb-8 flex flex-col items-center gap-2 text-center">
            <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
              Nuestros servicios
            </span>
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              Elegí lo que necesitás
            </h2>
          </ScrollReveal>
          <LandingServiceButtons />
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground">
        <ScrollReveal className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6">
          <span className="font-heading text-sm font-bold uppercase tracking-wide">
            Casa de Insumos
          </span>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {whatsappNumero && (
              <a
                href={buildWhatsAppLink(whatsappNumero, MENSAJE_WHATSAPP)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent/25"
              >
                <MessageCircle className="size-4" strokeWidth={1.5} />
                WhatsApp directo
              </a>
            )}
            {CONTACT_EMAIL && (
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-accent"
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
                    className="flex items-center gap-1.5 border border-primary-foreground/20 px-2.5 py-1.5 text-xs text-primary-foreground/80 transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon className="size-3.5" strokeWidth={1.5} />
                    {PLATAFORMA_LABEL[r.plataforma] ?? r.plataforma}
                  </a>
                );
              })}
            </div>
          )}

          <p className="font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground/50">
            © 2026 Casa de Insumos
          </p>
        </ScrollReveal>
      </footer>
    </div>
  );
}
