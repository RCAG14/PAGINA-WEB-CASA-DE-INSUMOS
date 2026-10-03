"use client";

import type { AccountNavSession } from "@/components/site/account-nav";
import { Navbar } from "@/components/site/navbar";
import { useI18n } from "@/lib/i18n/locale-context";

/**
 * Header propio de desarrollo-web — cada mini-landing es autocontenida y tiene
 * sus propios enlaces. Sin carrito (no aplica acá), con cuenta/login como en
 * la home.
 */
export function WebDevHeader({
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
        { href: "#tipos", label: dict.webdev.types.eyebrow },
        { href: "#paquetes", label: dict.webdev.pricing.eyebrow },
        { href: "#contacto", label: dict.header.navContact },
      ]}
    />
  );
}
