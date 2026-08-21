import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Boxes,
  Calculator,
  Lock,
  MonitorCog,
  Settings,
  Square,
  Users,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { verifySession } from "@/lib/auth/dal";
import { getLogo } from "@/lib/data/landing";
import { cn } from "@/lib/utils";

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
  const [, logo] = await Promise.all([verifySession(), getLogo()]);

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg",
              logo?.url ? "bg-sidebar-foreground/95" : "bg-primary/10 text-primary"
            )}
          >
            {logo?.url ? (
              <Image
                src={logo.url}
                alt="Casa Insumos"
                fill
                sizes="32px"
                className="object-contain p-0.5"
              />
            ) : (
              <Square className="size-4" strokeWidth={2.5} />
            )}
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-heading text-sm font-bold uppercase tracking-wide">
              Casa Insumos
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
          Cada línea de negocio de Casa Insumos tiene su propio espacio de trabajo. Los
          módulos marcados como &quot;Próximamente&quot; están planificados para fases
          posteriores del sistema.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {MODULES.map((mod, i) => (
          <div
            key={mod.titulo}
            className={`relative flex flex-col gap-4 rounded-xl border p-5 shadow-elevation-sm transition-shadow hover:shadow-elevation-lg ${
              mod.activo
                ? "border-primary/50 bg-card"
                : "border-dashed border-border/60 bg-card/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`flex size-11 items-center justify-center rounded-lg ${
                  mod.activo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                <mod.icon className="size-5" strokeWidth={1.5} />
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono-technical text-[10px] text-muted-foreground">
                  MOD-{String(i + 1).padStart(2, "0")}
                </span>
                {mod.activo ? (
                  <span className="rounded-full bg-primary px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground shadow-glow-accent">
                    Activo
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full border border-dashed border-accent bg-accent/15 px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-primary">
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

      <div className="flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Settings className="size-4" strokeWidth={1.5} />
          </span>
          <div className="flex flex-col gap-0.5">
            <h2 className="font-heading text-sm font-semibold">Configuración global del sistema</h2>
            <p className="max-w-md text-xs text-muted-foreground">
              Landing/imágenes promocionales, redes sociales y contacto, y socios comerciales —
              ajustes que aplican a toda la plataforma, no a un solo módulo.
            </p>
          </div>
        </div>
        <Link
          href="/admin/configuracion"
          className={buttonVariants({ variant: "outline", className: "w-fit shrink-0" })}
        >
          Ir a Configuración
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
