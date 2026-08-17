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
        eyebrow="Gestión de Cajas Amazon y Retornos"
      />
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Sube y administra el video o carrusel del encabezado, la imagen de &quot;Sobre
          nosotros&quot; y los banners de promociones que se muestran en la página principal.
          Todo se guarda en Cloudinary y se refleja al instante en la tienda, sin tocar código.
        </p>
        <LandingMediaManager items={items} boxes={boxes} classifications={classifications} />
      </div>
    </>
  );
}
