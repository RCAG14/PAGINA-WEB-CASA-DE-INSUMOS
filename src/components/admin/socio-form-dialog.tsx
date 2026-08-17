"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";
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
import type { CrearSocioInput } from "@/lib/data/usuarios";

function generarPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

const EMPTY_VALUES: CrearSocioInput = { nombre: "", username: "", password: "" };

export function SocioFormDialog({
  trigger,
  triggerContent,
  onSubmit,
}: {
  trigger: React.ReactElement;
  triggerContent: ReactNode;
  onSubmit: (values: CrearSocioInput) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<CrearSocioInput>(EMPTY_VALUES);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setValues({ ...EMPTY_VALUES, password: generarPassword() });
      setError(null);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await onSubmit(values);
      setOpen(false);
    } catch {
      setError("No se pudo crear la cuenta. Verifica que el usuario no exista ya.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger}>{triggerContent}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="font-mono-technical text-sm uppercase tracking-wider">
              Crear cuenta de Socio
            </DialogTitle>
            <DialogDescription>
              Acceso de solo lectura al dashboard de métricas. No puede crear, editar ni eliminar
              nada.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="socio-nombre" className="text-xs">
                Nombre del socio
              </Label>
              <Input
                id="socio-nombre"
                required
                value={values.nombre}
                onChange={(e) => setValues((cur) => ({ ...cur, nombre: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="socio-username" className="text-xs">
                Usuario
              </Label>
              <Input
                id="socio-username"
                required
                className="font-mono-technical"
                value={values.username}
                onChange={(e) => setValues((cur) => ({ ...cur, username: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="socio-password" className="text-xs">
                Contraseña temporal
              </Label>
              <div className="flex gap-1.5">
                <Input
                  id="socio-password"
                  required
                  className="font-mono-technical"
                  value={values.password}
                  onChange={(e) => setValues((cur) => ({ ...cur, password: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label="Generar otra contraseña"
                  onClick={() => setValues((cur) => ({ ...cur, password: generarPassword() }))}
                >
                  <RefreshCw className="size-3.5" />
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Compártela por un canal seguro. El socio puede usarla para iniciar sesión en{" "}
                <span className="font-mono-technical">/admin/login</span>.
              </p>
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Creando..." : "Crear cuenta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
