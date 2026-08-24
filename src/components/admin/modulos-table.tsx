"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Boxes } from "lucide-react";
import { alternarModuloAction } from "@/app/admin/configuracion/modulos/actions";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ModuloClave } from "@/lib/data/modulos";
import { toast, getErrorMessage } from "@/lib/toast";

interface ModuloRow {
  clave: ModuloClave;
  titulo: string;
  descripcion: string;
  href: string | null;
  activo: boolean;
}

export function ModulosTable({ modulos }: { modulos: ModuloRow[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function handleToggle(clave: ModuloClave, activo: boolean, titulo: string) {
    startTransition(async () => {
      try {
        await alternarModuloAction(clave, activo);
        router.refresh();
        toast.success(activo ? `"${titulo}" activado.` : `"${titulo}" desactivado.`);
      } catch (err) {
        toast.error({
          title: "No se pudo cambiar el estado del módulo",
          description: getErrorMessage(err, "Intenta nuevamente en unos segundos."),
        });
      }
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-elevation-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
              Módulo
            </TableHead>
            <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
              Descripción
            </TableHead>
            <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
              Activo
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modulos.map((mod) => (
            <TableRow key={mod.clave}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg border border-border/60 bg-muted">
                    <Boxes className="size-3.5 text-primary" strokeWidth={1.5} />
                  </span>
                  <span className="text-sm font-medium">{mod.titulo}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-md text-xs text-muted-foreground">
                {mod.descripcion}
              </TableCell>
              <TableCell>
                <Switch
                  checked={mod.activo}
                  onCheckedChange={(v) => handleToggle(mod.clave, v, mod.titulo)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
