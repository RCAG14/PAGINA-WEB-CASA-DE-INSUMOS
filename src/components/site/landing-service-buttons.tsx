import Link from "next/link";
import { ArrowRight, Boxes, Calculator, Globe2, MonitorCog } from "lucide-react";
import { ScrollReveal } from "@/components/site/scroll-reveal";

const SERVICIOS = [
  {
    icon: Boxes,
    titulo: "Catálogo de Cajas de Retorno",
    descripcion:
      "Lotes de retorno de Amazon en modalidad sorpresa o listada, con manifiesto verificable.",
    href: "/catalogo",
    cta: "Ver catálogo",
  },
  {
    icon: Calculator,
    titulo: "Servicio de Cotizaciones",
    descripcion: "Evaluamos el lote, volumen o categoría que necesitas y cotizamos a medida.",
  },
  {
    icon: Globe2,
    titulo: "Importaciones",
    descripcion: "Gestión de importación de mercancía de liquidación hasta tu bodega.",
  },
  {
    icon: MonitorCog,
    titulo: "Desarrollo Web a Medida",
    descripcion: "Sitios web, sistemas, dashboards y chatbots a medida para cualquier negocio.",
    href: "/desarrollo-web",
    cta: "Ver paquetes",
  },
] as const;

export function LandingServiceButtons() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {SERVICIOS.map((servicio, i) => {
        const disponible = "href" in servicio;
        const contenido = (
          <>
            <div className="flex items-center justify-between">
              <span className="flex size-12 items-center justify-center border border-primary/30 bg-primary/5 text-primary">
                <servicio.icon className="size-6" strokeWidth={1.5} />
              </span>
              <span className="font-mono-technical text-[10px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}/04
              </span>
            </div>
            <h2 className="font-heading text-lg font-semibold leading-snug">{servicio.titulo}</h2>
            <p className="flex-1 text-sm text-muted-foreground">{servicio.descripcion}</p>
            {disponible ? (
              <span className="flex w-fit items-center gap-1.5 font-mono-technical text-[11px] uppercase tracking-wider text-primary">
                {servicio.cta}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            ) : (
              <span className="w-fit border border-dashed border-accent bg-accent/10 px-2 py-1 font-mono-technical text-[10px] uppercase tracking-wider text-primary">
                Próximamente
              </span>
            )}
          </>
        );

        return (
          <ScrollReveal key={servicio.titulo} delayMs={i * 100}>
            {disponible ? (
              <Link
                href={servicio.href}
                className="group flex h-full min-h-57.5 flex-col gap-3 border border-border bg-card p-6 transition-colors hover:border-primary"
              >
                {contenido}
              </Link>
            ) : (
              <div className="flex h-full min-h-57.5 flex-col gap-3 border border-border bg-card p-6 opacity-80">
                {contenido}
              </div>
            )}
          </ScrollReveal>
        );
      })}
    </div>
  );
}
