import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroBackground } from "@/components/site/hero-background";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { ScrollDownButton } from "@/components/site/scroll-down-button";
import { getHeroDecoracion, getHeroImagenes } from "@/lib/data/landing";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import { getDictionary } from "@/lib/i18n/locale";
import { buildWhatsAppLink } from "@/lib/utils";

const MENSAJE_COTIZACION = "Hola, vengo de la página y quisiera solicitar una cotización.";
const HERO_CAROUSEL_INTERVAL_MS = 5000;

export async function HomeHero() {
  const [imagenes, decoracion, whatsappNumero, { dict }] = await Promise.all([
    getHeroImagenes("cajas"),
    getHeroDecoracion(),
    getNumeroWhatsappPrincipal(),
    getDictionary(),
  ]);
  const quoteHref = whatsappNumero
    ? buildWhatsAppLink(whatsappNumero, MENSAJE_COTIZACION)
    : "#servicios";

  return (
    <section className="flex min-h-screen items-start border-b border-border bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
        <ScrollReveal className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-border shadow-elevation-lg">
          {imagenes.length > 0 ? (
            <HeroBackground
              video={null}
              imagenes={imagenes.map((i) => ({ url: i.url }))}
              intervalMs={HERO_CAROUSEL_INTERVAL_MS}
              overlayClassName=""
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-secondary">
              <Boxes className="size-16 text-primary" strokeWidth={1.25} />
              <span className="font-mono-technical text-xs text-muted-foreground">
                {dict.about.uploadPlaceholder}
              </span>
            </div>
          )}
        </ScrollReveal>

        <div className="relative isolate flex flex-col items-start gap-6">
          {decoracion && (
            // `isolate` en el padre es necesario: sin una nueva stacking context ahí,
            // este `-z-10` se escapa por detrás del fondo de la sección entera y
            // desaparece, en vez de quedar solo detrás del texto.
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 opacity-35 sm:-inset-10"
              style={{
                // `white` (no `black`) en el extremo visible: algunos motores
                // interpretan el mask-image por luminancia, donde negro se lee
                // como oculto sin importar su alpha — eso invertía el desvanecimiento.
                maskImage: "linear-gradient(to right, white 0%, transparent 90%)",
                WebkitMaskImage: "linear-gradient(to right, white 0%, transparent 90%)",
              }}
            >
              <Image src={decoracion.url} alt="" fill sizes="600px" className="object-cover" />
            </div>
          )}

          <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
            Casa Insumos
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-foreground/80 sm:text-lg">
            {dict.homeLanding.description}
          </p>

          <div className="flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row">
            <Button
              render={<Link href="/cajas-devoluciones-amazon-bolivia" />}
              nativeButton={false}
              size="lg"
              className="group"
            >
              {dict.homeLanding.ctaCatalog}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              render={<a href={quoteHref} target="_blank" rel="noopener noreferrer" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="border-primary bg-background text-primary hover:bg-primary/5"
            >
              {dict.homeLanding.ctaQuote}
            </Button>
          </div>

          <ScrollDownButton
            targetId="servicios"
            label={dict.homeLanding.scrollToServices}
            className="mt-2 text-muted-foreground"
          />
        </div>
      </div>
    </section>
  );
}
