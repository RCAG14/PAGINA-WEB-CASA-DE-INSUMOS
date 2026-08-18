import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

/**
 * Verifica que haya una sesión de staff válida (JEFE o SOCIO); si no, redirige al
 * login. Los clientes autorregistrados (rol CLIENTE) también tienen sesión válida
 * pero no pertenecen al staff, por eso se rechazan aquí igual que si no hubiera
 * sesión — defensa en profundidad detrás del proxy. Memoizado por render.
 */
export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session || (session.rol !== "JEFE" && session.rol !== "SOCIO")) {
    redirect("/admin/login");
  }
  return session;
});

/** Igual que verifySession, pero exige rol JEFE — usado por el módulo de gestión (Cajas). */
export const verifyJefe = cache(async () => {
  const session = await verifySession();
  if (session.rol !== "JEFE") redirect("/admin/socio");
  return session;
});
