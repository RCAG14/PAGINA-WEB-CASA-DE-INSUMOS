import type { Metadata } from "next";
import { Poppins, Inter, Montserrat } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { getLocale } from "@/lib/i18n/locale";
import { getLogo } from "@/lib/data/landing";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const logo = await getLogo();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: "%s | Casa Insumos",
      default: "Casa Insumos | Cajas de Devoluciones Amazon en Bolivia",
    },
    description:
      "Venta de cajas de retorno de Amazon listadas y sorpresa, con manifiesto verificado, certificación aduanera y margen documentado para revendedores.",
    robots: { index: true, follow: true },
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
    // Favicon de la pestaña del navegador: usa el logo subido desde el panel
    // en cuanto exista; si no, cae al favicon.ico estático de siempre. Vive en
    // /public (no en app/) para que Next no lo agregue también automáticamente
    // por convención de archivo — así queda un solo <link rel="icon">, nunca dos.
    icons: { icon: logo?.url ?? "/favicon.ico" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${poppins.variable} ${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LocaleProvider initialLocale={locale}>
          <TooltipProvider delay={150}>{children}</TooltipProvider>
        </LocaleProvider>
        <Toaster />
      </body>
    </html>
  );
}
