"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { SearchCheck } from "lucide-react";
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
import { StorageUploader, type StorageAsset } from "@/components/admin/storage-uploader";
import { ProductPickerDialog } from "@/components/admin/product-picker-dialog";
import type { FormatoMedia } from "@/lib/data/landing";
import type { Box, CategoryMeta } from "@/lib/types";

export interface ContenidoLandingFormValues {
  url: string;
  storagePath: string;
  titulo: string;
  subtitulo: string;
  enlaceCta: string;
  textoCta: string;
  activo: boolean;
}

const EMPTY_VALUES: ContenidoLandingFormValues = {
  url: "",
  storagePath: "",
  titulo: "",
  subtitulo: "",
  enlaceCta: "",
  textoCta: "",
  activo: true,
};

export function LandingMediaFormDialog({
  trigger,
  triggerContent,
  dialogTitle,
  dialogDescription,
  formato,
  folder,
  withCta = false,
  boxes,
  classifications,
  item,
  onSubmit,
}: {
  trigger: React.ReactElement;
  triggerContent: ReactNode;
  dialogTitle: string;
  dialogDescription: string;
  formato: FormatoMedia;
  folder: string;
  withCta?: boolean;
  /** Productos disponibles para el selector "Elegir producto" (solo si withCta). */
  boxes?: Box[];
  classifications?: CategoryMeta[];
  item?: ContenidoLandingFormValues;
  onSubmit: (values: ContenidoLandingFormValues) => void;
}) {
  const [open, setOpen] = useState(false);
  const initial = item ?? EMPTY_VALUES;
  const [values, setValues] = useState<ContenidoLandingFormValues>(initial);
  const [error, setError] = useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setValues(initial);
      setError(null);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values.url || !values.storagePath) {
      setError("Sube un archivo antes de guardar.");
      return;
    }
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
              {dialogTitle}
            </DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <StorageUploader
              resourceType={formato === "video" ? "video" : "image"}
              folder={folder}
              value={
                values.url && values.storagePath
                  ? { url: values.url, path: values.storagePath }
                  : null
              }
              onChange={(asset: StorageAsset | null) =>
                setValues((cur) => ({
                  ...cur,
                  url: asset?.url ?? "",
                  storagePath: asset?.path ?? "",
                }))
              }
            />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cl-titulo" className="text-xs">
                Título (opcional)
              </Label>
              <Input
                id="cl-titulo"
                value={values.titulo}
                onChange={(e) => setValues((cur) => ({ ...cur, titulo: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cl-subtitulo" className="text-xs">
                Subtítulo (opcional)
              </Label>
              <Input
                id="cl-subtitulo"
                value={values.subtitulo}
                onChange={(e) => setValues((cur) => ({ ...cur, subtitulo: e.target.value }))}
              />
            </div>

            {withCta && (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="cl-texto-cta" className="text-xs">
                    Texto del botón
                  </Label>
                  <Input
                    id="cl-texto-cta"
                    placeholder="Ver oferta"
                    value={values.textoCta}
                    onChange={(e) => setValues((cur) => ({ ...cur, textoCta: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="cl-enlace-cta" className="text-xs">
                    Enlace del botón
                  </Label>
                  <div className="flex gap-1.5">
                    <Input
                      id="cl-enlace-cta"
                      placeholder="/catalogo"
                      value={values.enlaceCta}
                      onChange={(e) =>
                        setValues((cur) => ({ ...cur, enlaceCta: e.target.value }))
                      }
                    />
                    {boxes && classifications && (
                      <ProductPickerDialog
                        boxes={boxes}
                        classifications={classifications}
                        trigger={<Button type="button" variant="outline" size="icon-sm" />}
                        triggerContent={<SearchCheck className="size-3.5" />}
                        onSelect={(box) =>
                          setValues((cur) => ({
                            ...cur,
                            enlaceCta: `/productos/${box.slug}`,
                            textoCta: cur.textoCta || "Ver producto",
                          }))
                        }
                      />
                    )}
                  </div>
                  {boxes && (
                    <p className="text-[11px] text-muted-foreground">
                      Escribe un enlace manual o usa{" "}
                      <SearchCheck className="inline size-3 align-[-1px]" /> para elegir un
                      producto del catálogo.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
              <Label htmlFor="cl-activo" className="text-xs">
                Visible en el sitio
              </Label>
              <Switch
                id="cl-activo"
                checked={values.activo}
                onCheckedChange={(v) => setValues((cur) => ({ ...cur, activo: v }))}
              />
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Cancelar</DialogClose>
            <Button type="submit">{item ? "Guardar cambios" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
