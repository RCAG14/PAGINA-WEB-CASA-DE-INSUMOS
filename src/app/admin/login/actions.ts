"use server";

import { redirect } from "next/navigation";
import { autenticarUsuario } from "@/lib/auth/authenticate";

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

  const usuario = await autenticarUsuario(username, password);
  if (!usuario) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  const destinoPorDefecto = usuario.rol === "SOCIO" ? "/admin/socio" : "/admin";
  const destino = next && next.startsWith("/admin") ? next : destinoPorDefecto;
  redirect(destino);
}
