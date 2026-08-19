import {
  Bot,
  CalendarCheck,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  Server,
} from "lucide-react";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { getDictionary } from "@/lib/i18n/locale";

const ICONS = [LayoutTemplate, Server, LayoutDashboard, Bot, CalendarCheck, Layers];

export async function WebDevTypes() {
  const { dict } = await getDictionary();

  return (
    <section id="tipos" className="flex min-h-screen items-center border-b border-border bg-card">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <ScrollReveal className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
            {dict.webdev.types.eyebrow}
          </span>
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            {dict.webdev.types.title}
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">{dict.webdev.types.description}</p>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dict.webdev.types.items.map((tipo, i) => {
            const Icon = ICONS[i];
            return (
              <ScrollReveal key={tipo.titulo} delayMs={i * 80}>
                <div className="flex h-full flex-col gap-3 rounded-xl border border-border/60 bg-background p-4 shadow-elevation-sm transition-shadow hover:shadow-elevation-md">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-heading text-sm font-semibold leading-snug">{tipo.titulo}</h3>
                  <p className="text-xs text-muted-foreground">{tipo.descripcion}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
