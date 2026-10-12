import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCajas } from "@/lib/data/cajas";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import { formatPrice } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/locale";
import { HOME_CONTAINER } from "@/lib/layout";
import { buildWhatsAppLink, cn } from "@/lib/utils";
import { MENSAJES_WHATSAPP } from "@/lib/whatsapp";

/**
 * Hero del catálogo de cajas: mismo esquema que el de desarrollo web (verde de
 * la marca + ilustración propia a la derecha). Los datos de la franja salen de
 * la base, no de textos fijos, para que siempre sean exactos.
 */
export async function HeroSection() {
  const [cajas, whatsappNumero, { dict }] = await Promise.all([
    getCajas(),
    getNumeroWhatsappPrincipal(),
    getDictionary(),
  ]);
  const t = dict.hero;

  const disponibles = cajas.filter((c) => c.stock > 0);
  const precioDesde = disponibles.length
    ? Math.min(...disponibles.map((c) => c.precio))
    : null;
  const categorias = new Set(cajas.map((c) => c.clasificacion.slug)).size;

  const facts = [
    { label: t.factAvailable, value: String(disponibles.length) },
    precioDesde !== null && { label: t.factPriceFrom, value: formatPrice(precioDesde) },
    categorias > 0 && { label: t.factCategories, value: String(categorias) },
  ].filter((f): f is { label: string; value: string } => Boolean(f));

  return (
    <section className="bg-blueprint-dark relative overflow-hidden border-b border-sidebar-foreground/10">
      {/* Sin ScrollReveal: es el primer pantallazo. */}
      <div
        className={cn(
          HOME_CONTAINER,
          "relative grid items-center gap-10 py-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:py-14"
        )}
      >
        <div className="flex max-w-2xl flex-col gap-5 text-sidebar-foreground">
          <span className="font-mono-technical text-xs font-semibold uppercase tracking-wider text-chart-4">
            {t.badge}
          </span>
          <h1 className="text-pretty font-heading text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl">
            {t.title}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-sidebar-foreground/90 sm:text-lg">
            {t.description}
          </p>

          <ul className="grid gap-2 sm:grid-cols-2">
            {t.chips.map((chip) => (
              <li key={chip} className="flex items-center gap-2 text-sm">
                <Check className="size-4 shrink-0 text-chart-4" strokeWidth={2.5} />
                {chip}
              </li>
            ))}
          </ul>

          <div className="mt-1 flex flex-wrap gap-3">
            <Button
              render={<Link href="#catalogo" />}
              nativeButton={false}
              size="lg"
              variant="secondary"
              className="shadow-elevation-md"
            >
              {t.ctaCatalog}
              <ArrowRight className="size-4" />
            </Button>
            {whatsappNumero && (
              <Button
                render={
                  <a
                    href={buildWhatsAppLink(whatsappNumero, MENSAJES_WHATSAPP.cajas)}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                nativeButton={false}
                size="lg"
                variant="outline"
                className="border-2 border-sidebar-foreground bg-sidebar-foreground/10 text-sidebar-foreground backdrop-blur-sm hover:bg-sidebar-foreground/20"
              >
                <MessageCircle className="size-4" />
                {t.ctaWhatsapp}
              </Button>
            )}
          </div>

          {facts.length > 0 && (
            <dl className="mt-2 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-sidebar-foreground/20">
              {facts.map((f) => (
                <div key={f.label} className="bg-sidebar/60 px-3 py-3 sm:px-4">
                  <dt className="text-xs text-sidebar-foreground/75">{f.label}</dt>
                  <dd className="font-heading text-base font-semibold sm:text-lg">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <Image
          src="/portada/hero-cajas.svg"
          alt=""
          width={790}
          height={545}
          priority
          className="hidden h-auto w-full drop-shadow-2xl lg:block"
        />
      </div>
    </section>
  );
}
