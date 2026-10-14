import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  Code2,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  MessageCircle,
  Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrecioDesarrollo } from "@/components/site/precio-desarrollo";
import { contarTrabajosRealizados, getPrecioMinimoPaquetes } from "@/lib/data/desarrollo";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import { getDictionary } from "@/lib/i18n/locale";
import { HOME_CONTAINER } from "@/lib/layout";
import { buildWhatsAppLink, cn } from "@/lib/utils";
import { MENSAJES_WHATSAPP } from "@/lib/whatsapp";

// Mismo orden que dict.webdev.types.items.
const TIPO_ICONS = [LayoutTemplate, Server, LayoutDashboard, Bot, CalendarCheck, Layers];

export async function WebDevHero() {
  const [precioDesde, cantidadTrabajos, whatsappNumero, { dict }] =
    await Promise.all([
      getPrecioMinimoPaquetes(),
      contarTrabajosRealizados(),
      getNumeroWhatsappPrincipal(),
      getDictionary(),
    ]);
  const t = dict.webdev.hero;

  // Datos reales de la base: solo se muestran los que existen.
  const facts: { label: string; value: ReactNode }[] = [];
  if (precioDesde !== null) {
    facts.push({ label: t.factPriceFrom, value: <PrecioDesarrollo usd={precioDesde} /> });
  }
  if (cantidadTrabajos > 0) {
    facts.push({ label: t.factProjects, value: String(cantidadTrabajos) });
  }
  if (whatsappNumero) facts.push({ label: t.factQuote, value: t.factQuoteValue });

  return (
    <section className="bg-blueprint-dark relative flex items-center overflow-hidden border-b border-sidebar-foreground/10 ">
      {/* Fondo: verde liso de la marca (bg-blueprint-dark) + ilustración propia a la
          derecha, en vez de la foto del carrusel del admin, que no comunicaba
          el servicio. Sin ScrollReveal: es el primer pantallazo. */}
      <div
        className={cn(
          HOME_CONTAINER,
          "relative grid items-center gap-10 py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:py-16"
        )}
      >
        <div className="flex max-w-2xl flex-col gap-5 text-sidebar-foreground">
          <span className="flex items-center gap-3 font-mono-technical text-xs font-semibold uppercase tracking-wider">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent shadow-elevation-sm">
              <Code2 className="size-5 text-accent-foreground" strokeWidth={1.75} />
            </span>
            {t.eyebrow}
          </span>
          <h1 className="text-pretty font-heading text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl">
            {t.title}
          </h1>
          {/* Qué desarrollamos: antes era una sección aparte de 6 tarjetas que
              repetía la descripción; como etiquetas se entiende de un vistazo. */}
          <ul aria-label={dict.webdev.types.eyebrow} className="flex flex-wrap gap-2">
            {dict.webdev.types.items.map((tipo, i) => {
              const Icon = TIPO_ICONS[i];
              return (
                <li
                  key={tipo.titulo}
                  title={tipo.descripcion}
                  className="flex items-center gap-1.5 rounded-full border border-sidebar-foreground/20 bg-sidebar-foreground/10 px-3 py-1.5 text-sm"
                >
                  <Icon className="size-4 text-chart-4" strokeWidth={1.75} />
                  {tipo.titulo}
                </li>
              );
            })}
          </ul>

          <div className="mt-1 flex flex-wrap gap-3">
            <Button
              render={<Link href="#paquetes" />}
              nativeButton={false}
              size="lg"
              variant="secondary"
              className="shadow-elevation-md"
            >
              {t.ctaPricing}
              <ArrowRight className="size-4" />
            </Button>
            {whatsappNumero && (
              <Button
                render={
                  <a
                    href={buildWhatsAppLink(whatsappNumero, MENSAJES_WHATSAPP.webdev)}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                nativeButton={false}
                size="lg"
                variant="outline"
                className="border-2 border-sidebar-foreground bg-sidebar-foreground/10 text-sidebar-foreground backdrop-blur-sm hover:bg-sidebar-foreground/20"
              >
                <MessageCircle className="size-4" />
                {t.ctaQuote}
              </Button>
            )}
          </div>

          {facts.length > 0 && (
            <dl className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-sidebar-foreground/20">
              {facts.map((f) => (
                <div key={f.label} className="bg-sidebar/60 px-3 py-3 backdrop-blur-md sm:px-4">
                  <dt className="text-xs text-sidebar-foreground/75">{f.label}</dt>
                  <dd className="font-heading text-base font-semibold sm:text-lg">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <Image
          src="/portada/hero-webdev.svg"
          alt=""
          width={850}
          height={570}
          priority
          className="hidden h-auto w-full drop-shadow-2xl lg:block"
        />
      </div>
    </section>
  );
}
