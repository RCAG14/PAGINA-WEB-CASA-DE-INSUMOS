import type { Metadata } from "next";
import { Suspense } from "react";
import { HeroSection } from "@/components/site/hero-section";
import { HowToBuy } from "@/components/site/how-to-buy";
import { PromoBanners } from "@/components/site/promo-banners";
import { CatalogSection } from "@/components/site/catalog-section";
import { CatalogBrowserSkeleton } from "@/components/site/catalog-browser-skeleton";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { getDictionary } from "@/lib/i18n/locale";
import { HOME_CONTAINER } from "@/lib/layout";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cajas de Devoluciones de Amazon en Bolivia",
  description:
    "Cajas de devoluciones de Amazon en Bolivia con manifiesto verificado y certificación aduanera. Cajas de retorno por lote o sorpresa. Ve el catálogo.",
  alternates: { canonical: "/cajas-devoluciones-amazon-bolivia" },
  openGraph: {
    title: "Cajas de Devoluciones de Amazon en Bolivia | Casa de Insumos",
    description:
      "Lotes listados con manifiesto verificado o cajas sorpresa clasificadas por categoría, con certificación aduanera documentada en Bolivia.",
    url: "/cajas-devoluciones-amazon-bolivia",
    type: "website",
  },
};

export default async function CatalogoPage() {
  const { dict } = await getDictionary();

  // Orden pensado para comprar rápido: hero corto → catálogo → cómo comprar.
  // Navbar y footer los pone el layout (site), igual que en ficha, carrito y checkout.
  return (
    <>
      <HeroSection />
      <PromoBanners />
      <section id="catalogo" className="scroll-mt-20">
        <div className={cn(HOME_CONTAINER, "py-12 lg:py-16")}>
          <ScrollReveal className="mb-6 flex flex-col items-center gap-2 text-center">
            <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
              {dict.catalogPage.eyebrow}
            </span>
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              {dict.catalogPage.title}
            </h2>
            <p className="max-w-2xl text-base text-muted-foreground">
              {dict.catalogPage.description}
            </p>
          </ScrollReveal>
          <Suspense fallback={<CatalogBrowserSkeleton />}>
            <CatalogSection />
          </Suspense>
        </div>
      </section>
      <HowToBuy />
    </>
  );
}
