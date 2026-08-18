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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLASSIFICATION_ICON_OPTIONS } from "@/lib/classification-icons";
import { slugify } from "@/lib/utils";
import type { CategoryMeta, ClassificationIcon } from "@/lib/types";

export interface ClassificationFormValues {
  label: string;
  descripcion: string;
  icon: ClassificationIcon;
}

const EMPTY_VALUES: ClassificationFormValues = {
  label: "",
  descripcion: "",
  icon: "mixto",
};

export function ClassificationFormDialog({
  trigger,
  triggerContent,
  classification,
  onSubmit,
}: {
  trigger: React.ReactElement;
  triggerContent: ReactNode;
  classification?: CategoryMeta;
  onSubmit: (values: ClassificationFormValues) => void;
}) {
  const [open, setOpen] = useState(false);
  const initial: ClassificationFormValues = classification
    ? {
        label: classification.label,
        descripcion: classification.descripcion,
        icon: classification.icon,
      }
    : EMPTY_VALUES;
  const [values, setValues] = useState<ClassificationFormValues>(initial);

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
              {classification ? "Editar clasificación" : "Nueva clasificación"}
            </DialogTitle>
            <DialogDescription>
              Las clasificaciones definen el filtro y la etiqueta que ve el cliente en el
              catálogo. Los cambios se guardan en la base de datos.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cf-label" className="text-xs">Nombre de la clasificación</Label>
              <Input
                id="cf-label"
                required
                value={values.label}
                onChange={(e) => setValues((v) => ({ ...v, label: e.target.value }))}
              />
              {!classification && values.label && (
                <span className="font-mono-technical text-[10px] text-muted-foreground">
                  slug: {slugify(values.label)}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Ícono</Label>
              <Select
                value={values.icon}
                onValueChange={(val) =>
                  setValues((v) => ({ ...v, icon: (val ?? v.icon) as ClassificationIcon }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {() =>
                      CLASSIFICATION_ICON_OPTIONS.find((opt) => opt.value === values.icon)?.label
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {CLASSIFICATION_ICON_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cf-desc" className="text-xs">Descripción</Label>
              <Textarea
                id="cf-desc"
                rows={3}
                required
                value={values.descripcion}
                onChange={(e) => setValues((v) => ({ ...v, descripcion: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit">{classification ? "Guardar cambios" : "Crear clasificación"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
