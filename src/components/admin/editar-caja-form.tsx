"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { actualizarCajaAction } from "@/app/admin/cajas/inventario/actions";
import { StorageUploader, type StorageAsset } from "@/components/admin/storage-uploader";
import { MultiStorageUploader } from "@/components/admin/multi-storage-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast, getErrorMessage } from "@/lib/toast";
import type { CategoryMeta } from "@/lib/types";

interface CajaEditable {
  id: string;
  nombre: string;
  sku_lote: string;
  clasificacion_id: string;
  tipo_venta: string;
  descripcion_corta: string;
  manifiesto: string | null;
  origen: string | null;
  centro_retorno: string | null;
  certificacion_aduanera: string | null;
  grado_liquidacion: string | null;
  peso_bruto: string | null;
  dimensiones: string | null;
  costo_total: number;
  precio_venta_caja: number;
  stock_disponible: number;
  imagen_url: string | null;
  imagen_path: string | null;
  imagenes_referencia: StorageAsset[];
}

export function EditarCajaForm({
  caja,
  classifications,
}: {
  caja: CajaEditable;
  classifications: CategoryMeta[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [nombre, setNombre] = useState(caja.nombre);
  const [skuLote, setSkuLote] = useState(caja.sku_lote);
  const [clasificacionId, setClasificacionId] = useState(caja.clasificacion_id);
  const [tipoVenta, setTipoVenta] = useState<"listada" | "sorpresa">(
    caja.tipo_venta === "sorpresa" ? "sorpresa" : "listada"
  );
  const [descripcionCorta, setDescripcionCorta] = useState(caja.descripcion_corta);
  const [costoTotal, setCostoTotal] = useState(caja.costo_total);
  const [precioVentaCaja, setPrecioVentaCaja] = useState(caja.precio_venta_caja);
  const [stockDisponible, setStockDisponible] = useState(caja.stock_disponible);
  const [imagen, setImagen] = useState<StorageAsset | null>(
    caja.imagen_url && caja.imagen_path
      ? { url: caja.imagen_url, path: caja.imagen_path }
      : null
  );

  const [incluyeManifiesto, setIncluyeManifiesto] = useState(caja.manifiesto !== null);
  const [manifiesto, setManifiesto] = useState(caja.manifiesto ?? "");
  const [origen, setOrigen] = useState(caja.origen ?? "");
  const [centroRetorno, setCentroRetorno] = useState(caja.centro_retorno ?? "");
  const [certificacionAduanera, setCertificacionAduanera] = useState(caja.certificacion_aduanera ?? "");
  const [gradoLiquidacion, setGradoLiquidacion] = useState(caja.grado_liquidacion ?? "");
  const [pesoBruto, setPesoBruto] = useState(caja.peso_bruto ?? "");
  const [dimensiones, setDimensiones] = useState(caja.dimensiones ?? "");

  const [imagenesReferencia, setImagenesReferencia] = useState<StorageAsset[]>(
    caja.imagenes_referencia
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await actualizarCajaAction(caja.id, {
          nombre,
          skuLote,
          clasificacionId,
          tipoVenta,
          descripcionCorta,
          manifiesto: incluyeManifiesto ? manifiesto : null,
          origen: incluyeManifiesto ? origen : null,
          centroRetorno: incluyeManifiesto ? centroRetorno : null,
          certificacionAduanera: incluyeManifiesto ? certificacionAduanera : null,
          gradoLiquidacion: incluyeManifiesto ? gradoLiquidacion : null,
          pesoBruto: incluyeManifiesto ? pesoBruto : null,
          dimensiones: incluyeManifiesto ? dimensiones : null,
          costoTotal,
          precioVentaCaja,
          stockDisponible,
          imagenUrl: imagen?.url ?? null,
          imagenPath: imagen?.path ?? null,
          imagenesReferencia: tipoVenta === "sorpresa" ? imagenesReferencia : [],
        });
        router.push("/admin/cajas/inventario");
        router.refresh();
        toast.success(`"${nombre}" se actualizó correctamente.`);
      } catch (err) {
        const message = getErrorMessage(err, "Verifica la conexión a la base de datos.");
        setError(message);
        toast.error({ title: "No se pudo guardar la caja", description: message });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <Alert className="border-red-600 bg-red-50">
          <AlertTitle className="font-mono-technical text-xs uppercase tracking-wider text-red-600">
            No se pudo guardar
          </AlertTitle>
          <AlertDescription className="text-xs text-red-600">{error}</AlertDescription>
        </Alert>
      )}

      <section className="border border-border">
        <div className="border-b border-border bg-primary px-3 py-2">
          <p className="font-mono-technical text-[11px] uppercase tracking-wider text-primary-foreground">
            Datos de la caja
          </p>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="ec-nombre" className="text-xs">Nombre de la caja</Label>
            <Input id="ec-nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>

          <div className="sm:col-span-2">
            <StorageUploader
              label="Foto de la caja (opcional)"
              resourceType="image"
              folder="casa-de-insumos/productos"
              value={imagen}
              onChange={setImagen}
              className="sm:max-w-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ec-sku" className="text-xs">SKU de lote</Label>
            <Input
              id="ec-sku"
              required
              className="font-mono-technical"
              value={skuLote}
              onChange={(e) => setSkuLote(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Clasificación</Label>
            <Select value={clasificacionId} onValueChange={(v) => setClasificacionId(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {() => classifications.find((c) => c.id === clasificacionId)?.label ?? "Selecciona una clasificación"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {classifications.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Tipo de venta</Label>
            <Select
              value={tipoVenta}
              onValueChange={(v) => setTipoVenta((v ?? "listada") as "listada" | "sorpresa")}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {() =>
                    tipoVenta === "sorpresa"
                      ? "Sorpresa (contenido reservado)"
                      : "Listada (manifiesto público)"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="listada">Listada (manifiesto público)</SelectItem>
                <SelectItem value="sorpresa">Sorpresa (contenido reservado)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ec-costo" className="text-xs">Costo total de la caja (Bs)</Label>
            <Input
              id="ec-costo"
              type="number"
              min={0}
              step="0.01"
              required
              value={costoTotal}
              onChange={(e) => setCostoTotal(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ec-precio" className="text-xs">Precio de venta de la caja (Bs)</Label>
            <Input
              id="ec-precio"
              type="number"
              min={0}
              step="0.01"
              required
              value={precioVentaCaja}
              onChange={(e) => setPrecioVentaCaja(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ec-stock" className="text-xs">Stock disponible</Label>
            <Input
              id="ec-stock"
              type="number"
              min={0}
              required
              value={stockDisponible}
              onChange={(e) => setStockDisponible(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="ec-desc" className="text-xs">Descripción corta</Label>
            <Textarea
              id="ec-desc"
              rows={3}
              required
              value={descripcionCorta}
              onChange={(e) => setDescripcionCorta(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="border border-border">
        <div className="flex items-center justify-between border-b border-border bg-primary px-3 py-2">
          <p className="font-mono-technical text-[11px] uppercase tracking-wider text-primary-foreground">
            02 — Manifiesto y logística internacional
          </p>
          <div className="flex items-center gap-2">
            <Label htmlFor="ec-incluye-manifiesto" className="text-xs text-primary-foreground">
              ¿Incluir manifiesto internacional?
            </Label>
            <Switch
              id="ec-incluye-manifiesto"
              checked={incluyeManifiesto}
              onCheckedChange={setIncluyeManifiesto}
            />
          </div>
        </div>
        {incluyeManifiesto ? (
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ec-manifiesto" className="text-xs">N.º de manifiesto</Label>
              <Input id="ec-manifiesto" required value={manifiesto} onChange={(e) => setManifiesto(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ec-origen" className="text-xs">Origen de la mercancía</Label>
              <Input id="ec-origen" required value={origen} onChange={(e) => setOrigen(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ec-centro" className="text-xs">Centro de retorno</Label>
              <Input id="ec-centro" required value={centroRetorno} onChange={(e) => setCentroRetorno(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ec-aduana" className="text-xs">Certificación de seguridad aduanera</Label>
              <Input
                id="ec-aduana"
                required
                value={certificacionAduanera}
                onChange={(e) => setCertificacionAduanera(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ec-grado" className="text-xs">Grado de liquidación</Label>
              <Input
                id="ec-grado"
                required
                value={gradoLiquidacion}
                onChange={(e) => setGradoLiquidacion(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ec-peso" className="text-xs">Peso bruto</Label>
              <Input id="ec-peso" required value={pesoBruto} onChange={(e) => setPesoBruto(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="ec-dim" className="text-xs">Dimensiones (L x A x H)</Label>
              <Input id="ec-dim" required value={dimensiones} onChange={(e) => setDimensiones(e.target.value)} />
            </div>
          </div>
        ) : (
          <p className="p-4 text-xs text-muted-foreground">
            Este lote no declara manifiesto ni logística internacional — la ficha técnica pública
            no muestra esta sección.
          </p>
        )}
      </section>

      {tipoVenta === "sorpresa" && (
        <section className="border border-border">
          <div className="border-b border-border bg-primary px-3 py-2">
            <p className="font-mono-technical text-[11px] uppercase tracking-wider text-primary-foreground">
              04 — Imágenes de referencia (artículos)
            </p>
          </div>
          <p className="px-4 pt-3 text-xs text-muted-foreground">
            Fotos reales de artículos similares a los que puede contener esta caja sorpresa —
            se muestran en la grilla de &quot;Artículos sin revelar&quot; de la vista pública.
          </p>
          <MultiStorageUploader
            folder="casa-de-insumos/productos"
            max={6}
            value={imagenesReferencia}
            onChange={setImagenesReferencia}
            className="p-4"
          />
        </section>
      )}

      <p className="text-xs text-muted-foreground">
        El detalle de productos y el rango de contenido sorpresa de esta caja se definen al
        crearla y no se editan desde este formulario en esta fase.
      </p>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
