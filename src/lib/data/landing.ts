import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary, type CloudinaryResourceType } from "@/lib/cloudinary";

export type TipoContenidoLanding =
  | "hero_video"
  | "hero_imagen"
  | "about_imagen"
  | "banner_promo"
  | "logo";
export type FormatoMedia = "imagen" | "video";

function formatoToResourceType(formato: string): CloudinaryResourceType {
  return formato === "video" ? "video" : "image";
}

export interface ContenidoLandingInput {
  tipo: TipoContenidoLanding;
  formato: FormatoMedia;
  url: string;
  cloudinaryPublicId: string;
  titulo?: string | null;
  subtitulo?: string | null;
  enlaceCta?: string | null;
  textoCta?: string | null;
  activo: boolean;
}

export async function getContenidoLandingAdmin() {
  return prisma.contenidoLanding.findMany({ orderBy: [{ tipo: "asc" }, { orden: "asc" }] });
}

export async function getContenidoLandingPorTipo(tipo: TipoContenidoLanding) {
  return prisma.contenidoLanding.findMany({
    where: { tipo, activo: true },
    orderBy: { orden: "asc" },
  });
}

export async function getHeroVideo() {
  const rows = await getContenidoLandingPorTipo("hero_video");
  return rows[0] ?? null;
}

export async function getHeroImagenes() {
  return getContenidoLandingPorTipo("hero_imagen");
}

export async function getAboutImagen() {
  const rows = await getContenidoLandingPorTipo("about_imagen");
  return rows[0] ?? null;
}

export async function getBannersPromo() {
  return getContenidoLandingPorTipo("banner_promo");
}

export async function getLogo() {
  const rows = await getContenidoLandingPorTipo("logo");
  return rows[0] ?? null;
}

export async function crearContenidoLanding(input: ContenidoLandingInput) {
  const count = await prisma.contenidoLanding.count({ where: { tipo: input.tipo } });
  return prisma.contenidoLanding.create({
    data: {
      tipo: input.tipo,
      formato: input.formato,
      url: input.url,
      cloudinary_public_id: input.cloudinaryPublicId,
      titulo: input.titulo || null,
      subtitulo: input.subtitulo || null,
      enlace_cta: input.enlaceCta || null,
      texto_cta: input.textoCta || null,
      activo: input.activo,
      orden: count,
    },
  });
}

export async function actualizarContenidoLanding(id: string, input: ContenidoLandingInput) {
  const anterior = await prisma.contenidoLanding.findUnique({ where: { id } });

  await prisma.contenidoLanding.update({
    where: { id },
    data: {
      formato: input.formato,
      url: input.url,
      cloudinary_public_id: input.cloudinaryPublicId,
      titulo: input.titulo || null,
      subtitulo: input.subtitulo || null,
      enlace_cta: input.enlaceCta || null,
      texto_cta: input.textoCta || null,
      activo: input.activo,
    },
  });

  // Si el admin reemplazó el archivo (nuevo public_id), limpia el asset viejo en Cloudinary.
  if (anterior && anterior.cloudinary_public_id !== input.cloudinaryPublicId) {
    await deleteFromCloudinary(
      anterior.cloudinary_public_id,
      formatoToResourceType(anterior.formato)
    ).catch(() => {});
  }
}

export async function actualizarOrdenContenidoLanding(id: string, orden: number) {
  await prisma.contenidoLanding.update({ where: { id }, data: { orden } });
}

export async function eliminarContenidoLanding(id: string) {
  const row = await prisma.contenidoLanding.delete({ where: { id } });
  await deleteFromCloudinary(row.cloudinary_public_id, formatoToResourceType(row.formato)).catch(
    () => {}
  );
}
