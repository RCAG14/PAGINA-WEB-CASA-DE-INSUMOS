import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptSession } from "@/lib/auth/jwt";
import { SESSION_COOKIE } from "@/lib/auth/session";

// Next.js 16 renombró `middleware.ts` a `proxy.ts` (misma funcionalidad).
// Corre en runtime Node.js por defecto desde v16, así que jose funciona sin
// restricciones de Edge. No se consulta la base de datos aquí — solo se
// verifica la firma del JWT (chequeo optimista); cada acción sensible vuelve
// a verificar la sesión server-side (ver src/lib/auth/dal.ts).

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login"]);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await decryptSession(token);

  if (!session) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Los clientes autorregistrados (rol CLIENTE) tienen sesión válida pero no
  // pertenecen al staff — nunca deben entrar a /admin.
  if (session.rol !== "JEFE" && session.rol !== "SOCIO") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // El Socio solo puede ver su propio dashboard de métricas.
  if (session.rol === "SOCIO" && !pathname.startsWith("/admin/socio")) {
    return NextResponse.redirect(new URL("/admin/socio", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
