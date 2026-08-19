import Link from "next/link";
import { ArrowRight, Boxes, Calculator, Globe2, MonitorCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { getDictionary } from "@/lib/i18n/locale";
import { cn } from "@/lib/utils";

const SERVICE_ICONS = [Boxes, Calculator, Globe2, MonitorCog];
const SERVICE_HREFS: (string | undefined)[] = ["#catalogo", undefined, undefined, undefined];

export async function ServicesSection() {
  const { dict } = await getDictionary();

  return (
    <section id="servicios" className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6">
        <ScrollReveal className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
            {dict.services.eyebrow}
          </span>
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">{dict.services.title}</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">{dict.services.description}</p>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dict.services.items.map((service, i) => {
            const Icon = SERVICE_ICONS[i];
            const href = SERVICE_HREFS[i];
            return (
              <ScrollReveal key={service.titulo} delayMs={i * 80}>
                <div className="flex h-full flex-col gap-3 rounded-xl border border-border/60 bg-background p-4 shadow-elevation-sm transition-shadow hover:shadow-elevation-md">
                  <div className="flex items-center justify-between">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" strokeWidth={1.5} />
                    </span>
                    <span className="font-mono-technical text-[10px] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}/04
                    </span>
                  </div>

                  <h3 className="font-heading text-sm font-semibold leading-snug">{service.titulo}</h3>
                  <p className="flex-1 text-xs text-muted-foreground">{service.descripcion}</p>

                  {href ? (
                    <Button
                      render={<Link href={href} />}
                      nativeButton={false}
                      size="sm"
                      variant="secondary"
                      className="w-fit"
                    >
                      {"cta" in service ? service.cta : null}
                      <ArrowRight className="size-3.5" />
                    </Button>
                  ) : (
                    <span
                      className={cn(
                        "w-fit rounded-full border border-dashed border-accent bg-accent/10 px-2 py-1 font-mono-technical text-[10px] uppercase tracking-wider text-primary"
                      )}
                    >
                      {"tag" in service ? service.tag : null}
                    </span>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
