import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { verifySession } from "@/lib/auth/dal";
import { getLogo } from "@/lib/data/landing";
import { BrandMark } from "@/components/site/brand-mark";

export default async function SocioLayout({ children }: { children: React.ReactNode }) {
  const [session, logo] = await Promise.all([verifySession(), getLogo()]);

  return (
    <div className="min-h-svh bg-background">
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 sm:px-6">
        <BrandMark logoUrl={logo?.url ?? null} size={52} />
        <div className="flex flex-col leading-tight">
          <span className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
            Casa Insumos
          </span>
          <span className="font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground">
            Panel de Socio — Solo lectura
          </span>
          <h1 className="font-heading text-sm font-semibold">{session.nombre}</h1>
        </div>
        <form action={logoutAction} className="ml-auto">
          <button
            type="submit"
            className="flex items-center gap-1.5 font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary"
          >
            <LogOut className="size-3.5" />
            Cerrar sesión
          </button>
        </form>
      </header>
      {children}
    </div>
  );
}
