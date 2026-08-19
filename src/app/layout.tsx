import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { getLocale } from "@/lib/i18n/locale";
import { ThemeProvider } from "@/lib/theme/theme-context";
import { getTheme } from "@/lib/theme/theme";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Casa de Insumos",
    default: "Casa de Insumos | Cajas de Retorno de Amazon",
  },
  description:
    "Venta de cajas de retorno de Amazon listadas y sorpresa, con manifiesto verificado, certificación aduanera y margen documentado para revendedores.",
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [locale, theme] = await Promise.all([getLocale(), getTheme()]);

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable} h-full antialiased ${theme === "dark" ? "dark" : ""}`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider initialTheme={theme}>
          <LocaleProvider initialLocale={locale}>
            <TooltipProvider delay={150}>{children}</TooltipProvider>
          </LocaleProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
