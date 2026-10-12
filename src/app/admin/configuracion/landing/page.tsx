import { AdminTopbar } from "@/components/admin/admin-topbar";
import { LandingMediaManager } from "@/components/admin/landing-media-manager";
import { getContenidoLandingAdmin } from "@/lib/data/landing";
import { getCajas } from "@/lib/data/cajas";
import { getClasificaciones } from "@/lib/data/clasificaciones";

export const dynamic = "force-dynamic";

export default async function AdminLandingPage() {
  const [items, boxes, classifications] = await Promise.all([
    getContenidoLandingAdmin(),
    getCajas(),
    getClasificaciones(),
  ]);

  return (
    <>
      <AdminTopbar
        title="Imágenes Promocionales / Landing Page"
        eyebrow="Configuración Global del Sistema"
      />
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Sube y administra el logo de la empresa y los banners de promociones del catálogo de
          cajas. Los cambios se guardan en Supabase Storage y se ven al instante en el sitio, sin
          tocar código.
        </p>
        <LandingMediaManager items={items} boxes={boxes} classifications={classifications} />
      </div>
    </>
  );
}
