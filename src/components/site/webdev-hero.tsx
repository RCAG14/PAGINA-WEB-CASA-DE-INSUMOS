import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroBackground } from "@/components/site/hero-background";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { getHeroImagenes, getHeroVideo } from "@/lib/data/landing";
import { getDictionary } from "@/lib/i18n/locale";

// Velo mucho más liviano que el default de HeroBackground: el video/carrusel
// debe verse con claridad, no quedar tapado por un degradé oscuro pesado —
// mismo ajuste que el Hero del catálogo de cajas.
const HERO_OVERLAY = "bg-linear-to-t from-sidebar/60 via-sidebar/25 to-sidebar/10";

export async function WebDevHero() {
  const [heroVideo, heroImagenes, { dict }] = await Promise.all([
    getHeroVideo("webdev"),
    getHeroImagenes("webdev"),
    getDictionary(),
  ]);

  return (
    <section className="bg-blueprint-dark relative flex min-h-screen items-center overflow-hidden border-b border-sidebar-foreground/10">
      <HeroBackground
        video={heroVideo ? { url: heroVideo.url } : null}
        imagenes={heroImagenes.map((i) => ({ url: i.url }))}
        overlayClassName={HERO_OVERLAY}
      />

      <ScrollReveal className="relative mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent shadow-elevation-sm">
          <Code2 className="size-6 text-accent-foreground" strokeWidth={1.5} />
        </span>

        <span className="font-mono-technical text-xs font-semibold uppercase tracking-wider text-sidebar-foreground [text-shadow:0_1px_10px_rgba(0,0,0,0.4)]">
          {dict.webdev.hero.eyebrow}
        </span>
        <h1 className="max-w-2xl font-heading text-3xl font-bold leading-tight text-sidebar-foreground [text-shadow:0_2px_16px_rgba(0,0,0,0.45)] sm:text-4xl">
          {dict.webdev.hero.title}
        </h1>
        <p className="max-w-xl text-sm text-sidebar-foreground [text-shadow:0_1px_10px_rgba(0,0,0,0.4)] sm:text-base">
          {dict.webdev.hero.description}
        </p>

        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button
            render={<Link href="#paquetes" />}
            nativeButton={false}
            size="lg"
            variant="secondary"
            className="shadow-elevation-md"
          >
            {dict.webdev.hero.ctaPricing}
            <ArrowRight className="size-4" />
          </Button>
          <Button
            render={<Link href="#tipos" />}
            nativeButton={false}
            size="lg"
            variant="outline"
            className="border-2 border-sidebar-foreground bg-sidebar-foreground/10 text-sidebar-foreground backdrop-blur-sm hover:bg-sidebar-foreground/20"
          >
            {dict.webdev.hero.ctaTypes}
          </Button>
        </div>
      </ScrollReveal>
    </section>
  );
}
