import { notFound } from "next/navigation";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { EditarCajaForm } from "@/components/admin/editar-caja-form";
import { getCajaEditableById } from "@/lib/data/cajas";
import { getClasificaciones } from "@/lib/data/clasificaciones";
import { toDecimalNumber } from "@/lib/data/decimal";

export const dynamic = "force-dynamic";

export default async function EditarCajaPage(props: PageProps<"/admin/cajas/inventario/[id]/editar">) {
  const { id } = await props.params;
  const [caja, classifications] = await Promise.all([
    getCajaEditableById(id),
    getClasificaciones(),
  ]);

  if (!caja) notFound();

  return (
    <>
      <AdminTopbar title="Editar caja" eyebrow="Gestión de Cajas Amazon y Retornos" />
      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        <EditarCajaForm
          caja={{
            id: caja.id,
            nombre: caja.nombre,
            sku_lote: caja.sku_lote,
            clasificacion_id: caja.clasificacion_id,
            tipo_venta: caja.tipo_venta,
            descripcion_corta: caja.descripcion_corta,
            manifiesto: caja.manifiesto,
            origen: caja.origen,
            centro_retorno: caja.centro_retorno,
            certificacion_aduanera: caja.certificacion_aduanera,
            grado_liquidacion: caja.grado_liquidacion,
            peso_bruto: caja.peso_bruto,
            dimensiones: caja.dimensiones,
            costo_total: toDecimalNumber(caja.costo_total),
            precio_venta_caja: toDecimalNumber(caja.precio_venta_caja),
            stock_disponible: caja.stock_disponible,
            imagen_url: caja.imagen_url,
            imagen_path: caja.imagen_path,
            imagenes_referencia: caja.imagenes_referencia.map((i) => ({ url: i.url, path: i.path })),
          }}
          classifications={classifications}
        />
      </div>
    </>
  );
}
