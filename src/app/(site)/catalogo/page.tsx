import type { Metadata } from "next";
import { HeroSection } from "@/components/site/hero-section";
import { AboutSection } from "@/components/site/about-section";
import { ServicesSection } from "@/components/site/services-section";
import { PromoBanners } from "@/components/site/promo-banners";
import { CatalogBrowser } from "@/components/site/catalog-browser";
import { getCajas } from "@/lib/data/cajas";
import { getClasificaciones } from "@/lib/data/clasificaciones";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de Cajas de Retorno de Amazon",
  description:
    "Explora nuestro catálogo de cajas de retorno de Amazon: lotes listados con manifiesto verificado o cajas sorpresa clasificadas por categoría, con certificación aduanera y valor retail estimado.",
  alternates: { canonical: "/catalogo" },
  openGraph: {
    title: "Catálogo de Cajas de Retorno de Amazon | Casa de Insumos",
    description:
      "Lotes listados con manifiesto verificado o cajas sorpresa clasificadas por categoría, con certificación aduanera documentada.",
    url: "/catalogo",
    type: "website",
  },
};

export default async function CatalogoPage() {
  const [boxes, classifications] = await Promise.all([getCajas(), getClasificaciones()]);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PromoBanners />
      <section id="catalogo" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6">
        <div className="mb-8 flex flex-col gap-2">
          <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
            02 — Catálogo
          </span>
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            Cajas de retorno disponibles
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Filtra por tipo de caja y clasificación. Las cajas <strong>listadas</strong> muestran
            el manifiesto técnico exacto del contenido; las cajas <strong>sorpresa</strong>{" "}
            confirman solo la clasificación general, con mayor potencial de margen.
          </p>
        </div>
        <CatalogBrowser boxes={boxes} classifications={classifications} />
      </section>
    </>
  );
}
