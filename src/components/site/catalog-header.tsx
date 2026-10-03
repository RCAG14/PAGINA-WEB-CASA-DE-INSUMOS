"use client";

import { CartSheet } from "@/components/site/cart-sheet";
import { Navbar } from "@/components/site/navbar";
import { useLogo } from "@/lib/logo-context";
import { useI18n } from "@/lib/i18n/locale-context";

/**
 * Header propio del catálogo de cajas — sin cuenta/login (el catálogo es un
 * flujo de compra directo) y con el carrito en su lugar. El logo/nombre llevan
 * de vuelta a la home. Usa el LogoProvider/CartProvider que ya provee
 * (site)/layout.tsx — no necesita props.
 */
export function CatalogHeader() {
  const logoUrl = useLogo();
  const { dict } = useI18n();

  return (
    <Navbar
      logoUrl={logoUrl}
      actions={<CartSheet />}
      links={[
        { href: "#catalogo", label: dict.header.navCatalog },
        { href: "#sobre-nosotros", label: dict.header.navAbout },
        { href: "#contacto", label: dict.header.navContact },
      ]}
    />
  );
}
