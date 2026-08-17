"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Square, X } from "lucide-react";
import { CartSheet } from "@/components/site/cart-sheet";
import { useLogo } from "@/lib/logo-context";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/#catalogo", label: "Catálogo" },
  { href: "/#como-funciona", label: "Cómo funciona" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const logoUrl = useLogo();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="border-b border-border bg-primary py-1.5">
        <p className="mx-auto max-w-6xl px-4 text-center font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground/80 sm:px-6">
          Manifiestos verificados · Certificación aduanera · Envíos internacionales documentados
        </p>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden border-2 border-primary text-primary">
            {logoUrl ? (
              // Logo cargado por el administrador — dimensiones/formato variables.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Casa de Insumos" className="h-full w-full object-contain p-0.5" />
            ) : (
              <Square className="size-4" strokeWidth={2.5} />
            )}
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
              Casa de Insumos
            </span>
            <span className="font-mono-technical text-[9px] uppercase tracking-wider text-muted-foreground">
              Distribución técnica por caja
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono-technical text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className={cn(
              "hidden font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary sm:block",
              pathname?.startsWith("/admin") && "text-primary"
            )}
          >
            Admin
          </Link>
          <CartSheet />
          <button
            className="flex size-9 items-center justify-center border border-border md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-border bg-background md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-border px-4 py-3 font-mono-technical text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="px-4 py-3 font-mono-technical text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
          >
            Admin
          </Link>
        </nav>
      )}
    </header>
  );
}
