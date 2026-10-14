"use server";

import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/i18n/locale";
import { crearCliente, getUsuarioByUsername } from "@/lib/data/usuarios";
import { createSession } from "@/lib/auth/session";

export interface AuthState {
  error?: string;
}

export async function registrarClienteAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const { dict } = await getDictionary();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmar = String(formData.get("confirmar") ?? "");

  if (!nombre || !username || !password) {
    return { error: dict.auth.errors.registerMissing };
  }
  if (password.length < 6) {
    return { error: dict.auth.errors.passwordTooShort };
  }
  if (password !== confirmar) {
    return { error: dict.auth.errors.passwordMismatch };
  }

  const existente = await getUsuarioByUsername(username);
  if (existente) {
    return { error: dict.auth.errors.usernameTaken };
  }

  const usuario = await crearCliente({ nombre, username, password });

  await createSession({
    userId: usuario.id,
    username: usuario.username,
    nombre: usuario.nombre,
    rol: "CLIENTE",
  });

  redirect("/");
}
