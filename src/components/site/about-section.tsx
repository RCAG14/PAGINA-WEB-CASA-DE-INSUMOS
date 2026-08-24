import { Award, HandCoins, PackageSearch, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { MediaBox } from "@/components/site/media-box";
import { getAboutImagen } from "@/lib/data/landing";
import { getDictionary } from "@/lib/i18n/locale";

const VALUE_ICONS = [ShieldCheck, HandCoins, PackageSearch, Award];

export async function AboutSection() {
  const [aboutImagen, { dict }] = await Promise.all([getAboutImagen(), getDictionary()]);

  return (
    <section
      id="sobre-nosotros"
      className="flex min-h-screen items-start border-b border-border bg-background"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <MediaBox
          imagen={aboutImagen}
          alt="Casa Insumos"
          placeholderLabel={dict.about.uploadPlaceholder}
          sizes="(min-width: 1024px) 40vw, 100vw"
        />

        <div className="flex flex-col gap-6">
          <ScrollReveal delayMs={80} className="flex flex-col gap-2">
            <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
              {dict.about.eyebrow}
            </span>
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">{dict.about.title}</h2>
            <p className="max-w-xl text-sm text-muted-foreground">{dict.about.description}</p>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {dict.about.values.map((item, i) => {
              const Icon = VALUE_ICONS[i];
              return (
                <ScrollReveal key={item.titulo} delayMs={160 + i * 80}>
                  <div className="flex h-full flex-col gap-2 rounded-xl border border-border/60 bg-card p-4 shadow-elevation-sm transition-shadow hover:shadow-elevation-md">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" strokeWidth={1.5} />
                    </span>
                    <h3 className="font-heading text-sm font-semibold leading-snug">{item.titulo}</h3>
                    <p className="text-xs text-muted-foreground">{item.descripcion}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
