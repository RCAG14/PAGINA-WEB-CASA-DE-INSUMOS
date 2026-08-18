import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { getDictionary } from "@/lib/i18n/locale";

export async function WebDevHero() {
  const { dict } = await getDictionary();

  return (
    <section className="bg-blueprint-dark relative flex min-h-screen items-center overflow-hidden border-b border-primary-foreground/10">
      <Link
        href="/"
        className="absolute left-4 top-4 font-mono-technical text-[11px] uppercase tracking-wider text-primary-foreground/60 transition-colors hover:text-primary-foreground sm:left-6 sm:top-6"
      >
        {dict.webdev.backHome}
      </Link>
      <LanguageSwitcher className="absolute right-4 top-4 text-primary-foreground sm:right-6 sm:top-6" />

      <ScrollReveal className="relative mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6">
        <span className="flex size-14 shrink-0 items-center justify-center border-2 border-primary-foreground/70 bg-primary-foreground/5">
          <Code2 className="size-6 text-primary-foreground" strokeWidth={1.5} />
        </span>

        <span className="font-mono-technical text-xs uppercase tracking-wider text-primary-foreground/70">
          {dict.webdev.hero.eyebrow}
        </span>
        <h1 className="max-w-2xl font-heading text-3xl font-bold leading-tight text-primary-foreground sm:text-4xl">
          {dict.webdev.hero.title}
        </h1>
        <p className="max-w-xl text-sm text-primary-foreground/80 sm:text-base">
          {dict.webdev.hero.description}
        </p>

        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button render={<Link href="#paquetes" />} nativeButton={false} size="lg" variant="secondary">
            {dict.webdev.hero.ctaPricing}
            <ArrowRight className="size-4" />
          </Button>
          <Button
            render={<Link href="#tipos" />}
            nativeButton={false}
            size="lg"
            variant="outline"
            className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            {dict.webdev.hero.ctaTypes}
          </Button>
        </div>
      </ScrollReveal>
    </section>
  );
}
