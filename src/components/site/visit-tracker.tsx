"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Contador de tráfico ligero — no reemplaza una herramienta de analítica real. */
export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const body = JSON.stringify({ ruta: pathname });
    const blob = new Blob([body], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/track-visit", blob)) {
      fetch("/api/track-visit", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
