import Link from "next/link";
import { ExternalLink, Link2, Mail, MapPin, MessageCircle } from "lucide-react";
import { getNumeroWhatsappPrincipal, getRedesSociales } from "@/lib/data/contacto";
import { getLogo } from "@/lib/data/landing";
import { HOME_CONTAINER } from "@/lib/layout";
import type { SeccionSitio } from "@/lib/secciones";
import { getDictionary } from "@/lib/i18n/locale";
import { getPlataformaRedSocial, getRedSocialHref } from "@/lib/redes-sociales";
import { buildWhatsAppLink, cn } from "@/lib/utils";
import { BrandMark } from "@/components/site/brand-mark";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Vacía o con solo espacios cuenta como "sin correo": antes dibujaba una fila sin texto.
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null;
// Solo las URLs de "Insertar un mapa" se pueden cargar en un iframe; un enlace
// para compartir (maps.app.goo.gl/...) Google lo bloquea y queda un recuadro vacío.
const MAPS_EMBED_URL = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL?.startsWith(
  "https://www.google.com/maps/embed"
)
  ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL
  : null;
const MAPS_LINK = "https://maps.app.goo.gl/w8YaHofM24kX5KN97";

const COLUMN_TITLE = "font-mono-technical text-xs uppercase tracking-wider text-sidebar-foreground/50";
const CONTACT_LINK =
  "flex items-center gap-2.5 text-sm text-sidebar-foreground/85 transition-colors hover:text-accent";

/**
 * Footer reutilizable del sitio público: `<SiteFooter seccion="webdev" />`.
 * Busca por su cuenta logo, WhatsApp, redes y textos; la sección solo elige
 * la descripción (cada negocio describe únicamente lo suyo).
 *
 * Columnas en escritorio (marca | contacto | servicios) y apiladas en celular.
 * `id` cambia el ancla cuando la página ya tiene su propio bloque "#contacto"
 * (desarrollo web).
 */
export async function SiteFooter({
  seccion,
  id = "contacto",
}: {
  seccion: SeccionSitio;
  id?: string;
}) {
  const [logo, whatsappNumero, redesSociales, { dict }] = await Promise.all([
    getLogo(),
    getNumeroWhatsappPrincipal(),
    getRedesSociales(),
    getDictionary(),
  ]);
  const logoUrl = logo?.url ?? null;
  const description = {
    portada: dict.footer.description,
    cajas: dict.footer.cajasDescription,
    webdev: dict.webdev.contact.footerDescription,
  }[seccion];
  const containerClassName = HOME_CONTAINER;
  const servicios = dict.homeLanding.choices;

  return (
    <footer id={id} className="scroll-mt-20 border-t border-border bg-sidebar text-sidebar-foreground">
      <div
        className={cn(
          "grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-12",
          containerClassName
        )}
      >
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <BrandMark
              logoUrl={logoUrl}
              size={56}
              className="text-sidebar-foreground"
              glyphClassName="text-sidebar-foreground"
            />
            <span className="font-heading text-xl font-bold tracking-tight">Casa Insumos</span>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-sidebar-foreground/70">
            {description}
          </p>

          {redesSociales.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
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
                          className="flex size-10 items-center justify-center rounded-full border border-sidebar-foreground/20 text-sidebar-foreground/80 transition-colors hover:border-accent hover:text-accent"
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
          )}
        </div>

        <div className="flex flex-col gap-4">
          <p className={COLUMN_TITLE}>{dict.footer.quickContactTitle}</p>
          <ul className="flex flex-col gap-3">
            {whatsappNumero && (
              <li>
                <a
                  href={buildWhatsAppLink(whatsappNumero, dict.homeLanding.contactMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CONTACT_LINK}
                >
                  <MessageCircle className="size-4 shrink-0" strokeWidth={1.75} />
                  WhatsApp
                </a>
              </li>
            )}
            {CONTACT_EMAIL && (
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className={cn(CONTACT_LINK, "break-all")}>
                  <Mail className="size-4 shrink-0" strokeWidth={1.75} />
                  {CONTACT_EMAIL}
                </a>
              </li>
            )}
            <li>
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className={CONTACT_LINK}>
                <MapPin className="size-4 shrink-0" strokeWidth={1.75} />
                {dict.footer.mapLink}
                <ExternalLink className="size-3.5 shrink-0 opacity-60" strokeWidth={1.75} />
              </a>
            </li>
          </ul>
          {MAPS_EMBED_URL && (
            <div className="h-40 w-full overflow-hidden rounded-xl border border-sidebar-foreground/15 grayscale-20">
              <iframe
                src={MAPS_EMBED_URL}
                title={dict.footer.locationTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <p className={COLUMN_TITLE}>{dict.footer.servicesLink}</p>
          <ul className="flex flex-col gap-3">
            <li>
              <Link href="/cajas-devoluciones-amazon-bolivia" className={CONTACT_LINK}>
                {servicios.cajas.titulo}
              </Link>
            </li>
            <li>
              <Link href="/desarrollo-web" className={CONTACT_LINK}>
                {servicios.webdev.titulo}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Franja inferior con el copyright. */}
      <div className="border-t border-sidebar-foreground/10">
        <div
          className={cn(
            "flex py-5 sm:justify-end",
            containerClassName
          )}
        >
          <p className="font-mono-technical text-xs text-sidebar-foreground/50">
            {dict.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
