"use client";

import { usePathname } from "next/navigation";
import { CartSheet } from "@/components/site/cart-sheet";
import type { AccountNavSession } from "@/components/site/account-nav";
import { Navbar } from "@/components/site/navbar";
import { useLogo } from "@/lib/logo-context";
import { useI18n } from "@/lib/i18n/locale-context";
import { HOME_CONTAINER } from "@/lib/layout";

export function SiteHeader({ session }: { session: AccountNavSession | null }) {
  const pathname = usePathname();
  const logoUrl = useLogo();
  const { dict } = useI18n();

  // El catálogo de cajas y la ficha de producto usan su propio CatalogHeader
  // (sin opción de login), para no cambiar la navegación al entrar/salir de un producto.
  if (pathname === "/cajas-devoluciones-amazon-bolivia" || pathname.startsWith("/productos/")) {
    return null;
  }

  return (
    <Navbar
      logoUrl={logoUrl}
      session={session}
      actions={<CartSheet />}
      containerClassName={HOME_CONTAINER}
      // Carrito y checkout son parte de la compra de cajas: mismos enlaces que
      // el catálogo ("#sobre-nosotros" ya no existe).
      links={[
        { href: "/cajas-devoluciones-amazon-bolivia#catalogo", label: dict.header.navCatalog },
        { href: "/cajas-devoluciones-amazon-bolivia#como-comprar", label: dict.howToBuy.eyebrow },
        { href: "#contacto", label: dict.header.navContact },
      ]}
    />
  );
}
