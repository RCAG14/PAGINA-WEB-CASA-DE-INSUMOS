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
import type { ExtraDesarrolloInput } from "@/lib/data/desarrollo";

const EMPTY_VALUES: ExtraDesarrolloInput = {
  nombre: "",
  motivo: "",
  precio: 0,
  unidad: null,
  precioDesde: false,
  activo: true,
};

export function ExtraFormDialog({
  trigger,
  triggerContent,
  extra,
  onSubmit,
}: {
  trigger: React.ReactElement;
  triggerContent: ReactNode;
  extra?: ExtraDesarrolloInput & { id: string };
  onSubmit: (values: ExtraDesarrolloInput) => void;
}) {
  const [open, setOpen] = useState(false);
  const initial: ExtraDesarrolloInput = extra ?? EMPTY_VALUES;
  const [values, setValues] = useState<ExtraDesarrolloInput>(initial);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) setValues(initial);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ ...values, unidad: values.unidad?.trim() || null });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger}>{triggerContent}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="font-mono-technical text-sm uppercase tracking-wider">
              {extra ? "Editar extra" : "Nuevo extra"}
            </DialogTitle>
            <DialogDescription>
              Se lista debajo de los paquetes en /desarrollo-web con su costo y motivo.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ex-nombre" className="text-xs">
                Nombre
              </Label>
              <Input
                id="ex-nombre"
                required
                placeholder="Sección o página adicional"
                value={values.nombre}
                onChange={(e) => setValues((cur) => ({ ...cur, nombre: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ex-motivo" className="text-xs">
                Motivo del cobro
              </Label>
              <Textarea
                id="ex-motivo"
                rows={3}
                required
                placeholder="Diseño y armado de contenido nuevo."
                value={values.motivo}
                onChange={(e) => setValues((cur) => ({ ...cur, motivo: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ex-precio" className="text-xs">
                  Precio (Bs)
                </Label>
                <Input
                  id="ex-precio"
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
                <Label htmlFor="ex-unidad" className="text-xs">
                  Unidad — opcional
                </Label>
                <Input
                  id="ex-unidad"
                  placeholder="c/u, por hora, por año..."
                  value={values.unidad ?? ""}
                  onChange={(e) => setValues((cur) => ({ ...cur, unidad: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
              <Label htmlFor="ex-desde" className="text-xs">
                Mostrar como &quot;desde&quot; (depende del alcance)
              </Label>
              <Switch
                id="ex-desde"
                checked={values.precioDesde}
                onCheckedChange={(v) => setValues((cur) => ({ ...cur, precioDesde: v }))}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
              <Label htmlFor="ex-activo" className="text-xs">
                Visible en el sitio
              </Label>
              <Switch
                id="ex-activo"
                checked={values.activo}
                onCheckedChange={(v) => setValues((cur) => ({ ...cur, activo: v }))}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit">{extra ? "Guardar cambios" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
