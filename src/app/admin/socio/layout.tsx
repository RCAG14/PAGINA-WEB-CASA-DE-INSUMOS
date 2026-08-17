import { LogOut, Square } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { verifySession } from "@/lib/auth/dal";

export default async function SocioLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  return (
    <div className="min-h-svh bg-background">
      <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4 sm:px-6">
        <span className="flex size-8 items-center justify-center border-2 border-primary text-primary">
          <Square className="size-4" strokeWidth={2.5} />
        </span>
        <div className="flex flex-col leading-tight">
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
