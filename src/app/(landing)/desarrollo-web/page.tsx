import type { Metadata } from "next";
import { VisitTracker } from "@/components/site/visit-tracker";
import { WebDevHeader } from "@/components/site/webdev-header";
import { WebDevHero } from "@/components/site/webdev-hero";
import { WebDevTypes } from "@/components/site/webdev-types";
import { WebDevPricing } from "@/components/site/webdev-pricing";
import { WebDevPortfolio } from "@/components/site/webdev-portfolio";
import { WebDevAffiliates } from "@/components/site/webdev-affiliates";
import { WebDevReviews } from "@/components/site/webdev-reviews";
import { WebDevContact } from "@/components/site/webdev-contact";
import { WhatsAppBubble } from "@/components/site/whatsapp-bubble";
import { getLogo } from "@/lib/data/landing";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import { getSession } from "@/lib/auth/session";

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
  const [logo, whatsappNumero, session] = await Promise.all([
    getLogo(),
    getNumeroWhatsappPrincipal(),
    getSession(),
  ]);

  return (
    <>
      <VisitTracker />
      <WebDevHeader
        logoUrl={logo?.url ?? null}
        session={session ? { nombre: session.nombre, rol: session.rol } : null}
      />
      <WebDevHero />
      <WebDevTypes />
      <WebDevPricing />
      <WebDevPortfolio />
      <WebDevAffiliates />
      <WebDevReviews />
      <WebDevContact />
      <WhatsAppBubble numero={whatsappNumero} />
    </>
  );
}
