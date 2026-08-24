import { AdminTopbar } from "@/components/admin/admin-topbar";
import { ModulosTable } from "@/components/admin/modulos-table";
import { getModulosConEstado } from "@/lib/data/modulos";

export const dynamic = "force-dynamic";

export default async function AdminModulosPage() {
  const modulos = await getModulosConEstado();

  return (
    <>
      <AdminTopbar title="Módulos del Sistema" eyebrow="Configuración Global del Sistema" />
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Activa o desactiva cada línea de negocio. Un módulo desactivado desaparece del portal y
          bloquea el acceso a sus páginas, incluso para el Jefe, hasta que se reactive aquí.
        </p>
        <ModulosTable modulos={modulos} />
      </div>
    </>
  );
}
