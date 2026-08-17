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
import { Switch } from "@/components/ui/switch";
import type { NumeroContactoInput } from "@/lib/data/contacto";

const EMPTY_VALUES: NumeroContactoInput = { etiqueta: "", numero: "", activo: true };

export function NumeroContactoFormDialog({
  trigger,
  triggerContent,
  numeroContacto,
  onSubmit,
}: {
  trigger: React.ReactElement;
  triggerContent: ReactNode;
  numeroContacto?: NumeroContactoInput & { id: string };
  onSubmit: (values: NumeroContactoInput) => void;
}) {
  const [open, setOpen] = useState(false);
  const initial: NumeroContactoInput = numeroContacto ?? EMPTY_VALUES;
  const [values, setValues] = useState<NumeroContactoInput>(initial);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) setValues(initial);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger}>{triggerContent}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="font-mono-technical text-sm uppercase tracking-wider">
              {numeroContacto ? "Editar número" : "Nuevo número de contacto"}
            </DialogTitle>
            <DialogDescription>
              El primer número activo (por orden) es el que se usa para redirigir al cliente
              desde el checkout hacia WhatsApp.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nc-etiqueta" className="text-xs">Etiqueta</Label>
              <Input
                id="nc-etiqueta"
                required
                placeholder="WhatsApp Ventas"
                value={values.etiqueta}
                onChange={(e) => setValues((cur) => ({ ...cur, etiqueta: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nc-numero" className="text-xs">
                Número (formato internacional, solo dígitos)
              </Label>
              <Input
                id="nc-numero"
                required
                placeholder="59170000000"
                className="font-mono-technical"
                value={values.numero}
                onChange={(e) =>
                  setValues((cur) => ({ ...cur, numero: e.target.value.replace(/[^0-9]/g, "") }))
                }
              />
            </div>

            <div className="flex items-center justify-between border border-border px-3 py-2">
              <Label htmlFor="nc-activo" className="text-xs">Activo</Label>
              <Switch
                id="nc-activo"
                checked={values.activo}
                onCheckedChange={(v) => setValues((cur) => ({ ...cur, activo: v }))}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit">{numeroContacto ? "Guardar cambios" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
