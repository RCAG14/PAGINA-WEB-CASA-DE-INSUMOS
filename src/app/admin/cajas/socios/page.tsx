import { AdminTopbar } from "@/components/admin/admin-topbar";
import { SociosTable } from "@/components/admin/socios-table";
import { getSocios } from "@/lib/data/usuarios";

export const dynamic = "force-dynamic";

export default async function AdminSociosPage() {
  const socios = await getSocios();

  return (
    <>
      <AdminTopbar title="Socios" eyebrow="Gestión de Cajas Amazon y Retornos" />
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Genera accesos para tus socios comerciales. Entran a un dashboard de solo lectura con
          ventas, tráfico estimado y las cajas más vendidas, con opción de descargar un reporte
          en PDF.
        </p>
        <SociosTable socios={socios} />
      </div>
    </>
  );
}
