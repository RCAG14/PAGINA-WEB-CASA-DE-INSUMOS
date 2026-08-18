import { Star } from "lucide-react";
import { ScrollReveal } from "@/components/site/scroll-reveal";

export function WebDevReviews() {
  return (
    <section
      id="resenas"
      className="flex min-h-screen items-center border-b border-border bg-background"
    >
      <ScrollReveal className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-4 py-16 text-center sm:px-6">
        <span className="flex size-12 items-center justify-center border border-primary/30 bg-primary/5 text-primary">
          <Star className="size-6" strokeWidth={1.5} />
        </span>
        <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
          Reseñas de clientes
        </span>
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
          Todavía no publicamos reseñas de este servicio
        </h2>
        <span className="w-fit border border-dashed border-accent bg-accent/10 px-3 py-1.5 font-mono-technical text-[11px] uppercase tracking-wider text-primary">
          Próximamente
        </span>
      </ScrollReveal>
    </section>
  );
}
