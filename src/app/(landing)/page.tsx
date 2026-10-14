import type { Metadata } from "next";
import { LandingScreen } from "@/components/site/landing-screen";
import { VisitTracker } from "@/components/site/visit-tracker";
import { OrganizationJsonLd } from "@/components/site/organization-jsonld";
import { getLogo } from "@/lib/data/landing";
import { getNumeroWhatsappPrincipal, getRedesSociales } from "@/lib/data/contacto";
import { getDictionary } from "@/lib/i18n/locale";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  const m = dict.meta.home;

  return {
    title: { absolute: m.title },
    description: m.description,
    keywords: [
      "cajas devoluciones en Bolivia",
      "cajas de retorno Amazon",
      "desarrollo web a medida",
      "custom web development",
      "liquidación por lote",
      "Amazon return boxes Bolivia",
      "Casa de Insumos",
    ],
    alternates: { canonical: "/" },
    openGraph: {
      title: m.title,
      description: m.ogDescription,
      url: "/",
      siteName: "Casa de Insumos",
      locale: m.ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: m.title,
      description: m.ogDescription,
    },
  };
}

export default async function PortalPage() {
  const [logo, whatsappNumero, redesSociales, { dict }] = await Promise.all([
    getLogo(),
    getNumeroWhatsappPrincipal(),
    getRedesSociales(),
    getDictionary(),
  ]);

  return (
    <>
      <OrganizationJsonLd
        description={dict.meta.organization}
        logoUrl={logo?.url}
        telefono={whatsappNumero}
        redesSociales={redesSociales}
      />
      <VisitTracker />
      <LandingScreen />
    </>
  );
}
