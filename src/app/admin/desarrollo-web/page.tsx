import { AdminTopbar } from "@/components/admin/admin-topbar";
import { PaquetesTable } from "@/components/admin/paquetes-table";
import { ExtrasTable } from "@/components/admin/extras-table";
import { TrabajosManager } from "@/components/admin/trabajos-manager";
import { TipoCambioForm } from "@/components/admin/tipo-cambio-form";
import { getTipoCambioUsdBob } from "@/lib/data/ajustes";
import {
  getExtrasDesarrolloAdmin,
  getPaquetesDesarrolloAdmin,
  getTrabajosRealizadosAdmin,
} from "@/lib/data/desarrollo";

export const dynamic = "force-dynamic";

export default async function AdminDesarrolloWebPage() {
  const [paquetes, extras, trabajos, tipoCambio] = await Promise.all([
    getPaquetesDesarrolloAdmin(),
    getExtrasDesarrolloAdmin(),
    getTrabajosRealizadosAdmin(),
    getTipoCambioUsdBob(),
  ]);

  return (
    <>
      <AdminTopbar title="Paquetes y Trabajos" eyebrow="Desarrollo Web a Medida" />
      <div className="flex flex-col gap-10 p-4 sm:p-6">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Gestiona el contenido de la landing pública en{" "}
          <code className="font-mono-technical text-xs">/desarrollo-web</code>: los paquetes de
          precio, los extras y el portfolio de trabajos realizados. Los precios van en dólares
          y cada registro admite su traducción al inglés.
        </p>
        <TipoCambioForm tipoCambio={tipoCambio} />
        <PaquetesTable paquetes={paquetes} />
        <ExtrasTable extras={extras} />
        <TrabajosManager trabajos={trabajos} />
      </div>
    </>
  );
}
