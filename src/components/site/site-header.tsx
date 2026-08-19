"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Square, X } from "lucide-react";
import Image from "next/image";
import { CartSheet } from "@/components/site/cart-sheet";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { AccountNav, type AccountNavSession } from "@/components/site/account-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLogo } from "@/lib/logo-context";
import { useI18n } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

export function SiteHeader({ session }: { session: AccountNavSession | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const logoUrl = useLogo();
  const { dict } = useI18n();

  // El catálogo integra su propio volver + carrito directamente sobre el
  // hero (ver hero-section.tsx), sin navbar completo ni opción de login.
  if (pathname === "/catalogo") {
    return null;
  }

  const navLinks = [
    { href: "/catalogo#catalogo", label: dict.header.navCatalog },
    { href: "/catalogo#como-funciona", label: dict.header.navHowItWorks },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-lg supports-backdrop-filter:bg-background/70">
      <div className="border-b border-border bg-sidebar py-1.5">
        <p className="mx-auto max-w-6xl px-4 text-center font-mono-technical text-[10px] uppercase tracking-wider text-sidebar-foreground/80 sm:px-6">
          {dict.header.bar}
        </p>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span
            className={cn(
              "relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-primary/50 text-primary transition-shadow group-hover:shadow-glow-accent",
              logoUrl ? "bg-sidebar-foreground/95" : "bg-primary/5"
            )}
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Casa de Insumos"
                fill
                sizes="32px"
                className="object-contain p-0.5"
              />
            ) : (
              <Square className="size-4" strokeWidth={2.5} />
            )}
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
              Casa de Insumos
            </span>
            <span className="font-mono-technical text-[9px] uppercase tracking-wider text-muted-foreground">
              {dict.header.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono-technical text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle className="hidden sm:flex" />
          <LanguageSwitcher className="hidden text-muted-foreground sm:flex" />
          <AccountNav session={session} className="hidden text-muted-foreground sm:flex" />
          <CartSheet />
          <button
            className="flex size-9 items-center justify-center rounded-lg border border-border/60 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={dict.header.openMenu}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-border bg-background md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-border px-4 py-3 font-mono-technical text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <AccountNav session={session} variant="stacked" />
          <div className="flex items-center gap-2 px-4 py-3">
            <ThemeToggle />
            <LanguageSwitcher className="text-muted-foreground" />
          </div>
        </nav>
      )}
    </header>
  );
}
