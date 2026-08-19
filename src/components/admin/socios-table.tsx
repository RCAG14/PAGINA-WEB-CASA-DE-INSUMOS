"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Plus, Trash2, UserRound } from "lucide-react";
import {
  alternarActivoSocioAction,
  crearSocioAction,
  eliminarSocioAction,
} from "@/app/admin/configuracion/socios/actions";
import { SocioFormDialog } from "@/components/admin/socio-form-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Usuario } from "@/generated/prisma/client";
import { toast, getErrorMessage } from "@/lib/toast";

export function SociosTable({ socios }: { socios: Usuario[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function refrescar() {
    router.refresh();
  }

  function run(action: () => Promise<unknown>, successMsg: string, errorTitle: string) {
    startTransition(async () => {
      try {
        await action();
        refrescar();
        toast.success(successMsg);
      } catch (err) {
        toast.error({
          title: errorTitle,
          description: getErrorMessage(err, "Intenta nuevamente en unos segundos."),
        });
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
            Cuentas de socio
          </p>
          <p className="text-xs text-muted-foreground">
            Acceso de solo lectura al dashboard de métricas y reportes en PDF.
          </p>
        </div>
        <SocioFormDialog
          trigger={<Button />}
          triggerContent={
            <>
              <Plus className="size-4" /> Crear cuenta de Socio
            </>
          }
          onSubmit={async (values) => {
            await crearSocioAction(values);
            refrescar();
            toast.success("Cuenta de socio creada correctamente.");
          }}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-elevation-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                Socio
              </TableHead>
              <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                Usuario
              </TableHead>
              <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                Creado
              </TableHead>
              <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                Activo
              </TableHead>
              <TableHead className="text-right font-mono-technical text-[10px] uppercase tracking-wider">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {socios.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg border border-border/60 bg-muted">
                      <UserRound className="size-3.5 text-primary" strokeWidth={1.5} />
                    </span>
                    <span className="text-sm font-medium">{s.nombre}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono-technical text-xs text-muted-foreground">
                  {s.username}
                </TableCell>
                <TableCell className="font-mono-technical text-xs text-muted-foreground">
                  {s.creado_en.toISOString().slice(0, 10)}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={s.activo}
                    onCheckedChange={(v) =>
                      run(
                        () => alternarActivoSocioAction(s.id, v),
                        v ? "Socio activado." : "Socio desactivado.",
                        "No se pudo cambiar el estado del socio"
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Eliminar socio"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        run(
                          () => eliminarSocioAction(s.id),
                          `"${s.nombre}" se eliminó correctamente.`,
                          "No se pudo eliminar el socio"
                        )
                      }
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {socios.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  No hay cuentas de socio todavía.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
