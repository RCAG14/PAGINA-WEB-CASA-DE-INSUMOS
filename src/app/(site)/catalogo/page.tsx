import type { Metadata } from "next";
import { Suspense } from "react";
import { HeroSection } from "@/components/site/hero-section";
import { AboutSection } from "@/components/site/about-section";
import { ServicesSection } from "@/components/site/services-section";
import { PromoBanners } from "@/components/site/promo-banners";
import { CatalogSection } from "@/components/site/catalog-section";
import { CatalogBrowserSkeleton } from "@/components/site/catalog-browser-skeleton";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { getDictionary } from "@/lib/i18n/locale";

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
  const { dict } = await getDictionary();

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PromoBanners />
      <section id="catalogo" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6">
        <ScrollReveal className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
            {dict.catalogPage.eyebrow}
          </span>
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            {dict.catalogPage.title}
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">{dict.catalogPage.description}</p>
        </ScrollReveal>
        <Suspense fallback={<CatalogBrowserSkeleton />}>
          <CatalogSection />
        </Suspense>
      </section>
    </>
  );
}
