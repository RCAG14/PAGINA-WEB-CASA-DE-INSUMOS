"use client";

import Link from "next/link";
import { LogIn, LogOut, ShieldCheck } from "lucide-react";
import { logoutSiteAction } from "@/app/(site)/actions";
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
    ? "flex items-center gap-2 border-b border-border px-4 py-3 font-mono-technical text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
    : "flex items-center gap-1.5 font-mono-technical text-[11px] uppercase tracking-wider opacity-80 transition-opacity hover:opacity-100";

  if (!session) {
    return (
      <Link href="/login" className={cn(linkClass, className)}>
        <LogIn className="size-3.5" strokeWidth={1.5} />
        {dict.header.login}
      </Link>
    );
  }

  return (
    <div className={cn(stacked ? "flex flex-col" : "flex items-center gap-3", className)}>
      <span
        className={
          stacked
            ? "border-b border-border px-4 py-3 font-mono-technical text-xs uppercase tracking-wider text-muted-foreground"
            : "hidden opacity-80 sm:inline"
        }
      >
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
