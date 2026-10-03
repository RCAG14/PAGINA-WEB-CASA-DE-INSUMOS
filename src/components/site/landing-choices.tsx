import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Boxes, MonitorCog, type LucideIcon } from "lucide-react";
import { getHeroImagenes } from "@/lib/data/landing";
import { getDictionary } from "@/lib/i18n/locale";
import { ScrollReveal } from "@/components/site/scroll-reveal";

type Opcion = {
  href: string;
  icon: LucideIcon;
  imagenUrl: string | null;
  eyebrow: string;
  titulo: string;
  descripcion: string;
  cta: string;
};

/**
 * Portada: dos opciones grandes que llevan directo a cada línea de negocio.
 * Usa la primera imagen del hero de cada sitio como fondo del panel.
 */
export async function LandingChoices() {
  const [imagenesCajas, imagenesWebdev, { dict }] = await Promise.all([
    getHeroImagenes("cajas"),
    getHeroImagenes("webdev"),
    getDictionary(),
  ]);
  const t = dict.homeLanding.choices;

  const opciones: Opcion[] = [
    {
      href: "/cajas-devoluciones-amazon-bolivia",
      icon: Boxes,
      imagenUrl: imagenesCajas[0]?.url ?? null,
      ...t.cajas,
    },
    {
      href: "/desarrollo-web",
      icon: MonitorCog,
      imagenUrl: imagenesWebdev[0]?.url ?? null,
      ...t.webdev,
    },
  ];

  return (
    <section
      id="servicios"
      // Ocupa el primer pantallazo (menos el header) para que las dos opciones
      // se vean completas al entrar, sin tener que hacer scroll.
      className="flex scroll-mt-20 border-b border-border bg-background md:min-h-[calc(100svh-4.75rem)]"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:py-8">
        {/* Sin título visible (las dos tarjetas hablan por sí solas), pero la
            página necesita un h1 para buscadores y lectores de pantalla. */}
        <h1 className="sr-only">{t.title}</h1>

        <ul className="grid gap-4 sm:gap-5 md:flex-1 md:grid-cols-2">
          {opciones.map(
            ({ href, icon: Icon, imagenUrl, eyebrow, titulo, descripcion, cta }, i) => (
              <li key={href} className="flex flex-col">
                <ScrollReveal delayMs={150 + i * 120} className="flex flex-1 flex-col">
                  <Link
                    href={href}
                    className="group relative isolate flex flex-1 min-h-80 flex-col justify-end overflow-hidden rounded-2xl border border-primary/25 bg-secondary p-6 text-white shadow-elevation-sm outline-none transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-elevation-lg focus-visible:-translate-y-1 focus-visible:ring-4 focus-visible:ring-primary/40 active:translate-y-0 active:scale-[0.99] motion-reduce:transform-none sm:p-8 md:min-h-[26rem] lg:min-h-[30rem]"
                  >
                    {imagenUrl ? (
                      <Image
                        src={imagenUrl}
                        alt=""
                        fill
                        priority
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none"
                      />
                    ) : (
                      <div className="absolute inset-0 -z-20 bg-primary" />
                    )}
                    <div
                      aria-hidden
                      className="absolute inset-0 -z-10 bg-linear-to-t from-black/90 via-black/50 to-black/10 transition-opacity duration-300 group-hover:opacity-90"
                    />

                    <span className="mb-auto flex size-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm sm:size-14">
                      <Icon className="size-6 sm:size-7" strokeWidth={1.5} />
                    </span>

                    <span className="mt-6 font-mono-technical text-xs uppercase tracking-wider text-white/75">
                      {eyebrow}
                    </span>
                    <h2 className="mt-1.5 font-heading text-2xl font-bold leading-tight sm:text-3xl">
                      {titulo}
                    </h2>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                      {descripcion}
                    </p>
                    <span className="mt-5 flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-elevation-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground group-focus-visible:bg-primary group-focus-visible:text-primary-foreground">
                      {cta}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                    </span>
                  </Link>
                </ScrollReveal>
              </li>
            )
          )}
        </ul>
      </div>
    </section>
  );
}
