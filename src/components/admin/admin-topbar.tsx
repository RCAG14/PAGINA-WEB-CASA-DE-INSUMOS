import { Bell, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logoutAction } from "@/app/admin/actions";
import { getSession } from "@/lib/auth/session";

const ROL_LABEL: Record<string, string> = {
  JEFE: "Jefe",
  SOCIO: "Socio",
};

export async function AdminTopbar({
  title,
  eyebrow,
}: {
  title: string;
  eyebrow: string;
}) {
  const session = await getSession();
  const iniciales = session
    ? session.nombre
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "CI";

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <div className="flex flex-col leading-tight">
        <span className="font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground">
          {eyebrow}
        </span>
        <h1 className="font-heading text-sm font-semibold">{title}</h1>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          className="relative flex size-8 items-center justify-center border border-border text-muted-foreground hover:text-primary"
          aria-label="Notificaciones"
        >
          <Bell className="size-4" />
          <span className="absolute -right-1 -top-1 size-2 bg-accent" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex items-center gap-2 border border-border px-2 py-1 hover:border-primary" />
            }
          >
            <Avatar className="size-6 rounded-none">
              <AvatarFallback className="rounded-none bg-primary text-[10px] text-primary-foreground">
                {iniciales}
              </AvatarFallback>
            </Avatar>
            <span className="font-mono-technical text-[11px] uppercase tracking-wider">
              {session ? session.nombre : "Operador"}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-mono-technical text-[10px] uppercase tracking-wider">
                {session ? (ROL_LABEL[session.rol] ?? session.rol) : "Cuenta"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Perfil (próximamente)</DropdownMenuItem>
              <DropdownMenuItem
                render={
                  <form action={logoutAction} className="w-full">
                    <button type="submit" className="flex w-full items-center gap-2 text-left">
                      <LogOut className="size-3.5" />
                      Cerrar sesión
                    </button>
                  </form>
                }
              />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
