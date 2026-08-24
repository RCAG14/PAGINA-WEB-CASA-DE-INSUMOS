import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import type { Rol } from "@/lib/auth/jwt";

export async function getUsuarioByUsername(username: string) {
  return prisma.usuario.findUnique({ where: { username } });
}

export async function getUsuarioById(id: string) {
  return prisma.usuario.findUnique({ where: { id } });
}

/** Roles de staff administrable desde /admin/configuracion/usuarios (excluye CLIENTE). */
export type RolStaff = "JEFE" | "SOCIO";

export async function getUsuariosStaff() {
  return prisma.usuario.findMany({
    where: { rol: { in: ["JEFE", "SOCIO"] } },
    orderBy: { creado_en: "desc" },
  });
}

export async function contarJefesActivos(excluirId?: string) {
  return prisma.usuario.count({
    where: {
      rol: "JEFE",
      activo: true,
      ...(excluirId ? { id: { not: excluirId } } : {}),
    },
  });
}

export interface CrearUsuarioStaffInput {
  nombre: string;
  username: string;
  password: string;
  rol: RolStaff;
}

export async function crearUsuarioStaff(input: CrearUsuarioStaffInput) {
  const passwordHash = await hashPassword(input.password);
  return prisma.usuario.create({
    data: {
      nombre: input.nombre,
      username: input.username,
      password_hash: passwordHash,
      rol: input.rol satisfies Rol,
    },
  });
}

export async function actualizarRolUsuario(id: string, rol: RolStaff) {
  await prisma.usuario.update({ where: { id }, data: { rol: rol satisfies Rol } });
}

export interface CrearClienteInput {
  nombre: string;
  username: string;
  password: string;
}

/** Autorregistro público — crea una cuenta con rol CLIENTE (sin acceso a /admin). */
export async function crearCliente(input: CrearClienteInput) {
  const passwordHash = await hashPassword(input.password);
  return prisma.usuario.create({
    data: {
      nombre: input.nombre,
      username: input.username,
      password_hash: passwordHash,
      rol: "CLIENTE" as Rol,
    },
  });
}

export async function alternarActivoUsuario(id: string, activo: boolean) {
  await prisma.usuario.update({ where: { id }, data: { activo } });
}

export async function eliminarUsuario(id: string) {
  await prisma.usuario.delete({ where: { id } });
}
