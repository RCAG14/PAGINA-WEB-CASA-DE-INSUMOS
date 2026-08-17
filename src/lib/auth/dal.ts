import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

/** Verifica que haya una sesión válida; si no, redirige al login. Memoizado por render. */
export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
});

/** Igual que verifySession, pero exige rol JEFE — usado por el módulo de gestión (Cajas). */
export const verifyJefe = cache(async () => {
  const session = await verifySession();
  if (session.rol !== "JEFE") redirect("/admin/socio");
  return session;
});
