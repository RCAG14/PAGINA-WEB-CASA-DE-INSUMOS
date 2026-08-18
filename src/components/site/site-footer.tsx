import Link from "next/link";
import { Link2, Mail, MapPin, Square } from "lucide-react";
import { getClasificaciones } from "@/lib/data/clasificaciones";
import { getRedesSociales } from "@/lib/data/contacto";
import { getLogo } from "@/lib/data/landing";
import { getDictionary } from "@/lib/i18n/locale";
import { getSession } from "@/lib/auth/session";
import { getPlataformaRedSocial, getRedSocialHref } from "@/lib/redes-sociales";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? null;
const MAPS_EMBED_URL = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ?? null;

export async function SiteFooter() {
  const [classifications, redesSociales, logo, { dict }, session] = await Promise.all([
    getClasificaciones(),
    getRedesSociales(),
    getLogo(),
    getDictionary(),
    getSession(),
  ]);
  const isStaff = session?.rol === "JEFE" || session?.rol === "SOCIO";

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="flex flex-col gap-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center border-2 border-primary-foreground/50">
              <Square className="size-3.5" strokeWidth={2.5} />
            </span>
            <span className="font-heading text-sm font-bold uppercase tracking-wide">
              Casa de Insumos
            </span>
          </div>
          <p className="max-w-sm text-sm text-primary-foreground/70">{dict.footer.description}</p>
          {redesSociales.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {redesSociales.map((r) => {
                const plataforma = getPlataformaRedSocial(r.plataforma);
                const Icon = plataforma?.icon ?? Link2;
                const esCorreo = r.plataforma === "email";
                return (
                  <a
                    key={r.id}
                    href={getRedSocialHref(r.plataforma, r.url)}
                    target={esCorreo ? undefined : "_blank"}
                    rel={esCorreo ? undefined : "noopener noreferrer"}
                    aria-label={plataforma?.label ?? r.plataforma}
                    className="flex items-center gap-1.5 border border-primary-foreground/20 px-2.5 py-1.5 text-xs text-primary-foreground/80 transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon className="size-3.5" strokeWidth={1.5} />
                    {plataforma?.label ?? r.plataforma}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground/50">
            {dict.footer.classificationsTitle}
          </p>
          {classifications.map((c) => (
            <Link
              key={c.slug}
              href={`/catalogo#catalogo`}
              className="text-sm text-primary-foreground/80 hover:text-accent"
            >
              {c.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground/50">
            {dict.footer.quickContactTitle}
          </p>

          {CONTACT_EMAIL && (
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-accent"
            >
              <Mail className="size-3.5 shrink-0" strokeWidth={1.5} />
              {CONTACT_EMAIL}
            </a>
          )}

          <Link href="/catalogo#servicios" className="text-sm text-primary-foreground/80 hover:text-accent">
            {dict.footer.servicesLink}
          </Link>
          <Link href="/carrito" className="text-sm text-primary-foreground/80 hover:text-accent">
            {dict.footer.cartLink}
          </Link>
          {isStaff && (
            <Link href="/admin" className="text-sm text-primary-foreground/80 hover:text-accent">
              {dict.footer.adminLink}
            </Link>
          )}
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3">
          <p className="flex items-center gap-1.5 font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground/50">
            <MapPin className="size-3.5" strokeWidth={1.5} />
            {dict.footer.locationTitle}
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
              {dict.footer.mapPlaceholder}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p className="font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground/50">
            {dict.footer.copyright}
          </p>
          {logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo.url}
              alt="Casa de Insumos"
              className="h-7 w-auto shrink-0 object-contain opacity-90 sm:h-8"
            />
          )}
        </div>
      </div>
    </footer>
  );
}
