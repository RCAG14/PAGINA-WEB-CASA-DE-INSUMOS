import Link from "next/link";
import { ArrowRight, Boxes, Calculator, Globe2, MonitorCog } from "lucide-react";
import { Button } from "@/components/ui/button";

const BLOQUES = [
  {
    icon: Boxes,
    titulo: "Catálogo de Cajas de Retorno",
    descripcion:
      "Lotes de retorno de Amazon en modalidad sorpresa o listada, con manifiesto verificable y ficha técnica de origen.",
    href: "/catalogo",
    cta: "Ver catálogo",
  },
  {
    icon: Calculator,
    titulo: "Servicio de Cotizaciones",
    descripcion:
      "Evaluamos el lote, volumen o categoría que necesitas y preparamos una cotización a medida.",
  },
  {
    icon: Globe2,
    titulo: "Importaciones",
    descripcion:
      "Gestión de importación de mercancía de liquidación desde centros de retorno en Europa hasta tu bodega.",
  },
  {
    icon: MonitorCog,
    titulo: "Desarrollo Web a Medida",
    descripcion:
      "Plataformas propias para revendedores y negocios de liquidación que necesitan su propio catálogo digital.",
  },
] as const;

export function PortalServicesGrid() {
  return (
    <section id="servicios" className="bg-card">
      <div className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6">
        <div className="mb-8 flex flex-col gap-2">
          <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
            Nuestros servicios
          </span>
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            Todo lo que ofrecemos
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Distribución técnica de cajas de retorno, más servicios de cotización, importación y
            desarrollo web a medida.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BLOQUES.map((bloque, i) => (
            <div
              key={bloque.titulo}
              className="flex flex-col gap-3 border border-border bg-background p-4"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-8 items-center justify-center border border-primary/30 bg-primary/5 text-primary">
                  <bloque.icon className="size-4" strokeWidth={1.5} />
                </span>
                <span className="font-mono-technical text-[10px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}/04
                </span>
              </div>

              <h3 className="font-heading text-sm font-semibold leading-snug">{bloque.titulo}</h3>
              <p className="flex-1 text-xs text-muted-foreground">{bloque.descripcion}</p>

              {"href" in bloque ? (
                <Button
                  render={<Link href={bloque.href} />}
                  nativeButton={false}
                  size="sm"
                  variant="secondary"
                  className="w-fit"
                >
                  {bloque.cta}
                  <ArrowRight className="size-3.5" />
                </Button>
              ) : (
                <span className="w-fit border border-dashed border-accent bg-accent/10 px-2 py-1 font-mono-technical text-[10px] uppercase tracking-wider text-primary">
                  Próximamente
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
