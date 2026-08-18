import type { Metadata } from "next";
import { LandingScreen } from "@/components/site/landing-screen";
import { VisitTracker } from "@/components/site/visit-tracker";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Casa de Insumos | Cajas de Retorno, Importación y Desarrollo Web",
  },
  description:
    "Casa de Insumos: distribución técnica de cajas de retorno de Amazon con manifiesto verificado, cotización de importaciones y desarrollo web a medida para revendedores e importadores.",
  keywords: [
    "cajas de retorno Amazon",
    "liquidación por lote",
    "importación de mercancía",
    "cotización de importaciones",
    "desarrollo web a medida",
    "Casa de Insumos",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Casa de Insumos | Cajas de Retorno, Importación y Desarrollo Web",
    description:
      "Distribución técnica de cajas de retorno de Amazon, cotización de importaciones y desarrollo web a medida.",
    url: "/",
    siteName: "Casa de Insumos",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Casa de Insumos | Cajas de Retorno, Importación y Desarrollo Web",
    description:
      "Distribución técnica de cajas de retorno de Amazon, cotización de importaciones y desarrollo web a medida.",
  },
};

export default function PortalPage() {
  return (
    <>
      <VisitTracker />
      <LandingScreen />
    </>
  );
}
