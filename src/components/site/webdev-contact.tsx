import { Link2, Mail, MapPin } from "lucide-react";
import { getRedesSociales } from "@/lib/data/contacto";
import { getDictionary } from "@/lib/i18n/locale";
import { getPlataformaRedSocial, getRedSocialHref } from "@/lib/redes-sociales";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? null;
const MAPS_EMBED_URL = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ?? null;
const MAPS_LINK = "https://maps.app.goo.gl/w8YaHofM24kX5KN97";

/**
 * Footer de desarrollo-web — mismo patrón visual que el footer de la home y
 * el catálogo (mapa a la izquierda, identidad a la derecha, redes sociales
 * solo con ícono), pero su propio componente con el copy propio de este
 * servicio ("Contanos tu proyecto"), no el genérico del resto del sitio.
 */
export async function WebDevContact() {
  const [redesSociales, { dict }] = await Promise.all([getRedesSociales(), getDictionary()]);

  return (
    <section
      id="contacto"
      className="flex min-h-screen items-center bg-sidebar text-sidebar-foreground"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-3">
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono-technical text-xs text-sidebar-foreground/50 hover:text-accent"
          >
            <MapPin className="size-3.5" strokeWidth={1.5} />
            {dict.webdev.contact.locationLabel}
          </a>
          {MAPS_EMBED_URL ? (
            <div className="h-64 w-full overflow-hidden rounded-xl border border-sidebar-foreground/15 grayscale-20 sm:h-72">
              <iframe
                src={MAPS_EMBED_URL}
                title="Ubicación de Casa Insumos"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
          ) : (
            <div className="flex h-56 w-full items-center justify-center rounded-xl border border-dashed border-sidebar-foreground/20 px-4 text-center font-mono-technical text-xs text-sidebar-foreground/40">
              {dict.webdev.contact.mapPlaceholder}
            </div>
          )}
        </div>

        <div className="flex flex-col items-start gap-5 lg:items-end lg:text-right">
          <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
            {dict.webdev.contact.eyebrow}
          </span>
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            {dict.webdev.contact.title}
          </h2>

          {CONTACT_EMAIL && (
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-1.5 text-sm text-sidebar-foreground/80 hover:text-accent"
            >
              <Mail className="size-3.5 shrink-0" strokeWidth={1.5} />
              {CONTACT_EMAIL}
            </a>
          )}

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            {redesSociales.map((r) => {
              const plataforma = getPlataformaRedSocial(r.plataforma);
              const Icon = plataforma?.icon ?? Link2;
              const esCorreo = r.plataforma === "email";
              return (
                <Tooltip key={r.id}>
                  <TooltipTrigger
                    render={
                      <a
                        href={getRedSocialHref(r.plataforma, r.url)}
                        target={esCorreo ? undefined : "_blank"}
                        rel={esCorreo ? undefined : "noopener noreferrer"}
                        aria-label={plataforma?.label ?? r.plataforma}
                        className="flex size-9 items-center justify-center rounded-full border border-sidebar-foreground/20 text-sidebar-foreground/80 transition-colors hover:border-accent hover:text-accent"
                      />
                    }
                  >
                    <Icon className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>{plataforma?.label ?? r.plataforma}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          <p className="font-mono-technical text-xs text-sidebar-foreground/50">
            {dict.webdev.contact.copyright}
          </p>
        </div>
      </div>
    </section>
  );
}
