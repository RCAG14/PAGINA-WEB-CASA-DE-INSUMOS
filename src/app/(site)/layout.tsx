import { CartProvider } from "@/lib/cart-context";
import { LogoProvider } from "@/lib/logo-context";
import { SiteHeader } from "@/components/site/site-header";
import { HomeFooter } from "@/components/site/home-footer";
import { SiteFooterGate } from "@/components/site/site-footer-gate";
import { VisitTracker } from "@/components/site/visit-tracker";
import { getLogo } from "@/lib/data/landing";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import { getDictionary } from "@/lib/i18n/locale";
import { HOME_CONTAINER } from "@/lib/layout";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [logo, session, whatsappNumero, { dict }] = await Promise.all([
    getLogo(),
    getSession(),
    getNumeroWhatsappPrincipal(),
    getDictionary(),
  ]);

  return (
    <LogoProvider url={logo?.url ?? null}>
      <CartProvider>
        <VisitTracker />
        <SiteHeader session={session ? { nombre: session.nombre, rol: session.rol } : null} />
        <main className="flex-1">{children}</main>
        <SiteFooterGate>
          {/* Mismo footer que el catálogo (ficha, carrito, checkout). */}
          <HomeFooter
            logoUrl={logo?.url ?? null}
            whatsappNumero={whatsappNumero}
            containerClassName={HOME_CONTAINER}
            description={dict.footer.cajasDescription}
          />
        </SiteFooterGate>
      </CartProvider>
    </LogoProvider>
  );
}
