import type { Metadata } from "next";
import { LandingScreen } from "@/components/site/landing-screen";
import { VisitTracker } from "@/components/site/visit-tracker";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Casa Insumos | Cajas de Devoluciones Amazon en Bolivia",
  },
  description:
    "Cajas de devoluciones de Amazon en Bolivia con manifiesto verificado, cotización de importaciones y desarrollo web en Bolivia a medida. Cotiza ahora.",
  keywords: [
    "cajas devoluciones en Bolivia",
    "cajas de retorno Amazon",
    "desarrollo web en Bolivia",
    "liquidación por lote",
    "importación de mercancía",
    "cotización de importaciones",
    "Casa Insumos",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Casa Insumos | Cajas de Devoluciones Amazon en Bolivia",
    description:
      "Cajas de devoluciones de Amazon en Bolivia, cotización de importaciones y desarrollo web en Bolivia a medida.",
    url: "/",
    siteName: "Casa Insumos",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Casa Insumos | Cajas de Devoluciones Amazon en Bolivia",
    description:
      "Cajas de devoluciones de Amazon en Bolivia, cotización de importaciones y desarrollo web en Bolivia a medida.",
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
