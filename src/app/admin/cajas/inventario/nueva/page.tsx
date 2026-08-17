import { AdminTopbar } from "@/components/admin/admin-topbar";
import { CrearCajaForm } from "@/components/admin/crear-caja-form";
import { getClasificaciones } from "@/lib/data/clasificaciones";

export const dynamic = "force-dynamic";

export default async function NuevaCajaPage() {
  const classifications = await getClasificaciones();

  return (
    <>
      <AdminTopbar title="Nueva caja" eyebrow="Gestión de Cajas Amazon y Retornos" />
      <div className="mx-auto max-w-4xl p-4 sm:p-6">
        <CrearCajaForm classifications={classifications} />
      </div>
    </>
  );
}
