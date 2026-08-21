import Link from "next/link";
import { ArrowRight, Boxes, Calculator, Globe2, MonitorCog } from "lucide-react";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { getDictionary } from "@/lib/i18n/locale";

const ICONS = [Boxes, Calculator, Globe2, MonitorCog];
const HREFS: (string | undefined)[] = [
  "/cajas-devoluciones-amazon-bolivia",
  undefined,
  undefined,
  "/desarrollo-web",
];

export async function LandingServiceButtons() {
  const { dict } = await getDictionary();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {dict.landingServices.items.map((servicio, i) => {
        const Icon = ICONS[i];
        const href = HREFS[i];
        const disponible = Boolean(href);
        const contenido = (
          <>
            <div className="flex items-center justify-between">
              <span className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-6" strokeWidth={1.5} />
              </span>
              <span className="font-mono-technical text-[10px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}/04
              </span>
            </div>
            <h2 className="font-heading text-lg font-semibold leading-snug">{servicio.titulo}</h2>
            <p className="flex-1 text-sm text-muted-foreground">{servicio.descripcion}</p>
            {disponible ? (
              <span className="flex w-fit items-center gap-1.5 font-mono-technical text-[11px] uppercase tracking-wider text-primary">
                {"cta" in servicio ? servicio.cta : null}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            ) : (
              <span className="w-fit rounded-full border border-dashed border-accent bg-accent/10 px-2 py-1 font-mono-technical text-[10px] uppercase tracking-wider text-primary">
                {dict.landingServices.comingSoon}
              </span>
            )}
          </>
        );

        return (
          <ScrollReveal key={servicio.titulo} delayMs={i * 100}>
            {disponible ? (
              <Link
                href={href!}
                className="group flex h-full min-h-57.5 flex-col gap-3 rounded-xl border border-border/60 bg-card p-6 shadow-elevation-sm transition-[box-shadow,border-color] hover:border-primary/50 hover:shadow-elevation-lg"
              >
                {contenido}
              </Link>
            ) : (
              <div className="flex h-full min-h-57.5 flex-col gap-3 rounded-xl border border-border/60 bg-card p-6 opacity-80">
                {contenido}
              </div>
            )}
          </ScrollReveal>
        );
      })}
    </div>
  );
}
