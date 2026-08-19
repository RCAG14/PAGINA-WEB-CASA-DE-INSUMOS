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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RedSocialInput } from "@/lib/data/contacto";
import { PLATAFORMAS_REDES_SOCIALES } from "@/lib/redes-sociales";

const EMPTY_VALUES: RedSocialInput = { plataforma: "instagram", url: "", activo: true };

export function RedSocialFormDialog({
  trigger,
  triggerContent,
  redSocial,
  onSubmit,
}: {
  trigger: React.ReactElement;
  triggerContent: ReactNode;
  redSocial?: RedSocialInput & { id: string };
  onSubmit: (values: RedSocialInput) => void;
}) {
  const [open, setOpen] = useState(false);
  const initial: RedSocialInput = redSocial ?? EMPTY_VALUES;
  const [values, setValues] = useState<RedSocialInput>(initial);
  const esCorreo = values.plataforma === "email";

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
              {redSocial ? "Editar red social" : "Nueva red social"}
            </DialogTitle>
            <DialogDescription>
              Aparece como ícono enlazado en el pie de página del sitio público.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Plataforma</Label>
              <Select
                value={values.plataforma}
                onValueChange={(v) => setValues((cur) => ({ ...cur, plataforma: v ?? cur.plataforma }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {() => PLATAFORMAS_REDES_SOCIALES.find((p) => p.value === values.plataforma)?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PLATAFORMAS_REDES_SOCIALES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rs-url" className="text-xs">
                {esCorreo ? "Correo electrónico" : "Enlace (URL completa)"}
              </Label>
              <Input
                id="rs-url"
                type={esCorreo ? "email" : "url"}
                required
                placeholder={esCorreo ? "contacto@casainsumos.com" : "https://instagram.com/tu_usuario"}
                value={values.url}
                onChange={(e) => setValues((cur) => ({ ...cur, url: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between border border-border px-3 py-2">
              <Label htmlFor="rs-activo" className="text-xs">Visible en el sitio</Label>
              <Switch
                id="rs-activo"
                checked={values.activo}
                onCheckedChange={(v) => setValues((cur) => ({ ...cur, activo: v }))}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit">{redSocial ? "Guardar cambios" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
