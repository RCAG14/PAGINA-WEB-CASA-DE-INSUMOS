import { prisma } from "@/lib/prisma";
import { deleteFromSupabaseStorage } from "@/lib/supabase";

export type TipoContenidoLanding =
  | "hero_video"
  | "hero_imagen"
  | "about_imagen"
  | "banner_promo"
  | "logo";
export type FormatoMedia = "imagen" | "video";
/** Negocio al que pertenece el contenido. Ignorado para tipo="logo" (marca compartida). */
export type SitioContenido = "cajas" | "webdev";

export interface ContenidoLandingInput {
  tipo: TipoContenidoLanding;
  sitio: SitioContenido;
  formato: FormatoMedia;
  url: string;
  storagePath: string;
  titulo?: string | null;
  subtitulo?: string | null;
  enlaceCta?: string | null;
  textoCta?: string | null;
  activo: boolean;
}

export async function getContenidoLandingAdmin() {
  return prisma.contenidoLanding.findMany({ orderBy: [{ tipo: "asc" }, { orden: "asc" }] });
}

export async function getContenidoLandingPorTipo(
  tipo: TipoContenidoLanding,
  sitio?: SitioContenido
) {
  return prisma.contenidoLanding.findMany({
    where: { tipo, activo: true, ...(sitio ? { sitio } : {}) },
    orderBy: { orden: "asc" },
  });
}

export async function getHeroVideo(sitio: SitioContenido) {
  const rows = await getContenidoLandingPorTipo("hero_video", sitio);
  return rows[0] ?? null;
}

export async function getHeroImagenes(sitio: SitioContenido) {
  return getContenidoLandingPorTipo("hero_imagen", sitio);
}

export async function getAboutImagen() {
  const rows = await getContenidoLandingPorTipo("about_imagen", "cajas");
  return rows[0] ?? null;
}

export async function getBannersPromo() {
  return getContenidoLandingPorTipo("banner_promo", "cajas");
}

/** Últimas `limit` ofertas/promociones activas, sin importar de qué servicio sean — usadas en la tira superior del portal (/). */
export async function getUltimasOfertas(limit: number) {
  return prisma.contenidoLanding.findMany({
    where: { tipo: "banner_promo", activo: true },
    orderBy: { creado_en: "desc" },
    take: limit,
  });
}

export async function getLogo() {
  const rows = await getContenidoLandingPorTipo("logo");
  return rows[0] ?? null;
}

export async function crearContenidoLanding(input: ContenidoLandingInput) {
  const count = await prisma.contenidoLanding.count({
    where: { tipo: input.tipo, sitio: input.sitio },
  });
  return prisma.contenidoLanding.create({
    data: {
      tipo: input.tipo,
      sitio: input.sitio,
      formato: input.formato,
      url: input.url,
      storage_path: input.storagePath,
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
      storage_path: input.storagePath,
      titulo: input.titulo || null,
      subtitulo: input.subtitulo || null,
      enlace_cta: input.enlaceCta || null,
      texto_cta: input.textoCta || null,
      activo: input.activo,
    },
  });

  // Si el admin reemplazó el archivo (nuevo path), limpia el asset viejo en Supabase Storage.
  if (anterior && anterior.storage_path !== input.storagePath) {
    await deleteFromSupabaseStorage(anterior.storage_path).catch(() => {});
  }
}

export async function actualizarOrdenContenidoLanding(id: string, orden: number) {
  await prisma.contenidoLanding.update({ where: { id }, data: { orden } });
}

export async function eliminarContenidoLanding(id: string) {
  const row = await prisma.contenidoLanding.delete({ where: { id } });
  await deleteFromSupabaseStorage(row.storage_path).catch(() => {});
}
