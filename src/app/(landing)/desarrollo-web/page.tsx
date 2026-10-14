import type { Metadata } from "next";
import { VisitTracker } from "@/components/site/visit-tracker";
import { SiteNavbar } from "@/components/site/site-navbar";
import { WebDevHero } from "@/components/site/webdev-hero";
import { WebDevPricing } from "@/components/site/webdev-pricing";
import { WebDevPortfolio } from "@/components/site/webdev-portfolio";
import { WebDevContact } from "@/components/site/webdev-contact";
import { SiteFooter } from "@/components/site/site-footer";
import { getTipoCambioUsdBob } from "@/lib/data/ajustes";
import { getDictionary } from "@/lib/i18n/locale";
import { MonedaProvider } from "@/lib/moneda/moneda-context";
import { getMoneda } from "@/lib/moneda/moneda";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  const m = dict.meta.webdev;

  return {
    title: { absolute: m.title },
    description: m.description,
    alternates: { canonical: "/desarrollo-web" },
    openGraph: {
      title: m.title,
      description: m.ogDescription,
      url: "/desarrollo-web",
      type: "website",
    },
  };
}

export default async function DesarrolloWebPage() {
  const [moneda, tipoCambio] = await Promise.all([getMoneda(), getTipoCambioUsdBob()]);

  // Los precios se cargan en dólares; MonedaProvider permite verlos en Bs.
  return (
    <MonedaProvider initialMoneda={moneda} tipoCambio={tipoCambio}>
      <VisitTracker />
      <SiteNavbar seccion="webdev" />
      <WebDevHero />
      <WebDevPricing />
      <WebDevPortfolio />
      <WebDevContact />
      {/* Sin burbuja flotante (igual que la portada): hero, paquetes y contacto
          ya tienen su botón de WhatsApp. La sección de reseñas vuelve cuando
          haya reseñas reales para mostrar (WebDevReviews). */}
      {/* id="pie": "#contacto" ya es el bloque de contacto de esta página. */}
      <SiteFooter seccion="webdev" id="pie" />
    </MonedaProvider>
  );
}
