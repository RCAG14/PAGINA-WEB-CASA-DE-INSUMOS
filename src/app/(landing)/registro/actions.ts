"use server";

import { redirect } from "next/navigation";
import { crearCliente, getUsuarioByUsername } from "@/lib/data/usuarios";
import { createSession } from "@/lib/auth/session";

export interface AuthState {
  error?: string;
}

export async function registrarClienteAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmar = String(formData.get("confirmar") ?? "");

  if (!nombre || !username || !password) {
    return { error: "Completa todos los campos." };
  }
  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }
  if (password !== confirmar) {
    return { error: "Las contraseñas no coinciden." };
  }

  const existente = await getUsuarioByUsername(username);
  if (existente) {
    return { error: "Ese usuario ya está en uso." };
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
