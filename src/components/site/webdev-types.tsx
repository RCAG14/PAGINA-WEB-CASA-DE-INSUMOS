import {
  Bot,
  CalendarCheck,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  Server,
} from "lucide-react";
import { ScrollReveal } from "@/components/site/scroll-reveal";

const TIPOS = [
  {
    icon: LayoutTemplate,
    titulo: "Sitios web",
    descripcion: "Landing pages, sitios institucionales y catálogos digitales.",
  },
  {
    icon: Server,
    titulo: "Sistemas web",
    descripcion: "Plataformas a medida con lógica de negocio propia y base de datos.",
  },
  {
    icon: LayoutDashboard,
    titulo: "Dashboards",
    descripcion: "Paneles de control con métricas, reportes y gestión en tiempo real.",
  },
  {
    icon: Bot,
    titulo: "Chatbots",
    descripcion: "Atención automatizada por WhatsApp o web para consultas y ventas.",
  },
  {
    icon: CalendarCheck,
    titulo: "Ventas y reservas",
    descripcion: "Sistemas de venta online, turnos y reservas para cualquier rubro.",
  },
  {
    icon: Layers,
    titulo: "Y más, a medida",
    descripcion: "Cada negocio es distinto — evaluamos tu caso y proponemos la solución.",
  },
] as const;

export function WebDevTypes() {
  return (
    <section id="tipos" className="flex min-h-screen items-center border-b border-border bg-card">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <ScrollReveal className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
            Qué desarrollamos
          </span>
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            Un desarrollo para cada tipo de negocio
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            No trabajamos solo para revendedores de cajas de retorno: construimos plataformas
            para cualquier rubro que necesite presencia digital o un sistema propio.
          </p>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TIPOS.map((tipo, i) => (
            <ScrollReveal key={tipo.titulo} delayMs={i * 80}>
              <div className="flex h-full flex-col gap-3 border border-border bg-background p-4">
                <span className="flex size-10 items-center justify-center border border-primary/30 bg-primary/5 text-primary">
                  <tipo.icon className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="font-heading text-sm font-semibold leading-snug">{tipo.titulo}</h3>
                <p className="text-xs text-muted-foreground">{tipo.descripcion}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
