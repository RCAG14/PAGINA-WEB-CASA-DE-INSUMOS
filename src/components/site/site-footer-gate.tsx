"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Oculta el SiteFooter compartido en rutas que traen su propio footer (hoy,
 * el catálogo de cajas usa el mismo diseño que la home). `children` es el
 * SiteFooter ya renderizado en el servidor — Next permite pasar Server
 * Components como children de un Client Component sin volverlos client.
 */
const ROUTES_WITHOUT_SITE_FOOTER = new Set(["/cajas-devoluciones-amazon-bolivia"]);

export function SiteFooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (ROUTES_WITHOUT_SITE_FOOTER.has(pathname)) {
    return null;
  }
  return <>{children}</>;
}
