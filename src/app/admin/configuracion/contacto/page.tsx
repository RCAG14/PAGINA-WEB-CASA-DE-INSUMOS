import { AdminTopbar } from "@/components/admin/admin-topbar";
import { ConfiguracionTables } from "@/components/admin/configuracion-tables";
import { getNumerosContactoAdmin, getRedesSocialesAdmin } from "@/lib/data/contacto";

export const dynamic = "force-dynamic";

export default async function AdminConfiguracionPage() {
  const [redesSociales, numerosContacto] = await Promise.all([
    getRedesSocialesAdmin(),
    getNumerosContactoAdmin(),
  ]);

  return (
    <>
      <AdminTopbar title="Redes y Contacto" eyebrow="Configuración Global del Sistema" />
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Configura los enlaces de redes sociales que se muestran en la tienda y los números de
          WhatsApp usados para redirigir a los clientes desde el checkout.
        </p>
        <ConfiguracionTables redesSociales={redesSociales} numerosContacto={numerosContacto} />
      </div>
    </>
  );
}
