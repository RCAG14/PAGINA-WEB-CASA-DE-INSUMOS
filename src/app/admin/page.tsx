import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Calculator,
  Lock,
  MonitorCog,
  Square,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifySession } from "@/lib/auth/dal";

const MODULES = [
  {
    titulo: "Gestión de Cajas Amazon y Retornos",
    descripcion:
      "Dashboard, inventario de cajas, manifiesto de contenido y pedidos del negocio de retornos de liquidación.",
    icon: Boxes,
    href: "/admin/cajas",
    activo: true,
  },
  {
    titulo: "Servicio de Cotizaciones e Importaciones",
    descripcion: "Gestión de solicitudes de cotización y seguimiento de procesos de importación.",
    icon: Calculator,
    activo: false,
  },
  {
    titulo: "Desarrollo de Software y Páginas Web",
    descripcion: "Seguimiento de proyectos de desarrollo a medida para clientes externos.",
    icon: MonitorCog,
    href: "/admin/desarrollo-web",
    activo: true,
  },
  {
    titulo: "Administración de Personal y RRHH",
    descripcion: "Gestión de personal, turnos y operaciones internas de recursos humanos.",
    icon: Users,
    activo: false,
  },
] as const;

export default async function AdminPortalPage() {
  await verifySession();

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center border-2 border-primary text-primary">
            <Square className="size-4" strokeWidth={2.5} />
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-heading text-sm font-bold uppercase tracking-wide">
              Casa de Insumos
            </span>
            <span className="font-mono-technical text-[9px] uppercase tracking-wider text-muted-foreground">
              Portal de módulos — ERP/WMS
            </span>
          </div>
        </div>
        <Link
          href="/"
          className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary"
        >
          Volver a la tienda
        </Link>
      </header>

      <div className="flex flex-col gap-2">
        <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
          Selección de módulo
        </span>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          ¿Qué módulo quieres administrar?
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Cada línea de negocio de Casa de Insumos tiene su propio espacio de trabajo. Los
          módulos marcados como &quot;Próximamente&quot; están planificados para fases
          posteriores del sistema.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {MODULES.map((mod, i) => (
          <div
            key={mod.titulo}
            className={`relative flex flex-col gap-4 border p-5 ${
              mod.activo ? "border-primary bg-card" : "border-dashed border-border bg-card/60"
            }`}
          >
            <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-primary" />
            <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-primary" />
            <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-primary" />
            <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-primary" />

            <div className="flex items-center justify-between">
              <span
                className={`flex size-11 items-center justify-center border-2 ${
                  mod.activo ? "border-primary text-primary" : "border-border text-muted-foreground"
                }`}
              >
                <mod.icon className="size-5" strokeWidth={1.5} />
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono-technical text-[10px] text-muted-foreground">
                  MOD-{String(i + 1).padStart(2, "0")}
                </span>
                {mod.activo ? (
                  <span className="border border-primary bg-primary px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground">
                    Activo
                  </span>
                ) : (
                  <span className="flex items-center gap-1 border border-dashed border-accent bg-accent/15 px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-primary">
                    <Lock className="size-2.5" />
                    Próximamente
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <h2 className="font-heading text-base font-semibold leading-snug">{mod.titulo}</h2>
              <p className="text-xs text-muted-foreground">{mod.descripcion}</p>
            </div>

            {mod.activo && mod.href ? (
              <Button render={<Link href={mod.href} />} nativeButton={false} className="w-fit">
                Entrar al módulo
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button disabled variant="outline" className="w-fit">
                No disponible todavía
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
