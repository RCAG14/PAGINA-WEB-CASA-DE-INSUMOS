import { CheckoutForm } from "@/components/site/checkout-form";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";

export default async function CheckoutPage() {
  const whatsappNumero = await getNumeroWhatsappPrincipal();
  return <CheckoutForm whatsappNumero={whatsappNumero} />;
}
