import "server-only";
import { getUsuarioByUsername } from "@/lib/data/usuarios";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import type { Rol } from "@/lib/auth/jwt";

/** Verifica credenciales contra Usuario y, si son válidas, abre sesión. Usado por el login de staff y el de clientes. */
export async function autenticarUsuario(username: string, password: string) {
  const usuario = await getUsuarioByUsername(username);
  if (!usuario || !usuario.activo) return null;

  const valido = await verifyPassword(password, usuario.password_hash);
  if (!valido) return null;

  await createSession({
    userId: usuario.id,
    username: usuario.username,
    nombre: usuario.nombre,
    rol: usuario.rol as Rol,
  });

  return usuario;
}
