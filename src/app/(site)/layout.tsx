import { CartProvider } from "@/lib/cart-context";
import { LogoProvider } from "@/lib/logo-context";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteFooterGate } from "@/components/site/site-footer-gate";
import { VisitTracker } from "@/components/site/visit-tracker";
import { WhatsAppBubble } from "@/components/site/whatsapp-bubble";
import { getLogo } from "@/lib/data/landing";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [logo, session, whatsappNumero] = await Promise.all([
    getLogo(),
    getSession(),
    getNumeroWhatsappPrincipal(),
  ]);

  return (
    <LogoProvider url={logo?.url ?? null}>
      <CartProvider>
        <VisitTracker />
        <SiteHeader session={session ? { nombre: session.nombre, rol: session.rol } : null} />
        <main className="flex-1">{children}</main>
        <SiteFooterGate>
          <SiteFooter />
        </SiteFooterGate>
        <WhatsAppBubble numero={whatsappNumero} />
      </CartProvider>
    </LogoProvider>
  );
}
