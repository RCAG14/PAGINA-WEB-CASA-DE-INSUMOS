"use server";

import { redirect } from "next/navigation";
import { getUsuarioByUsername } from "@/lib/data/usuarios";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import type { Rol } from "@/lib/auth/jwt";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!username || !password) {
    return { error: "Ingresa tu usuario y contraseña." };
  }

  const usuario = await getUsuarioByUsername(username);
  if (!usuario || !usuario.activo) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  const valido = await verifyPassword(password, usuario.password_hash);
  if (!valido) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  await createSession({
    userId: usuario.id,
    username: usuario.username,
    nombre: usuario.nombre,
    rol: usuario.rol as Rol,
  });

  const destinoPorDefecto = usuario.rol === "SOCIO" ? "/admin/socio" : "/admin";
  const destino = next && next.startsWith("/admin") ? next : destinoPorDefecto;
  redirect(destino);
}
