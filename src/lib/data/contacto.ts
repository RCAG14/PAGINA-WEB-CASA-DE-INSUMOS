import { prisma } from "@/lib/prisma";

export interface RedSocialInput {
  plataforma: string;
  url: string;
  activo: boolean;
}

export interface NumeroContactoInput {
  etiqueta: string;
  numero: string;
  activo: boolean;
}

export async function getRedesSociales() {
  return prisma.redSocial.findMany({ where: { activo: true }, orderBy: { orden: "asc" } });
}

export async function getRedesSocialesAdmin() {
  return prisma.redSocial.findMany({ orderBy: { orden: "asc" } });
}

export async function crearRedSocial(input: RedSocialInput) {
  const count = await prisma.redSocial.count();
  return prisma.redSocial.create({ data: { ...input, orden: count } });
}

export async function actualizarRedSocial(id: string, input: RedSocialInput) {
  return prisma.redSocial.update({ where: { id }, data: input });
}

export async function eliminarRedSocial(id: string) {
  await prisma.redSocial.delete({ where: { id } });
}

export async function getNumerosContacto() {
  return prisma.numeroContacto.findMany({ where: { activo: true }, orderBy: { orden: "asc" } });
}

export async function getNumerosContactoAdmin() {
  return prisma.numeroContacto.findMany({ orderBy: { orden: "asc" } });
}

export async function getNumeroWhatsappPrincipal() {
  const numero = await prisma.numeroContacto.findFirst({
    where: { activo: true },
    orderBy: { orden: "asc" },
  });
  return numero?.numero ?? null;
}

export async function crearNumeroContacto(input: NumeroContactoInput) {
  const count = await prisma.numeroContacto.count();
  return prisma.numeroContacto.create({ data: { ...input, orden: count } });
}

export async function actualizarNumeroContacto(id: string, input: NumeroContactoInput) {
  return prisma.numeroContacto.update({ where: { id }, data: input });
}

export async function eliminarNumeroContacto(id: string) {
  await prisma.numeroContacto.delete({ where: { id } });
}
