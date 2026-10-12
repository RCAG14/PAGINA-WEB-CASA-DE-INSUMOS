import type { Metadata } from "next";
import { VisitTracker } from "@/components/site/visit-tracker";
import { WebDevHeader } from "@/components/site/webdev-header";
import { WebDevHero } from "@/components/site/webdev-hero";
import { WebDevPricing } from "@/components/site/webdev-pricing";
import { WebDevPortfolio } from "@/components/site/webdev-portfolio";
import { WebDevContact } from "@/components/site/webdev-contact";
import { HomeFooter } from "@/components/site/home-footer";
import { HOME_CONTAINER } from "@/lib/layout";
import { getLogo } from "@/lib/data/landing";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import { getSession } from "@/lib/auth/session";
import { getDictionary } from "@/lib/i18n/locale";

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

export default async function DesarrolloWebPage() {
  const [logo, whatsappNumero, session, { dict }] = await Promise.all([
    getLogo(),
    getNumeroWhatsappPrincipal(),
    getSession(),
    getDictionary(),
  ]);

  return (
    <>
      <VisitTracker />
      <WebDevHeader
        logoUrl={logo?.url ?? null}
        session={session ? { nombre: session.nombre, rol: session.rol } : null}
      />
      <WebDevHero />
      <WebDevPricing />
      <WebDevPortfolio />
      <WebDevContact />
      {/* Sin burbuja flotante (igual que la portada): hero, paquetes y contacto
          ya tienen su botón de WhatsApp. La sección de reseñas vuelve cuando
          haya reseñas reales para mostrar (WebDevReviews). */}
      <HomeFooter
        logoUrl={logo?.url ?? null}
        whatsappNumero={whatsappNumero}
        containerClassName={HOME_CONTAINER}
        id="pie"
        description={dict.webdev.contact.footerDescription}
      />
    </>
  );
}
