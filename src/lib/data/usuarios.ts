import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import type { Rol } from "@/lib/auth/jwt";

export async function getUsuarioByUsername(username: string) {
  return prisma.usuario.findUnique({ where: { username } });
}

export async function getSocios() {
  return prisma.usuario.findMany({
    where: { rol: "SOCIO" },
    orderBy: { creado_en: "desc" },
  });
}

export interface CrearSocioInput {
  nombre: string;
  username: string;
  password: string;
}

export async function crearSocio(input: CrearSocioInput) {
  const passwordHash = await hashPassword(input.password);
  return prisma.usuario.create({
    data: {
      nombre: input.nombre,
      username: input.username,
      password_hash: passwordHash,
      rol: "SOCIO" as Rol,
    },
  });
}

export async function alternarActivoUsuario(id: string, activo: boolean) {
  await prisma.usuario.update({ where: { id }, data: { activo } });
}

export async function eliminarUsuario(id: string) {
  await prisma.usuario.delete({ where: { id } });
}
