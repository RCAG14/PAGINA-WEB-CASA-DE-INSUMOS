import { AdminTopbar } from "@/components/admin/admin-topbar";
import { InventarioTable } from "@/components/admin/inventario-table";
import { getCajas } from "@/lib/data/cajas";
import { getClasificaciones } from "@/lib/data/clasificaciones";

export const dynamic = "force-dynamic";

export default async function AdminInventarioPage() {
  const [boxes, classifications] = await Promise.all([getCajas(), getClasificaciones()]);

  return (
    <>
      <AdminTopbar title="Cajas" eyebrow="Gestión de Cajas Amazon y Retornos" />
      <div className="p-4 sm:p-6">
        <InventarioTable boxes={boxes} classifications={classifications} />
      </div>
    </>
  );
}
