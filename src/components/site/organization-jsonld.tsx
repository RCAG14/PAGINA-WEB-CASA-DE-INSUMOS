import { SITE_URL } from "@/lib/site-url";
import { getRedSocialHref } from "@/lib/redes-sociales";

const MAPS_LINK = "https://maps.app.goo.gl/w8YaHofM24kX5KN97";
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? null;

interface OrganizationJsonLdProps {
  logoUrl?: string | null;
  telefono?: string | null;
  redesSociales?: { plataforma: string; url: string }[];
}

export function OrganizationJsonLd({
  logoUrl,
  telefono,
  redesSociales = [],
}: OrganizationJsonLdProps) {
  const sameAs = [
    ...redesSociales
      .filter((r) => r.plataforma !== "email" && r.plataforma !== "otro")
      .map((r) => getRedSocialHref(r.plataforma, r.url)),
    MAPS_LINK,
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Casa de Insumos",
    alternateName: "Casa Insumos",
    url: SITE_URL,
    ...(logoUrl ? { logo: logoUrl } : {}),
    description:
      "Venta de cajas de retorno de Amazon listadas y sorpresa, con manifiesto verificado, certificación aduanera y margen documentado para revendedores.",
    ...(CONTACT_EMAIL ? { email: CONTACT_EMAIL } : {}),
    ...(telefono ? { telephone: telefono.startsWith("+") ? telefono : `+${telefono}` } : {}),
    sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
