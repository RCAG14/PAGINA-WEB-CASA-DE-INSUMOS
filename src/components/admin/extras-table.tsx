"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import {
  actualizarExtraDesarrolloAction,
  crearExtraDesarrolloAction,
  eliminarExtraDesarrolloAction,
  reordenarExtraDesarrolloAction,
} from "@/app/admin/desarrollo-web/actions";
import { ExtraFormDialog } from "@/components/admin/extra-form-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/format";
import { toast, getErrorMessage } from "@/lib/toast";
import type { getExtrasDesarrolloAdmin } from "@/lib/data/desarrollo";

type ExtraDesarrolloRow = Awaited<ReturnType<typeof getExtrasDesarrolloAdmin>>[number];

export function ExtrasTable({ extras }: { extras: ExtraDesarrolloRow[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function run(action: () => Promise<unknown>, errorTitle: string, successMsg?: string) {
    startTransition(async () => {
      try {
        await action();
        router.refresh();
        if (successMsg) toast.success(successMsg);
      } catch (err) {
        toast.error({
          title: errorTitle,
          description: getErrorMessage(err, "Intenta nuevamente en unos segundos."),
        });
      }
    });
  }

  function mover(index: number, direccion: -1 | 1) {
    const vecino = extras[index + direccion];
    const actual = extras[index];
    if (!vecino) return;
    run(
      () => reordenarExtraDesarrolloAction(actual.id, actual.orden, vecino.id, vecino.orden),
      "No se pudo reordenar el extra"
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
            Extras
          </p>
          <p className="text-xs text-muted-foreground">
            Servicios opcionales que se cotizan aparte. Se muestran debajo de los paquetes con su
            costo y el motivo del cobro.
          </p>
        </div>
        <ExtraFormDialog
          trigger={<Button />}
          triggerContent={
            <>
              <Plus className="size-4" /> Añadir
            </>
          }
          onSubmit={(values) =>
            run(
              () => crearExtraDesarrolloAction(values),
              "No se pudo crear el extra",
              "Extra creado correctamente."
            )
          }
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-elevation-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                Extra
              </TableHead>
              <TableHead className="text-right font-mono-technical text-[10px] uppercase tracking-wider">
                Precio
              </TableHead>
              <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                Estado
              </TableHead>
              <TableHead className="text-right font-mono-technical text-[10px] uppercase tracking-wider">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {extras.map((e, i) => (
              <TableRow key={e.id}>
                <TableCell className="whitespace-normal">
                  <span className="text-sm font-medium">{e.nombre}</span>
                  <p className="text-xs text-muted-foreground">{e.motivo}</p>
                </TableCell>
                <TableCell className="text-right font-mono-technical text-xs font-semibold whitespace-nowrap text-primary">
                  {e.precioDesde && "desde "}
                  {formatPrice(e.precio)}
                  {e.unidad && (
                    <span className="font-normal text-muted-foreground"> {e.unidad}</span>
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      e.activo
                        ? "rounded-full border border-primary bg-primary px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground"
                        : "rounded-full border border-border/60 px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground"
                    }
                  >
                    {e.activo ? "Visible" : "Oculto"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      aria-label="Mover arriba"
                      disabled={i === 0}
                      onClick={() => mover(i, -1)}
                    >
                      <ArrowUp className="size-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      aria-label="Mover abajo"
                      disabled={i === extras.length - 1}
                      onClick={() => mover(i, 1)}
                    >
                      <ArrowDown className="size-3.5" />
                    </Button>
                    <ExtraFormDialog
                      extra={{
                        id: e.id,
                        nombre: e.nombre,
                        motivo: e.motivo,
                        precio: e.precio,
                        unidad: e.unidad,
                        precioDesde: e.precioDesde,
                        activo: e.activo,
                      }}
                      trigger={<Button variant="outline" size="icon-sm" />}
                      triggerContent={<Pencil className="size-3.5" />}
                      onSubmit={(values) =>
                        run(
                          () => actualizarExtraDesarrolloAction(e.id, values),
                          "No se pudo actualizar el extra",
                          "Extra actualizado correctamente."
                        )
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Eliminar extra"
                      onClick={() =>
                        run(
                          () => eliminarExtraDesarrolloAction(e.id),
                          "No se pudo eliminar el extra",
                          `"${e.nombre}" se eliminó correctamente.`
                        )
                      }
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {extras.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                  No hay extras creados todavía.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
