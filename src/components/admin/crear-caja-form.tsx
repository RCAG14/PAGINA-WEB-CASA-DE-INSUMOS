"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition, type FormEvent } from "react";
import { Plus, ShieldCheck, Sparkles, Trash2 } from "lucide-react";
import { crearCajaAction } from "@/app/admin/cajas/inventario/actions";
import { StorageUploader, type StorageAsset } from "@/components/admin/storage-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { formatPrice } from "@/lib/format";
import type { CategoryMeta } from "@/lib/types";
import type { DetalleCajaInput } from "@/lib/data/cajas";

const EMPTY_ROW: DetalleCajaInput = {
  nombre: "",
  precioReferencial: 0,
  cantidad: 1,
  condicion: "Como nuevo",
  costoAsignado: 0,
  precioVentaSugerido: 0,
};

export function CrearCajaForm({ classifications }: { classifications: CategoryMeta[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [nombre, setNombre] = useState("");
  const [skuLote, setSkuLote] = useState("");
  const [clasificacionId, setClasificacionId] = useState(classifications[0]?.id ?? "");
  const [tipoVenta, setTipoVenta] = useState<"listada" | "sorpresa">("listada");
  const [descripcionCorta, setDescripcionCorta] = useState("");
  const [descripcionTecnica, setDescripcionTecnica] = useState("");
  const [costoTotal, setCostoTotal] = useState(0);
  const [precioVentaCaja, setPrecioVentaCaja] = useState(0);
  const [stockDisponible, setStockDisponible] = useState(0);

  const [manifiesto, setManifiesto] = useState("");
  const [origen, setOrigen] = useState("");
  const [centroRetorno, setCentroRetorno] = useState("");
  const [certificacionAduanera, setCertificacionAduanera] = useState("");
  const [gradoLiquidacion, setGradoLiquidacion] = useState("");
  const [pesoBruto, setPesoBruto] = useState("");
  const [dimensiones, setDimensiones] = useState("");

  const [imagen, setImagen] = useState<StorageAsset | null>(null);

  const [detalle, setDetalle] = useState<DetalleCajaInput[]>([{ ...EMPTY_ROW }]);

  const [cantidadMin, setCantidadMin] = useState(1);
  const [valorMin, setValorMin] = useState(0);
  const [cantidadMax, setCantidadMax] = useState(1);
  const [valorMax, setValorMax] = useState(0);

  const costoAsignadoTotal = useMemo(
    () => detalle.reduce((acc, d) => acc + (Number(d.costoAsignado) || 0), 0),
    [detalle]
  );
  const diferencia = costoTotal - costoAsignadoTotal;

  function updateRow(index: number, patch: Partial<DetalleCajaInput>) {
    setDetalle((rows) => rows.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setDetalle((rows) => [...rows, { ...EMPTY_ROW }]);
  }

  function removeRow(index: number) {
    setDetalle((rows) => rows.filter((_, i) => i !== index));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!clasificacionId) {
      setError("Selecciona una clasificación.");
      return;
    }

    if (tipoVenta === "listada" && detalle.length === 0) {
      setError("Agrega al menos un producto al detalle de la caja.");
      return;
    }

    if (tipoVenta === "sorpresa" && valorMax < valorMin) {
      setError("El valor máximo no puede ser menor que el valor mínimo garantizado.");
      return;
    }

    startTransition(async () => {
      try {
        await crearCajaAction({
          nombre,
          skuLote,
          clasificacionId,
          tipoVenta,
          descripcionCorta,
          descripcionTecnica,
          manifiesto,
          origen,
          centroRetorno,
          certificacionAduanera,
          gradoLiquidacion,
          pesoBruto,
          dimensiones,
          costoTotal,
          precioVentaCaja,
          stockDisponible,
          detalle: tipoVenta === "listada" ? detalle : [],
          rangoSorpresa:
            tipoVenta === "sorpresa"
              ? { cantidadMin, cantidadMax, valorMin, valorMax }
              : undefined,
          imagenUrl: imagen?.url ?? null,
          imagenPath: imagen?.path ?? null,
        });
        router.push("/admin/cajas/inventario");
        router.refresh();
        toast.success(`"${nombre}" se creó correctamente.`);
      } catch (err) {
        const message = getErrorMessage(err, "Verifica la conexión a la base de datos.");
        setError(message);
        toast.error({ title: "No se pudo crear la caja", description: message });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {error && (
        <Alert className="border-destructive/50 bg-destructive/10">
          <AlertTitle className="font-mono-technical text-xs uppercase tracking-wider text-destructive">
            No se pudo crear la caja
          </AlertTitle>
          <AlertDescription className="text-xs text-destructive">{error}</AlertDescription>
        </Alert>
      )}

      <section className="overflow-hidden rounded-xl border border-border/60 shadow-elevation-sm">
        <div className="border-b border-border bg-sidebar px-3 py-2">
          <p className="font-mono-technical text-[11px] uppercase tracking-wider text-sidebar-foreground">
            01 — Definición de la caja
          </p>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="cc-nombre" className="text-xs">Nombre de la caja</Label>
            <Input id="cc-nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
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
            <Label htmlFor="cc-sku" className="text-xs">SKU de lote</Label>
            <Input
              id="cc-sku"
              required
              placeholder="CDI-SP-001"
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
            <Label htmlFor="cc-costo" className="text-xs">Costo total de la caja (Bs)</Label>
            <Input
              id="cc-costo"
              type="number"
              min={0}
              step="0.01"
              required
              value={costoTotal}
              onChange={(e) => setCostoTotal(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cc-precio" className="text-xs">Precio de venta de la caja (Bs)</Label>
            <Input
              id="cc-precio"
              type="number"
              min={0}
              step="0.01"
              required
              value={precioVentaCaja}
              onChange={(e) => setPrecioVentaCaja(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cc-stock" className="text-xs">Stock disponible</Label>
            <Input
              id="cc-stock"
              type="number"
              min={0}
              required
              value={stockDisponible}
              onChange={(e) => setStockDisponible(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="cc-desc-corta" className="text-xs">Descripción corta</Label>
            <Textarea
              id="cc-desc-corta"
              rows={2}
              required
              value={descripcionCorta}
              onChange={(e) => setDescripcionCorta(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="cc-desc-tecnica" className="text-xs">Descripción técnica</Label>
            <Textarea
              id="cc-desc-tecnica"
              rows={3}
              required
              value={descripcionTecnica}
              onChange={(e) => setDescripcionTecnica(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border/60 shadow-elevation-sm">
        <div className="border-b border-border bg-sidebar px-3 py-2">
          <p className="font-mono-technical text-[11px] uppercase tracking-wider text-sidebar-foreground">
            02 — Manifiesto y logística internacional
          </p>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cc-manifiesto" className="text-xs">N.º de manifiesto</Label>
            <Input id="cc-manifiesto" required value={manifiesto} onChange={(e) => setManifiesto(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cc-origen" className="text-xs">Origen de la mercancía</Label>
            <Input id="cc-origen" required value={origen} onChange={(e) => setOrigen(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cc-centro" className="text-xs">Centro de retorno</Label>
            <Input id="cc-centro" required value={centroRetorno} onChange={(e) => setCentroRetorno(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cc-aduana" className="text-xs">Certificación de seguridad aduanera</Label>
            <Input
              id="cc-aduana"
              required
              value={certificacionAduanera}
              onChange={(e) => setCertificacionAduanera(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cc-grado" className="text-xs">Grado de liquidación</Label>
            <Input
              id="cc-grado"
              required
              value={gradoLiquidacion}
              onChange={(e) => setGradoLiquidacion(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cc-peso" className="text-xs">Peso bruto</Label>
            <Input id="cc-peso" required value={pesoBruto} onChange={(e) => setPesoBruto(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="cc-dim" className="text-xs">Dimensiones (L x A x H)</Label>
            <Input id="cc-dim" required value={dimensiones} onChange={(e) => setDimensiones(e.target.value)} />
          </div>
        </div>
      </section>

      {tipoVenta === "listada" ? (
        <section className="overflow-hidden rounded-xl border border-border/60 shadow-elevation-sm">
          <div className="flex items-center justify-between border-b border-border bg-sidebar px-3 py-2">
            <p className="font-mono-technical text-[11px] uppercase tracking-wider text-sidebar-foreground">
              03 — Detalle de productos (distribución del costo)
            </p>
            <Button type="button" size="sm" variant="secondary" onClick={addRow}>
              <Plus className="size-3.5" /> Agregar producto
            </Button>
          </div>

          <div className="flex flex-col divide-y divide-border">
            {detalle.map((row, i) => (
              <div key={i} className="grid gap-3 p-4 sm:grid-cols-6">
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <Label className="text-[10px] text-muted-foreground">Producto</Label>
                  <Input
                    required
                    value={row.nombre}
                    onChange={(e) => updateRow(i, { nombre: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] text-muted-foreground">Condición</Label>
                  <Input
                    required
                    value={row.condicion}
                    onChange={(e) => updateRow(i, { condicion: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] text-muted-foreground">Cantidad</Label>
                  <Input
                    type="number"
                    min={1}
                    required
                    value={row.cantidad}
                    onChange={(e) => updateRow(i, { cantidad: Number(e.target.value) })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] text-muted-foreground">Costo asignado (Bs)</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    required
                    value={row.costoAsignado}
                    onChange={(e) => updateRow(i, { costoAsignado: Number(e.target.value) })}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex flex-1 flex-col gap-1">
                    <Label className="text-[10px] text-muted-foreground">Precio sugerido (Bs)</Label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      required
                      value={row.precioVentaSugerido}
                      onChange={(e) => updateRow(i, { precioVentaSugerido: Number(e.target.value) })}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Quitar producto"
                    disabled={detalle.length <= 1}
                    onClick={() => removeRow(i)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`flex items-center justify-between border-t border-border px-4 py-3 font-mono-technical text-xs ${
              diferencia === 0 ? "text-primary" : "text-destructive"
            }`}
          >
            <span>
              Costo asignado: {formatPrice(costoAsignadoTotal)} / Costo total: {formatPrice(costoTotal)}
            </span>
            <span className="font-semibold">
              {diferencia === 0
                ? "Costo totalmente distribuido"
                : `Diferencia sin asignar: ${formatPrice(diferencia)}`}
            </span>
          </div>
        </section>
      ) : (
        <section className="overflow-hidden rounded-xl border border-border/60 shadow-elevation-sm">
          <div className="border-b border-border bg-sidebar px-3 py-2">
            <p className="font-mono-technical text-[11px] uppercase tracking-wider text-sidebar-foreground">
              03 — Rango de contenido sorpresa
            </p>
          </div>
          <p className="px-4 pt-3 text-xs text-muted-foreground">
            El contenido exacto no se define fila por fila. Declara el rango de artículos y valor
            posible para que el cliente sepa qué esperar en el peor y mejor caso.
          </p>
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-lg border-2 border-accent bg-accent/10 p-4">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" />
                <span className="font-mono-technical text-[10px] font-bold uppercase tracking-wider text-primary">
                  Mínimo garantizado
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] text-muted-foreground">Cantidad mínima de artículos</Label>
                <Input
                  type="number"
                  min={1}
                  required
                  value={cantidadMin}
                  onChange={(e) => setCantidadMin(Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] text-muted-foreground">Valor mínimo garantizado (Bs)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  required
                  value={valorMin}
                  onChange={(e) => setValorMin(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-4">
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-4 text-muted-foreground" />
                <span className="font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground">
                  Máximo potencial
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] text-muted-foreground">Cantidad máxima de artículos</Label>
                <Input
                  type="number"
                  min={1}
                  required
                  value={cantidadMax}
                  onChange={(e) => setCantidadMax(Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] text-muted-foreground">Valor máximo potencial (Bs)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  required
                  value={valorMax}
                  onChange={(e) => setValorMax(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="flex justify-end gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Creando caja..." : "Crear caja"}
        </Button>
      </div>
    </form>
  );
}
