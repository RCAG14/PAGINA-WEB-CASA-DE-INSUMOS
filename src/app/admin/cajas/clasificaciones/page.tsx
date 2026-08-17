import { AdminTopbar } from "@/components/admin/admin-topbar";
import { ClasificacionesTable } from "@/components/admin/clasificaciones-table";
import { contarCajasPorClasificacion, getClasificaciones } from "@/lib/data/clasificaciones";

export const dynamic = "force-dynamic";

export default async function AdminClasificacionesPage() {
  const classifications = await getClasificaciones();
  const counts = Object.fromEntries(
    await Promise.all(
      classifications.map(async (c) => [c.id, await contarCajasPorClasificacion(c.id)] as const)
    )
  );

  return (
    <>
      <AdminTopbar title="Gestión de Clasificaciones" eyebrow="Gestión de Cajas Amazon y Retornos" />
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Las clasificaciones definen las etiquetas y filtros que ven los clientes en el catálogo
          público. Los cambios se guardan directamente en la base de datos.
        </p>
        <ClasificacionesTable classifications={classifications} counts={counts} />
      </div>
    </>
  );
}
