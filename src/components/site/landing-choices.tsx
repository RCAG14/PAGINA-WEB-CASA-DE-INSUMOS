import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight, Boxes, Check, MonitorCog, type LucideIcon } from "lucide-react";
import { getPrecioMinimoCajas } from "@/lib/data/cajas";
import { getPrecioMinimoPaquetes } from "@/lib/data/desarrollo";
import { formatPrice } from "@/lib/format";
import { HOME_CONTAINER } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n/locale";
import { ScrollReveal } from "@/components/site/scroll-reveal";

type Opcion = {
  href: string;
  icon: LucideIcon;
  imagenUrl: string;
  precioDesde: number | null;
  eyebrow: string;
  titulo: string;
  puntos: string[];
  cta: string;
};

/**
 * Portada: un encabezado corto que dice qué es Casa Insumos y dos opciones
 * grandes que llevan directo a cada línea de negocio. Cada tarjeta resume lo
 * esencial (puntos clave + precio de referencia) para decidir sin leer más.
 * El fondo de cada tarjeta es una ilustración propia en la paleta de la marca
 * (public/portada/), independiente del carrusel del hero de cada sitio.
 */
export async function LandingChoices() {
  const [precioCajas, precioPaquetes, { dict }] = await Promise.all([
    getPrecioMinimoCajas(),
    getPrecioMinimoPaquetes(),
    getDictionary(),
  ]);
  const t = dict.homeLanding.choices;

  const opciones: Opcion[] = [
    {
      href: "/cajas-devoluciones-amazon-bolivia",
      icon: Boxes,
      imagenUrl: "/portada/servicio-cajas.svg",
      precioDesde: precioCajas,
      ...t.cajas,
    },
    {
      href: "/desarrollo-web",
      icon: MonitorCog,
      imagenUrl: "/portada/servicio-webdev.svg",
      precioDesde: precioPaquetes,
      ...t.webdev,
    },
  ];

  return (
    <section
      id="servicios"
      // En escritorio ocupa el primer pantallazo (menos el header) para que el encabezado y
      // las dos opciones se vean completos al entrar, sin tener que hacer scroll.
      className="flex scroll-mt-20 border-b border-border bg-background lg:min-h-[calc(100svh-4.75rem)]"
    >
      <div className={cn(HOME_CONTAINER, "flex flex-col py-5 lg:py-6")}>
        {/* Sin ScrollReveal: está arriba del pliegue y no debe esperar al JS para verse.
            En pantallas anchas título e indicación comparten una sola franja para
            dejarle el máximo alto posible a las tarjetas. */}
        <div className="mb-4 flex flex-col gap-1.5 lg:mb-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-1">
            <span className="font-mono-technical text-xs uppercase tracking-wider text-primary">
              {t.eyebrow}
            </span>
            <h1 className="text-pretty font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl xl:text-[1.75rem]">
              {t.title}
            </h1>
          </div>
          <p className="flex shrink-0 items-center gap-2 text-base text-muted-foreground lg:pb-1">
            {t.subtitle}
            <ArrowDown className="hidden size-4 text-primary md:block" />
          </p>
        </div>

        <ul className="grid gap-4 md:grid-cols-2 lg:flex-1 lg:gap-6">
          {opciones.map(
            ({ href, icon: Icon, imagenUrl, precioDesde, eyebrow, titulo, puntos, cta }, i) => (
              <li key={href} className="flex flex-col">
                <ScrollReveal delayMs={150 + i * 120} className="flex flex-1 flex-col">
                  <Link
                    href={href}
                    className="group relative isolate flex flex-1 flex-col justify-end overflow-hidden rounded-2xl border border-primary/25 bg-primary p-6 text-white shadow-elevation-sm outline-none transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-elevation-lg focus-visible:-translate-y-1 focus-visible:ring-4 focus-visible:ring-primary/40 active:translate-y-0 active:scale-[0.99] motion-reduce:transform-none sm:p-8 lg:min-h-104 xl:p-10"
                  >
                    {/* Celular/tablet: la ilustración es un banner arriba y el texto
                        va debajo sobre verde sólido (las tarjetas son angostas y el
                        texto taparía el dibujo). Escritorio: es el fondo completo y
                        el degradé deja legible el texto de la parte inferior. */}
                    <div className="relative -z-10 -mx-6 -mt-6 mb-1 aspect-video sm:-mx-8 sm:-mt-8 lg:absolute lg:inset-0 lg:m-0 lg:aspect-auto">
                      <Image
                        src={imagenUrl}
                        alt=""
                        fill
                        priority
                        sizes="(min-width: 768px) 50vw, 100vw"
                        // object-top: el dibujo está en la mitad superior de la ilustración.
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-linear-to-t from-primary to-transparent to-35% lg:via-primary/70 lg:via-40% lg:to-75%"
                      />
                    </div>

                    <span className="absolute left-6 top-6 flex size-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm sm:left-8 sm:top-8 sm:size-14 xl:left-10 xl:top-10">
                      <Icon className="size-6 sm:size-7" strokeWidth={1.5} />
                    </span>

                    <span className="font-mono-technical text-xs uppercase tracking-wider text-white/75 lg:mt-6">
                      {eyebrow}
                    </span>
                    <h2 className="mt-1.5 font-heading text-2xl font-bold leading-tight sm:text-3xl">
                      {titulo}
                    </h2>

                    <ul className="mt-3 flex flex-col gap-1.5">
                      {puntos.map((punto) => (
                        <li
                          key={punto}
                          className="flex items-start gap-2 text-sm leading-snug text-white/90 sm:text-base"
                        >
                          <Check
                            className="mt-0.5 size-4 shrink-0 text-chart-4"
                            strokeWidth={2.5}
                          />
                          {punto}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                      <span className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-elevation-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground group-focus-visible:bg-primary group-focus-visible:text-primary-foreground">
                        {cta}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                      </span>
                      {precioDesde !== null && (
                        <span className="flex flex-col leading-tight">
                          <span className="text-xs text-white/70">{t.priceFrom}</span>
                          <span className="font-mono-technical text-lg font-semibold">
                            {formatPrice(precioDesde)}
                          </span>
                        </span>
                      )}
                    </div>
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
