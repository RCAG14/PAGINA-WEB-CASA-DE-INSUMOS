"use server";

import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/i18n/locale";
import { autenticarUsuario } from "@/lib/auth/authenticate";

export interface AuthState {
  error?: string;
}

export async function loginClienteAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const { dict } = await getDictionary();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: dict.auth.errors.loginMissing };
  }

  const usuario = await autenticarUsuario(username, password);
  if (!usuario) {
    return { error: dict.auth.errors.loginInvalid };
  }

  const destino = usuario.rol === "JEFE" ? "/admin" : usuario.rol === "SOCIO" ? "/admin/socio" : "/";
  redirect(destino);
}
