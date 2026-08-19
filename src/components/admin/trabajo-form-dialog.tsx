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
import { StorageUploader, type StorageAsset } from "@/components/admin/storage-uploader";
import type { TrabajoRealizadoInput } from "@/lib/data/desarrollo";

const FOLDER = "casa-de-insumos/desarrollo-web/trabajos";

const EMPTY_VALUES: TrabajoRealizadoInput = {
  titulo: "",
  categoria: "",
  descripcion: "",
  imagenUrl: null,
  imagenPath: null,
  enlace: null,
  activo: true,
};

export function TrabajoFormDialog({
  trigger,
  triggerContent,
  trabajo,
  onSubmit,
}: {
  trigger: React.ReactElement;
  triggerContent: ReactNode;
  trabajo?: TrabajoRealizadoInput & { id: string };
  onSubmit: (values: TrabajoRealizadoInput) => void;
}) {
  const [open, setOpen] = useState(false);
  const initial: TrabajoRealizadoInput = trabajo ?? EMPTY_VALUES;
  const [values, setValues] = useState<TrabajoRealizadoInput>(initial);

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
              {trabajo ? "Editar trabajo" : "Nuevo trabajo"}
            </DialogTitle>
            <DialogDescription>
              Se muestra en la sección &quot;Trabajos realizados&quot; de /desarrollo-web. La imagen es
              opcional.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <StorageUploader
              resourceType="image"
              folder={FOLDER}
              value={
                values.imagenUrl && values.imagenPath
                  ? { url: values.imagenUrl, path: values.imagenPath }
                  : null
              }
              onChange={(asset: StorageAsset | null) =>
                setValues((cur) => ({
                  ...cur,
                  imagenUrl: asset?.url ?? null,
                  imagenPath: asset?.path ?? null,
                }))
              }
            />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tr-titulo" className="text-xs">
                Título
              </Label>
              <Input
                id="tr-titulo"
                required
                placeholder="Página web para restaurante"
                value={values.titulo}
                onChange={(e) => setValues((cur) => ({ ...cur, titulo: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tr-categoria" className="text-xs">
                Categoría / rubro
              </Label>
              <Input
                id="tr-categoria"
                required
                placeholder="Restaurante"
                value={values.categoria}
                onChange={(e) => setValues((cur) => ({ ...cur, categoria: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tr-descripcion" className="text-xs">
                Descripción
              </Label>
              <Textarea
                id="tr-descripcion"
                required
                rows={3}
                value={values.descripcion}
                onChange={(e) => setValues((cur) => ({ ...cur, descripcion: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tr-enlace" className="text-xs">
                Enlace (opcional)
              </Label>
              <Input
                id="tr-enlace"
                type="url"
                placeholder="https://..."
                value={values.enlace ?? ""}
                onChange={(e) =>
                  setValues((cur) => ({ ...cur, enlace: e.target.value || null }))
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
              <Label htmlFor="tr-activo" className="text-xs">
                Visible en el sitio
              </Label>
              <Switch
                id="tr-activo"
                checked={values.activo}
                onCheckedChange={(v) => setValues((cur) => ({ ...cur, activo: v }))}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit">{trabajo ? "Guardar cambios" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
