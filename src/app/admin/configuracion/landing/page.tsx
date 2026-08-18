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
          Sube y administra el logo, el video o carrusel del encabezado, la imagen de &quot;Sobre
          nosotros&quot; y los banners de promociones. Elige abajo si estás configurando la landing
          de Venta de Cajas o la de Páginas Web — el logo es el único elemento compartido entre
          ambas. Todo se guarda en Supabase Storage y se refleja al instante en el sitio, sin
          tocar código.
        </p>
        <LandingMediaManager items={items} boxes={boxes} classifications={classifications} />
      </div>
    </>
  );
}
