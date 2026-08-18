import {
  AtSign,
  Camera,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  ThumbsUp,
  Video,
  type LucideIcon,
} from "lucide-react";
import { getNumeroWhatsappPrincipal, getRedesSociales } from "@/lib/data/contacto";
import { buildWhatsAppLink } from "@/lib/utils";
import { ScrollReveal } from "@/components/site/scroll-reveal";

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
const MAPS_EMBED_URL = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ?? null;
const MENSAJE_WHATSAPP = "Hola, quiero más información sobre desarrollo web a medida.";

export async function WebDevContact() {
  const [whatsappNumero, redesSociales] = await Promise.all([
    getNumeroWhatsappPrincipal(),
    getRedesSociales(),
  ]);

  return (
    <section className="flex min-h-screen items-center bg-primary text-primary-foreground">
      <ScrollReveal className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6">
        <span className="font-mono-technical text-xs uppercase tracking-wider text-primary-foreground/70">
          Contacto
        </span>
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
          Contanos tu proyecto
        </h2>

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

        <div className="mt-4 flex w-full flex-col gap-3">
          <p className="flex items-center justify-center gap-1.5 font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground/50">
            <MapPin className="size-3.5" strokeWidth={1.5} />
            Ubicación
          </p>
          {MAPS_EMBED_URL ? (
            <div className="h-56 w-full overflow-hidden border border-primary-foreground/15 grayscale-20 sm:h-64">
              <iframe
                src={MAPS_EMBED_URL}
                title="Ubicación de Casa de Insumos"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
          ) : (
            <div className="flex h-32 w-full items-center justify-center border border-dashed border-primary-foreground/20 px-4 text-center font-mono-technical text-[11px] uppercase tracking-wider text-primary-foreground/40">
              Configura NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL en tu .env para mostrar el mapa
            </div>
          )}
        </div>

        <p className="mt-2 font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground/50">
          © 2026 Casa de Insumos
        </p>
      </ScrollReveal>
    </section>
  );
}
