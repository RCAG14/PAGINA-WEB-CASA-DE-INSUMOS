import Link from "next/link";
import Image from "next/image";
import { Link2, Mail, MapPin, Square } from "lucide-react";
import { getClasificaciones } from "@/lib/data/clasificaciones";
import { getRedesSociales } from "@/lib/data/contacto";
import { getLogo } from "@/lib/data/landing";
import { getDictionary } from "@/lib/i18n/locale";
import { getSession } from "@/lib/auth/session";
import { getPlataformaRedSocial, getRedSocialHref } from "@/lib/redes-sociales";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? null;
const MAPS_EMBED_URL = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ?? null;
const MAPS_LINK = "https://maps.app.goo.gl/w8YaHofM24kX5KN97";

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
    <footer className="border-t border-border bg-sidebar text-sidebar-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="flex flex-col gap-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg border border-sidebar-foreground/30 bg-sidebar-foreground/5">
              <Square className="size-3.5" strokeWidth={2.5} />
            </span>
            <span className="font-heading text-sm font-bold uppercase tracking-wide">
              Casa Insumos
            </span>
          </div>
          <p className="max-w-sm text-sm text-sidebar-foreground/70">{dict.footer.description}</p>
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
                    className="flex items-center gap-1.5 rounded-full border border-sidebar-foreground/20 bg-sidebar-foreground/5 px-2.5 py-1.5 text-xs text-sidebar-foreground/80 transition-colors hover:border-accent hover:text-accent"
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
          <p className="font-mono-technical text-[10px] uppercase tracking-wider text-sidebar-foreground/50">
            {dict.footer.classificationsTitle}
          </p>
          {classifications.map((c) => (
            <Link
              key={c.slug}
              href={`/cajas-devoluciones-amazon-bolivia#catalogo`}
              className="text-sm text-sidebar-foreground/80 hover:text-accent"
            >
              {c.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-mono-technical text-[10px] uppercase tracking-wider text-sidebar-foreground/50">
            {dict.footer.quickContactTitle}
          </p>

          {CONTACT_EMAIL && (
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-2 text-sm text-sidebar-foreground/80 hover:text-accent"
            >
              <Mail className="size-3.5 shrink-0" strokeWidth={1.5} />
              {CONTACT_EMAIL}
            </a>
          )}

          <Link href="/cajas-devoluciones-amazon-bolivia#servicios" className="text-sm text-sidebar-foreground/80 hover:text-accent">
            {dict.footer.servicesLink}
          </Link>
          <Link href="/carrito" className="text-sm text-sidebar-foreground/80 hover:text-accent">
            {dict.footer.cartLink}
          </Link>
          {isStaff && (
            <Link href="/admin" className="text-sm text-sidebar-foreground/80 hover:text-accent">
              {dict.footer.adminLink}
            </Link>
          )}
        </div>
      </div>

      <div className="border-t border-sidebar-foreground/10 px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3">
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono-technical text-[10px] uppercase tracking-wider text-sidebar-foreground/50 hover:text-accent"
          >
            <MapPin className="size-3.5" strokeWidth={1.5} />
            {dict.footer.locationTitle}
          </a>
          {MAPS_EMBED_URL ? (
            <div className="h-56 w-full overflow-hidden rounded-xl border border-sidebar-foreground/15 grayscale-20 sm:h-64">
              <iframe
                src={MAPS_EMBED_URL}
                title="Ubicación de Casa Insumos"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
          ) : (
            <div className="flex h-32 w-full items-center justify-center rounded-xl border border-dashed border-sidebar-foreground/20 px-4 text-center font-mono-technical text-[11px] uppercase tracking-wider text-sidebar-foreground/40">
              {dict.footer.mapPlaceholder}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-sidebar-foreground/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p className="font-mono-technical text-[10px] uppercase tracking-wider text-sidebar-foreground/50">
            {dict.footer.copyright}
          </p>
          {logo && (
            <span className="flex shrink-0 items-center rounded-lg bg-sidebar-foreground/95 px-2.5 py-1.5">
              <Image
                src={logo.url}
                alt="Casa Insumos"
                width={140}
                height={28}
                className="h-6 w-auto object-contain sm:h-7"
              />
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
