import { HeroSection } from "@/components/site/hero-section";
import { AboutSection } from "@/components/site/about-section";
import { ServicesSection } from "@/components/site/services-section";
import { PromoBanners } from "@/components/site/promo-banners";
import { CatalogBrowser } from "@/components/site/catalog-browser";
import { getCajas } from "@/lib/data/cajas";
import { getClasificaciones } from "@/lib/data/clasificaciones";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
