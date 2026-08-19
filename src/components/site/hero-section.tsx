import Link from "next/link";
import { ArrowRight, Boxes, ClipboardCheck, PackageCheck, ScanBarcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroBackground } from "@/components/site/hero-background";
import { CartSheet } from "@/components/site/cart-sheet";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { getHeroImagenes, getHeroVideo } from "@/lib/data/landing";
import { getDictionary } from "@/lib/i18n/locale";

const TRUST_ICONS = [PackageCheck, ClipboardCheck, ScanBarcode, Boxes];

export async function HeroSection() {
  const [heroVideo, heroImagenes, { dict }] = await Promise.all([
    getHeroVideo("cajas"),
    getHeroImagenes("cajas"),
    getDictionary(),
  ]);

  return (
    <section className="relative overflow-hidden border-b border-border bg-primary">
      <Link
        href="/"
        className="absolute left-4 top-4 z-10 font-mono-technical text-[11px] uppercase tracking-wider text-sidebar-foreground/60 transition-colors hover:text-sidebar-foreground sm:left-6 sm:top-6"
      >
        {dict.webdev.backHome}
      </Link>
      <LanguageSwitcher
        className="absolute right-14 top-4 z-10 text-sidebar-foreground sm:right-16 sm:top-6"
      />
      {/* Fijo (no absolute): a diferencia del resto de los controles del hero,
          el carrito debe seguir visible durante todo el scroll del catálogo. */}
      <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
        <CartSheet />
      </div>
      <HeroBackground
        video={heroVideo ? { url: heroVideo.url } : null}
        imagenes={heroImagenes.map((i) => ({ url: i.url }))}
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
        <div className="flex flex-col gap-6">
          <span className="animate-in fade-in-0 slide-in-from-bottom-2 inline-flex w-fit items-center gap-2 rounded-full border border-dashed border-sidebar-foreground/40 px-2.5 py-1 font-mono-technical text-[11px] uppercase tracking-wider text-sidebar-foreground/80 duration-700 fill-mode-backwards">
            {dict.hero.badge}
          </span>
          <h1 className="animate-in fade-in-0 slide-in-from-bottom-3 max-w-xl font-heading text-3xl font-semibold leading-tight text-sidebar-foreground duration-700 delay-100 fill-mode-backwards sm:text-4xl lg:text-5xl">
            {dict.hero.title}
          </h1>
          <p className="animate-in fade-in-0 slide-in-from-bottom-3 max-w-lg text-sm text-sidebar-foreground/75 duration-700 delay-200 fill-mode-backwards sm:text-base">
            {dict.hero.description}
          </p>
          <div className="animate-in fade-in-0 slide-in-from-bottom-3 flex flex-wrap gap-3 duration-700 delay-300 fill-mode-backwards">
            <Button
              render={<Link href="#catalogo" />}
              nativeButton={false}
              size="lg"
              variant="secondary"
              className="group"
            >
              {dict.hero.ctaCatalog}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              render={<Link href="#servicios" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="border-sidebar-foreground/30 bg-transparent text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"
            >
              {dict.hero.ctaHowItWorks}
            </Button>
          </div>

          <dl className="animate-in fade-in-0 mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-sidebar-foreground/15 duration-700 delay-500 fill-mode-backwards sm:grid-cols-4">
            {dict.hero.stats.map((s) => (
              <div
                key={s.label}
                className="bg-sidebar-foreground/10 px-3 py-3 backdrop-blur-sm"
              >
                <dt className="font-mono-technical text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
                  {s.label}
                </dt>
                <dd className="font-heading text-lg font-semibold text-sidebar-foreground">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          id="como-funciona"
          className="animate-in fade-in-0 slide-in-from-right-4 relative rounded-xl border border-sidebar-foreground/15 bg-sidebar-foreground/4 p-5 shadow-elevation-md backdrop-blur-sm duration-700 delay-200 fill-mode-backwards"
        >
          <p className="mb-4 font-mono-technical text-[11px] uppercase tracking-wider text-sidebar-foreground/60">
            {dict.hero.trustLabel}
          </p>
          <ul className="flex flex-col gap-3">
            {dict.hero.trustItems.map((label, i) => {
              const Icon = TRUST_ICONS[i];
              return (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-lg border border-sidebar-foreground/10 bg-sidebar-accent/60 px-3 py-2.5"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-accent/50 font-mono-technical text-[11px] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="size-4 shrink-0 text-accent" strokeWidth={1.5} />
                  <span className="text-sm text-sidebar-foreground/90">{label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
