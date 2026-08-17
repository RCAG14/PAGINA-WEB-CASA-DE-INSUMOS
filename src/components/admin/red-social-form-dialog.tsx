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

const PLATAFORMAS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "x", label: "X / Twitter" },
  { value: "otro", label: "Otro" },
];

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
                    {() => PLATAFORMAS.find((p) => p.value === values.plataforma)?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PLATAFORMAS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rs-url" className="text-xs">Enlace (URL completa)</Label>
              <Input
                id="rs-url"
                type="url"
                required
                placeholder="https://instagram.com/tu_usuario"
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
