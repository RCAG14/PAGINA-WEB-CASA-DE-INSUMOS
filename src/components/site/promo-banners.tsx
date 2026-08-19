import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { getBannersPromo } from "@/lib/data/landing";
import { getDictionary } from "@/lib/i18n/locale";

export async function PromoBanners() {
  const [banners, { dict }] = await Promise.all([getBannersPromo(), getDictionary()]);
  if (banners.length === 0) return null;

  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ScrollReveal className="mb-6 flex flex-col items-center gap-1 text-center">
          <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
            {dict.promo.eyebrow}
          </span>
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">{dict.promo.title}</h2>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner, i) => {
            const content = (
              <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/60 shadow-elevation-sm transition-shadow hover:shadow-elevation-lg">
                <Image
                  src={banner.url}
                  alt={banner.titulo ?? ""}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {(banner.titulo || banner.texto_cta) && (
                  <div className="absolute inset-0 flex flex-col justify-end gap-1 bg-linear-to-t from-primary/90 via-primary/10 to-transparent p-4">
                    {banner.titulo && (
                      <p className="font-heading text-sm font-semibold text-primary-foreground">
                        {banner.titulo}
                      </p>
                    )}
                    {banner.subtitulo && (
                      <p className="text-xs text-primary-foreground/80">{banner.subtitulo}</p>
                    )}
                    {banner.texto_cta && (
                      <span className="mt-1 inline-flex w-fit items-center gap-1 font-mono-technical text-[11px] uppercase tracking-wider text-accent">
                        {banner.texto_cta}
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    )}
                  </div>
                )}
              </div>
            );

            return (
              <ScrollReveal key={banner.id} delayMs={i * 80}>
                {banner.enlace_cta ? (
                  <Link href={banner.enlace_cta}>{content}</Link>
                ) : (
                  <div>{content}</div>
                )}
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
