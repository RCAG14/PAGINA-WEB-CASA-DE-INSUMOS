"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CartSheet } from "@/components/site/cart-sheet";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { AccountNav, type AccountNavSession } from "@/components/site/account-nav";
import { BrandMark } from "@/components/site/brand-mark";
import { useLogo } from "@/lib/logo-context";
import { useI18n } from "@/lib/i18n/locale-context";

export function SiteHeader({ session }: { session: AccountNavSession | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const logoUrl = useLogo();
  const { dict } = useI18n();

  // El catálogo de cajas y la ficha de producto usan su propio CatalogHeader
  // (sin opción de login), para no cambiar la navegación al entrar/salir de un producto.
  if (pathname === "/cajas-devoluciones-amazon-bolivia" || pathname.startsWith("/productos/")) {
    return null;
  }

  const navLinks = [
    { href: "/#servicios", label: dict.header.navServices },
    { href: "/cajas-devoluciones-amazon-bolivia#sobre-nosotros", label: dict.header.navAbout },
    { href: "#contacto", label: dict.header.navContact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 sm:px-6">
        <LanguageSwitcher className="hidden justify-self-start text-muted-foreground sm:flex" />

        <Link href="/" className="col-start-2 flex items-center gap-2.5 justify-self-center">
          <BrandMark logoUrl={logoUrl} size={36} />
          <span className="font-heading text-lg font-bold tracking-tight text-foreground">
            Casa Insumos
          </span>
        </Link>

        <div className="col-start-3 flex items-center justify-end gap-3 justify-self-end">
          <AccountNav session={session} className="hidden sm:flex" />
          <CartSheet />
          <button
            className="flex size-9 items-center justify-center rounded-lg border border-border md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={dict.header.openMenu}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <nav className="hidden items-center justify-center gap-8 border-t border-border py-3 md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-mono-technical text-sm text-foreground/80 transition-colors hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {open && (
        <nav className="flex flex-col border-t border-border bg-background md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-border px-4 py-3 font-mono-technical text-sm text-foreground/80 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <AccountNav session={session} variant="stacked" />
          <div className="flex items-center gap-2 px-4 py-3">
            <LanguageSwitcher className="text-muted-foreground" />
          </div>
        </nav>
      )}
    </header>
  );
}
