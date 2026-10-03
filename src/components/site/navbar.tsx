"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { AccountNav, type AccountNavSession } from "@/components/site/account-nav";
import { BrandMark } from "@/components/site/brand-mark";
import { useI18n } from "@/lib/i18n/locale-context";

export interface NavbarLink {
  href: string;
  label: string;
}

/**
 * Navbar de una sola fila compartido por todos los headers del sitio:
 * marca a la izquierda, enlaces al centro y acciones a la derecha. Debajo de
 * `lg` los enlaces e idioma pasan al menú desplegable.
 *
 * `session === undefined` oculta la opción de cuenta (ej. catálogo de cajas);
 * `null` muestra "Iniciar sesión".
 */
export function Navbar({
  logoUrl,
  links,
  session,
  actions,
}: {
  logoUrl: string | null;
  links: NavbarLink[];
  session?: AccountNavSession | null;
  actions?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { dict } = useI18n();
  const conCuenta = session !== undefined;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-19 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <BrandMark logoUrl={logoUrl} size={52} />
          <span className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Casa Insumos
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 font-mono-technical text-sm text-foreground/80 transition-colors hover:bg-primary/5 hover:text-primary focus-visible:bg-primary/5 focus-visible:text-primary focus-visible:outline-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3 lg:ml-0">
          <LanguageSwitcher className="hidden text-muted-foreground lg:flex" />
          {conCuenta && <AccountNav session={session} className="hidden sm:flex" />}
          {actions}
          <button
            className="flex size-9 items-center justify-center rounded-lg border border-border lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={dict.header.openMenu}
            aria-expanded={open}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-border bg-background lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-border px-4 py-3 font-mono-technical text-sm text-foreground/80 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          {conCuenta && <AccountNav session={session} variant="stacked" className="sm:hidden" />}
          <div className="flex items-center gap-2 px-4 py-3">
            <LanguageSwitcher className="text-muted-foreground" />
          </div>
        </nav>
      )}
    </header>
  );
}
