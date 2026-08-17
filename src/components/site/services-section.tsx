import Link from "next/link";
import { ArrowRight, Boxes, Calculator, Globe2, MonitorCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SERVICES = [
  {
    icon: Boxes,
    titulo: "Cajas de Retorno",
    descripcion:
      "Lotes de retorno de Amazon en modalidad sorpresa o listada, con manifiesto verificable y ficha técnica de origen para calcular tu margen antes de comprar.",
    tag: "Catálogo disponible",
    href: "#catalogo",
    cta: "Ver catálogo",
  },
  {
    icon: Calculator,
    titulo: "Servicio de Cotizaciones",
    descripcion:
      "Evaluamos el lote, volumen o categoría que necesitas y preparamos una cotización a medida con condiciones documentadas.",
    tag: "Disponible bajo cotización",
  },
  {
    icon: Globe2,
    titulo: "Importaciones",
    descripcion:
      "Gestionamos la importación de mercancía de liquidación desde centros de retorno en Europa hasta tu bodega, con trazabilidad aduanera.",
    tag: "Gestión a medida",
  },
  {
    icon: MonitorCog,
    titulo: "Desarrollo de Páginas Web Personalizadas",
    descripcion:
      "Diseñamos y construimos plataformas a medida para revendedores y negocios de liquidación que necesitan su propio catálogo digital.",
    tag: "Propuesta personalizada",
  },
];

export function ServicesSection() {
  return (
    <section id="servicios" className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6">
        <div className="mb-8 flex flex-col gap-2">
          <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
            01 — Servicios
          </span>
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            Todo lo que ofrecemos
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Además del catálogo de cajas de retorno, operamos como aliado logístico y técnico
            para revendedores e importadores.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, i) => (
            <div
              key={service.titulo}
              className="flex flex-col gap-3 border border-border bg-background p-4"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-8 items-center justify-center border border-primary/30 bg-primary/5 text-primary">
                  <service.icon className="size-4" strokeWidth={1.5} />
                </span>
                <span className="font-mono-technical text-[10px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}/04
                </span>
              </div>

              <h3 className="font-heading text-sm font-semibold leading-snug">{service.titulo}</h3>
              <p className="flex-1 text-xs text-muted-foreground">{service.descripcion}</p>

              {service.href ? (
                <Button
                  render={<Link href={service.href} />}
                  nativeButton={false}
                  size="sm"
                  variant="secondary"
                  className="w-fit"
                >
                  {service.cta}
                  <ArrowRight className="size-3.5" />
                </Button>
              ) : (
                <span
                  className={cn(
                    "w-fit border border-dashed border-accent bg-accent/10 px-2 py-1 font-mono-technical text-[10px] uppercase tracking-wider text-primary"
                  )}
                >
                  {service.tag}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
