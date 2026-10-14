"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { TraduccionIngles } from "@/components/admin/traduccion-ingles";
import { formatUsd } from "@/lib/format";
import type { DesgloseItem, PaqueteDesarrolloInput } from "@/lib/data/desarrollo";

// El desglose se edita como texto, una línea por concepto: "Concepto | monto | motivo".
// Su traducción va aparte, en el mismo orden: "Concept | reason".
function desgloseToText(items: DesgloseItem[]) {
  return items.map((d) => `${d.concepto} | ${d.monto} | ${d.motivo}`).join("\n");
}

function desgloseEnToText(items: DesgloseItem[]) {
  if (items.every((d) => !d.conceptoEn && !d.motivoEn)) return "";
  return items.map((d) => `${d.conceptoEn ?? ""} | ${d.motivoEn ?? ""}`).join("\n");
}

function lineas(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseDesgloseText(text: string, textEn: string): DesgloseItem[] {
  const traducciones = lineas(textEn).map((line) => {
    const [concepto = "", ...motivo] = line.split("|").map((p) => p.trim());
    return { conceptoEn: concepto || null, motivoEn: motivo.join(" | ") || null };
  });
  return lineas(text)
    .map((line) => {
      const [concepto = "", monto = "", ...motivo] = line.split("|").map((p) => p.trim());
      return { concepto, monto: Number(monto.replace(",", ".")) || 0, motivo: motivo.join(" | ") };
    })
    .filter((d) => d.concepto)
    .map((d, i) => ({ ...d, ...(traducciones[i] ?? { conceptoEn: null, motivoEn: null }) }));
}

const EMPTY_VALUES: PaqueteDesarrolloInput = {
  nombre: "",
  nombreEn: null,
  tagline: "",
  taglineEn: null,
  precio: 0,
  mantenimientoMensual: null,
  features: [],
  featuresEn: [],
  desglose: [],
  destacado: false,
  activo: true,
};

export function PaqueteFormDialog({
  trigger,
  triggerContent,
  paquete,
  onSubmit,
}: {
  trigger: React.ReactElement;
  triggerContent: ReactNode;
  paquete?: PaqueteDesarrolloInput & { id: string };
  onSubmit: (values: PaqueteDesarrolloInput) => void;
}) {
  const [open, setOpen] = useState(false);
  const initial: PaqueteDesarrolloInput = paquete ?? EMPTY_VALUES;
  const [values, setValues] = useState<PaqueteDesarrolloInput>(initial);
  const [featuresText, setFeaturesText] = useState(initial.features.join("\n"));
  const [featuresEnText, setFeaturesEnText] = useState(initial.featuresEn.join("\n"));
  const [desgloseText, setDesgloseText] = useState(desgloseToText(initial.desglose));
  const [desgloseEnText, setDesgloseEnText] = useState(desgloseEnToText(initial.desglose));
  const desglose = parseDesgloseText(desgloseText, desgloseEnText);
  const sumaDesglose = desglose.reduce((acc, d) => acc + d.monto, 0);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setValues(initial);
      setFeaturesText(initial.features.join("\n"));
      setFeaturesEnText(initial.featuresEn.join("\n"));
      setDesgloseText(desgloseToText(initial.desglose));
      setDesgloseEnText(desgloseEnToText(initial.desglose));
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      ...values,
      features: lineas(featuresText),
      featuresEn: lineas(featuresEnText),
      desglose,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger}>{triggerContent}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="font-mono-technical text-sm uppercase tracking-wider">
              {paquete ? "Editar paquete" : "Nuevo paquete"}
            </DialogTitle>
            <DialogDescription>
              Se muestra en /desarrollo-web. Los montos van en dólares (USD); el visitante
              puede verlos en bolivianos con el tipo de cambio configurado.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pd-nombre" className="text-xs">
                Nombre
              </Label>
              <Input
                id="pd-nombre"
                required
                placeholder="Básico"
                value={values.nombre}
                onChange={(e) => setValues((cur) => ({ ...cur, nombre: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pd-tagline" className="text-xs">
                Tagline
              </Label>
              <Input
                id="pd-tagline"
                required
                placeholder="Presencia digital simple y profesional."
                value={values.tagline}
                onChange={(e) => setValues((cur) => ({ ...cur, tagline: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pd-precio" className="text-xs">
                Precio (US$)
              </Label>
              <Input
                id="pd-precio"
                type="number"
                min={0}
                step="0.01"
                required
                value={values.precio}
                onChange={(e) =>
                  setValues((cur) => ({ ...cur, precio: Number(e.target.value) }))
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pd-mantenimiento" className="text-xs">
                Mantenimiento mensual (US$) — opcional
              </Label>
              <Input
                id="pd-mantenimiento"
                type="number"
                min={0}
                step="0.01"
                placeholder="Dejar vacío si no aplica"
                value={values.mantenimientoMensual ?? ""}
                onChange={(e) =>
                  setValues((cur) => ({
                    ...cur,
                    mantenimientoMensual: e.target.value === "" ? null : Number(e.target.value),
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Solo se muestra en el modal de detalles del paquete, no en la tarjeta.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pd-features" className="text-xs">
                Features (una por línea)
              </Label>
              <Textarea
                id="pd-features"
                rows={6}
                required
                placeholder={"Sitio web de hasta 5 páginas\nDiseño responsive\n..."}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pd-desglose" className="text-xs">
                Desglose del precio (US$) — una línea por concepto: Concepto | monto | motivo
              </Label>
              <Textarea
                id="pd-desglose"
                rows={5}
                placeholder={
                  "Diseño y desarrollo | 45 | Horas de diseño, maquetado y pruebas\nDominio .com (1er año) | 17 | Registro anual del nombre de tu web"
                }
                value={desgloseText}
                onChange={(e) => setDesgloseText(e.target.value)}
              />
              {desglose.length > 0 && (
                <p
                  className={
                    sumaDesglose === values.precio
                      ? "text-xs text-muted-foreground"
                      : "text-xs text-destructive"
                  }
                >
                  Suma del desglose: {formatUsd(sumaDesglose)}
                  {sumaDesglose !== values.precio &&
                    ` — no coincide con el precio (${formatUsd(values.precio)})`}
                </p>
              )}
            </div>

            <TraduccionIngles>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pd-nombre-en" className="text-xs">
                  Name
                </Label>
                <Input
                  id="pd-nombre-en"
                  placeholder="Basic"
                  value={values.nombreEn ?? ""}
                  onChange={(e) => setValues((cur) => ({ ...cur, nombreEn: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pd-tagline-en" className="text-xs">
                  Tagline
                </Label>
                <Input
                  id="pd-tagline-en"
                  placeholder="A simple, professional online presence."
                  value={values.taglineEn ?? ""}
                  onChange={(e) => setValues((cur) => ({ ...cur, taglineEn: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pd-features-en" className="text-xs">
                  Features (one per line)
                </Label>
                <Textarea
                  id="pd-features-en"
                  rows={5}
                  value={featuresEnText}
                  onChange={(e) => setFeaturesEnText(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pd-desglose-en" className="text-xs">
                  Desglose — mismas líneas y orden que en español: Concept | reason
                </Label>
                <Textarea
                  id="pd-desglose-en"
                  rows={4}
                  placeholder={"Design and development | Design, layout and testing hours"}
                  value={desgloseEnText}
                  onChange={(e) => setDesgloseEnText(e.target.value)}
                />
              </div>
            </TraduccionIngles>

            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
              <Label htmlFor="pd-destacado" className="text-xs">
                Destacar como recomendado
              </Label>
              <Switch
                id="pd-destacado"
                checked={values.destacado}
                onCheckedChange={(v) => setValues((cur) => ({ ...cur, destacado: v }))}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
              <Label htmlFor="pd-activo" className="text-xs">
                Visible en el sitio
              </Label>
              <Switch
                id="pd-activo"
                checked={values.activo}
                onCheckedChange={(v) => setValues((cur) => ({ ...cur, activo: v }))}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit">{paquete ? "Guardar cambios" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
