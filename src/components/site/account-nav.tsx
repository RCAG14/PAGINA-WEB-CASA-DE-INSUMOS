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
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-mono-technical text-xs text-muted-foreground">
            {dict.header.helloPrefix} {session.nombre}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isStaff && (
            <DropdownMenuItem render={<Link href="/admin" />}>
              <ShieldCheck className="size-3.5" strokeWidth={1.5} />
              {dict.header.adminPanel}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            render={
              <form action={logoutSiteAction} className="w-full">
                <button type="submit" className="flex w-full items-center gap-1.5 text-left">
                  <LogOut className="size-3.5" strokeWidth={1.5} />
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
