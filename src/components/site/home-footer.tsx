import Link from "next/link";
import { ExternalLink, Link2, Mail, MapPin, MessageCircle } from "lucide-react";
import { getRedesSociales } from "@/lib/data/contacto";
import { getDictionary } from "@/lib/i18n/locale";
import { getPlataformaRedSocial, getRedSocialHref } from "@/lib/redes-sociales";
import { buildWhatsAppLink, cn } from "@/lib/utils";
import { BrandMark } from "@/components/site/brand-mark";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? null;
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
 * Footer propio de la home ("/") — deliberadamente simple y separado del
 * footer antiguo del flujo de compra (hoy lo usan todas las páginas): sin
 * listado de clasificaciones, solo identidad + contacto directo + servicios.
 *
 * Columnas en escritorio (marca | contacto | servicios) y apiladas en celular.
 * `containerClassName` permite alinearlo con el ancho de la página que lo usa;
 * `id` cambia el ancla cuando la página ya tiene su propio bloque "#contacto";
 * `description` reemplaza el texto general (cada negocio describe solo lo suyo).
 */
export async function HomeFooter({
  logoUrl,
  whatsappNumero = null,
  containerClassName = "mx-auto max-w-6xl px-4 sm:px-6",
  id = "contacto",
  description,
}: {
  logoUrl: string | null;
  whatsappNumero?: string | null;
  containerClassName?: string;
  id?: string;
  description?: string;
}) {
  const [redesSociales, { dict }] = await Promise.all([getRedesSociales(), getDictionary()]);
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
            {description ?? dict.footer.description}
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
