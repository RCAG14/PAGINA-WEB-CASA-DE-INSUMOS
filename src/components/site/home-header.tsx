"use client";

import type { AccountNavSession } from "@/components/site/account-nav";
import { Navbar } from "@/components/site/navbar";
import { useI18n } from "@/lib/i18n/locale-context";

/**
 * Header propio de la home ("/") — a propósito NO es SiteHeader: la home es
 * un hub independiente, no comparte enlaces con el catálogo de cajas ni con
 * desarrollo web (cada uno ya es autocontenido).
 */
export function HomeHeader({
  logoUrl,
  session,
}: {
  logoUrl: string | null;
  session: AccountNavSession | null;
}) {
  const { dict } = useI18n();

  return (
    <Navbar
      logoUrl={logoUrl}
      session={session}
      links={[
        { href: "#servicios", label: dict.header.navServices },
        { href: "#sobre-nosotros", label: dict.header.navAbout },
        { href: "#contacto", label: dict.header.navContact },
      ]}
    />
  );
}
