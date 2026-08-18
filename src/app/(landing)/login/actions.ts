"use server";

import { redirect } from "next/navigation";
import { autenticarUsuario } from "@/lib/auth/authenticate";

export interface AuthState {
  error?: string;
}

export async function loginClienteAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Ingresa tu usuario y contraseña." };
  }

  const usuario = await autenticarUsuario(username, password);
  if (!usuario) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  const destino = usuario.rol === "JEFE" ? "/admin" : usuario.rol === "SOCIO" ? "/admin/socio" : "/";
  redirect(destino);
}
