import { CartProvider } from "@/lib/cart-context";
import { LogoProvider } from "@/lib/logo-context";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { VisitTracker } from "@/components/site/visit-tracker";
import { getLogo } from "@/lib/data/landing";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const logo = await getLogo();

  return (
    <LogoProvider url={logo?.url ?? null}>
      <CartProvider>
        <VisitTracker />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </CartProvider>
    </LogoProvider>
  );
}
