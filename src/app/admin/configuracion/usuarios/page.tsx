import { AdminTopbar } from "@/components/admin/admin-topbar";
import { UsuariosTable } from "@/components/admin/usuarios-table";
import { verifyJefe } from "@/lib/auth/dal";
import { getUsuariosStaff } from "@/lib/data/usuarios";

export const dynamic = "force-dynamic";

export default async function AdminUsuariosPage() {
  const [session, usuarios] = await Promise.all([verifyJefe(), getUsuariosStaff()]);

  return (
    <>
      <AdminTopbar title="Usuarios y Roles" eyebrow="Configuración Global del Sistema" />
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Gestiona los accesos al panel administrativo: crea cuentas, asigna el rol de Jefe o
          Socio, y activa o desactiva el acceso de cada una.
        </p>
        <UsuariosTable usuarios={usuarios} currentUserId={session.userId} />
      </div>
    </>
  );
}
