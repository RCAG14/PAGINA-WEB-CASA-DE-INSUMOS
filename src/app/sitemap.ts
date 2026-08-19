import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cajas = await prisma.caja.findMany({
    select: { slug: true, actualizado_en: true },
    orderBy: { actualizado_en: "desc" },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/catalogo`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/desarrollo-web`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const productRoutes: MetadataRoute.Sitemap = cajas.map((caja) => ({
    url: `${SITE_URL}/productos/${caja.slug}`,
    lastModified: caja.actualizado_en,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
