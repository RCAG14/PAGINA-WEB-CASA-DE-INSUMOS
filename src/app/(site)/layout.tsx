import { CartProvider } from "@/lib/cart-context";
import { SiteNavbar } from "@/components/site/site-navbar";
import { SiteFooter } from "@/components/site/site-footer";
import { VisitTracker } from "@/components/site/visit-tracker";

export const dynamic = "force-dynamic";

/** Layout de la compra de cajas: catálogo, ficha de producto, carrito y checkout. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <VisitTracker />
      <SiteNavbar seccion="cajas" />
      <main className="flex-1">{children}</main>
      <SiteFooter seccion="cajas" />
    </CartProvider>
  );
}
