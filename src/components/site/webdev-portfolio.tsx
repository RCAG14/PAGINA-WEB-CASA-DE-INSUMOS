import Link from "next/link";
import { ArrowUpRight, LayoutTemplate } from "lucide-react";
import { getTrabajosRealizados } from "@/lib/data/desarrollo";
import { getDictionary } from "@/lib/i18n/locale";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { WebDevPortfolioGrid } from "@/components/site/webdev-portfolio-grid";
import { HOME_CONTAINER } from "@/lib/layout";
import { cn } from "@/lib/utils";

export async function WebDevPortfolio() {
  const { locale, dict } = await getDictionary();
  const trabajos = await getTrabajosRealizados(locale);
  if (trabajos.length === 0) return null;

  return (
    <section
      id="trabajos"
      className="scroll-mt-20 border-b border-border bg-card"
    >
      <div className={cn(HOME_CONTAINER, "py-12 lg:py-16")}>
        <ScrollReveal className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
            {dict.webdev.portfolio.eyebrow}
          </span>
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            {dict.webdev.portfolio.title}
          </h2>
        </ScrollReveal>

        <WebDevPortfolioGrid
          showAllLabel={dict.webdev.portfolio.showAll}
          showLessLabel={dict.webdev.portfolio.showLess}
          items={trabajos.map((trabajo, i) => {
            const contenido = (
              <>
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  {trabajo.imagenUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={trabajo.imagenUrl}
                      alt={trabajo.titulo}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <LayoutTemplate className="size-8" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <span className="w-fit font-mono-technical text-xs uppercase tracking-wider text-accent">
                    {trabajo.categoria}
                  </span>
                  <h3 className="flex items-center gap-1.5 font-heading text-base font-semibold leading-snug">
                    {trabajo.titulo}
                    {trabajo.enlace && (
                      <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    )}
                  </h3>
                  {/* Recortada a 3 líneas: las descripciones vienen del admin con largos
                      muy distintos y desalineaban la grilla. */}
                  <p className="line-clamp-3 text-sm text-muted-foreground" title={trabajo.descripcion ?? undefined}>
                    {trabajo.descripcion}
                  </p>
                </div>
              </>
            );

            return (
              <ScrollReveal key={trabajo.id} delayMs={(i % 4) * 80} className="h-full">
                {trabajo.enlace ? (
                  <Link
                    href={trabajo.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-background shadow-elevation-sm transition-all hover:border-primary/60 hover:shadow-elevation-lg"
                  >
                    {contenido}
                  </Link>
                ) : (
                  <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-background shadow-elevation-sm">
                    {contenido}
                  </div>
                )}
              </ScrollReveal>
            );
          })}
        />
      </div>
    </section>
  );
}
