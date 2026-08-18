import Link from "next/link";
import { ArrowUpRight, LayoutTemplate } from "lucide-react";
import { getTrabajosRealizados } from "@/lib/data/desarrollo";
import { ScrollReveal } from "@/components/site/scroll-reveal";

export async function WebDevPortfolio() {
  const trabajos = await getTrabajosRealizados();
  if (trabajos.length === 0) return null;

  return (
    <section
      id="trabajos"
      className="flex min-h-screen items-center border-b border-border bg-card"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <ScrollReveal className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
            Trabajos realizados
          </span>
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            Algunos proyectos que desarrollamos
          </h2>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trabajos.map((trabajo, i) => {
            const contenido = (
              <>
                <div className="relative aspect-video w-full overflow-hidden border border-border bg-muted">
                  {trabajo.imagen_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={trabajo.imagen_url}
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
                  <span className="w-fit font-mono-technical text-[10px] uppercase tracking-wider text-accent">
                    {trabajo.categoria}
                  </span>
                  <h3 className="flex items-center gap-1.5 font-heading text-sm font-semibold leading-snug">
                    {trabajo.titulo}
                    {trabajo.enlace && (
                      <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground">{trabajo.descripcion}</p>
                </div>
              </>
            );

            return (
              <ScrollReveal key={trabajo.id} delayMs={i * 80}>
                {trabajo.enlace ? (
                  <Link
                    href={trabajo.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col border border-border bg-background transition-colors hover:border-primary"
                  >
                    {contenido}
                  </Link>
                ) : (
                  <div className="group flex h-full flex-col border border-border bg-background">
                    {contenido}
                  </div>
                )}
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
