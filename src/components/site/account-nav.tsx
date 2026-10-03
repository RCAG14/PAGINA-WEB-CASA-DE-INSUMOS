"use client";

import Link from "next/link";
import { ArrowRight, LogOut, ShieldCheck, User } from "lucide-react";
import { logoutSiteAction } from "@/app/(site)/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";
import type { Rol } from "@/lib/auth/jwt";

export interface AccountNavSession {
  nombre: string;
  rol: Rol;
}

interface AccountNavProps {
  session: AccountNavSession | null;
  className?: string;
  // "inline": barra compacta de escritorio. "stacked": filas completas del menú móvil.
  variant?: "inline" | "stacked";
}

// Ítems del menú de cuenta: más aire que el default y un resaltado suave en
// vez del bloque de color `accent`, que hacía ver cada opción como un botón.
const ITEM_CLASS =
  "gap-2.5 rounded-md px-2.5 py-2 text-sm text-foreground/85 focus:bg-primary/8 focus:text-primary not-data-[variant=destructive]:focus:**:text-primary";

export function AccountNav({ session, className, variant = "inline" }: AccountNavProps) {
  const { dict } = useI18n();
  const isStaff = session?.rol === "JEFE" || session?.rol === "SOCIO";
  const stacked = variant === "stacked";

  const linkClass = stacked
    ? "flex items-center gap-2 border-b border-border px-4 py-3 font-mono-technical text-sm text-muted-foreground hover:text-primary"
    : "flex items-center gap-1.5 font-mono-technical text-sm text-foreground/80 transition-colors hover:text-primary";

  if (!session) {
    const loginContent = (
      <>
        <ArrowRight className="size-3.5" strokeWidth={1.5} />
        {dict.header.login}
      </>
    );
    return stacked ? (
      <Link href="/login" className={cn(linkClass, className)}>
        {loginContent}
      </Link>
    ) : (
      <Button
        render={<Link href="/login" />}
        nativeButton={false}
        variant="outline"
        size="sm"
        className={cn("border-primary text-primary hover:bg-primary/5", className)}
      >
        {loginContent}
      </Button>
    );
  }

  if (stacked) {
    return (
      <div className={cn("flex flex-col", className)}>
        <span className="border-b border-border px-4 py-3 font-mono-technical text-xs uppercase tracking-wider text-muted-foreground">
          {dict.header.helloPrefix} {session.nombre}
        </span>
        {isStaff && (
          <Link href="/admin" className={linkClass}>
            <ShieldCheck className="size-3.5" strokeWidth={1.5} />
            {dict.header.adminPanel}
          </Link>
        )}
        <form action={logoutSiteAction}>
          <button type="submit" className={linkClass}>
            <LogOut className="size-3.5" strokeWidth={1.5} />
            {dict.header.logout}
          </button>
        </form>
      </div>
    );
  }

  // Escritorio: en vez de desplegar nombre + enlaces en la barra, un solo
  // ícono de usuario que abre el menú con esas mismas opciones.
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            aria-label={dict.header.accountMenu}
            className={cn(
              "flex size-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary",
              className
            )}
          />
        }
      >
        <User className="size-4" strokeWidth={1.5} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-1.5">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-semibold text-primary">
              {session.nombre.charAt(0).toUpperCase()}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-xs font-normal text-muted-foreground">
                {dict.header.helloPrefix}
              </span>
              <span className="truncate text-sm font-semibold text-foreground">
                {session.nombre}
              </span>
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-1.5" />
        <DropdownMenuGroup>
          {isStaff && (
            <DropdownMenuItem render={<Link href="/admin" />} className={ITEM_CLASS}>
              <ShieldCheck className="size-4" strokeWidth={1.75} />
              {dict.header.adminPanel}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className={cn(ITEM_CLASS, "p-0")}
            render={
              <form action={logoutSiteAction} className="w-full">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 px-2.5 py-2 text-left"
                >
                  <LogOut className="size-4" strokeWidth={1.75} />
                  {dict.header.logout}
                </button>
              </form>
            }
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
