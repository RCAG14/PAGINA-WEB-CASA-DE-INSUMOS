import { CheckoutForm } from "@/components/site/checkout-form";
import { FloatingLogo } from "@/components/site/floating-logo";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import { getLogo } from "@/lib/data/landing";

export default async function CheckoutPage() {
  const [whatsappNumero, logo] = await Promise.all([
    getNumeroWhatsappPrincipal(),
    getLogo(),
  ]);

  return (
    <>
      <FloatingLogo url={logo?.url ?? null} />
      <CheckoutForm whatsappNumero={whatsappNumero} />
    </>
  );
}
