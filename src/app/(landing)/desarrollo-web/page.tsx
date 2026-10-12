import type { Metadata } from "next";
import { VisitTracker } from "@/components/site/visit-tracker";
import { SiteNavbar } from "@/components/site/site-navbar";
import { WebDevHero } from "@/components/site/webdev-hero";
import { WebDevPricing } from "@/components/site/webdev-pricing";
import { WebDevPortfolio } from "@/components/site/webdev-portfolio";
import { WebDevContact } from "@/components/site/webdev-contact";
import { SiteFooter } from "@/components/site/site-footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Desarrollo Web en Bolivia a Medida | Casa Insumos" },
  description:
    "Desarrollo web en Bolivia: sitios, sistemas, dashboards y chatbots a medida para cualquier negocio. Paquetes Básico, Estándar y Premium. Cotiza por WhatsApp.",
  alternates: { canonical: "/desarrollo-web" },
  openGraph: {
    title: "Desarrollo Web en Bolivia a Medida | Casa Insumos",
    description:
      "Sitios web, sistemas, dashboards y chatbots a medida — desarrollo web en Bolivia para cualquier tipo de negocio.",
    url: "/desarrollo-web",
    type: "website",
  },
};

export default function DesarrolloWebPage() {
  return (
    <>
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
    </>
  );
}
