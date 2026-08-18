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
import type { PaqueteDesarrolloInput } from "@/lib/data/desarrollo";

const EMPTY_VALUES: PaqueteDesarrolloInput = {
  nombre: "",
  tagline: "",
  precio: 0,
  features: [],
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

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setValues(initial);
      setFeaturesText(initial.features.join("\n"));
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const features = featuresText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    onSubmit({ ...values, features });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger}>{triggerContent}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="font-mono-technical text-sm uppercase tracking-wider">
              {paquete ? "Editar paquete" : "Nuevo paquete"}
            </DialogTitle>
            <DialogDescription>
              Se muestra en /desarrollo-web. El botón de cotizar arma el mensaje de WhatsApp con
              el nombre del paquete.
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
                Precio (Bs)
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

            <div className="flex items-center justify-between border border-border px-3 py-2">
              <Label htmlFor="pd-destacado" className="text-xs">
                Destacar como recomendado
              </Label>
              <Switch
                id="pd-destacado"
                checked={values.destacado}
                onCheckedChange={(v) => setValues((cur) => ({ ...cur, destacado: v }))}
              />
            </div>

            <div className="flex items-center justify-between border border-border px-3 py-2">
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
