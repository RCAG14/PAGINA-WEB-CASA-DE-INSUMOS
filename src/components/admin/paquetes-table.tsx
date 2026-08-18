"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Star, Trash2 } from "lucide-react";
import {
  actualizarPaqueteDesarrolloAction,
  crearPaqueteDesarrolloAction,
  eliminarPaqueteDesarrolloAction,
  reordenarPaqueteDesarrolloAction,
} from "@/app/admin/desarrollo-web/actions";
import { PaqueteFormDialog } from "@/components/admin/paquete-form-dialog";
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
import type { getPaquetesDesarrolloAdmin } from "@/lib/data/desarrollo";

type PaqueteDesarrolloRow = Awaited<ReturnType<typeof getPaquetesDesarrolloAdmin>>[number];

export function PaquetesTable({ paquetes }: { paquetes: PaqueteDesarrolloRow[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function mover(index: number, direccion: -1 | 1) {
    const vecino = paquetes[index + direccion];
    const actual = paquetes[index];
    if (!vecino) return;
    startTransition(async () => {
      await reordenarPaqueteDesarrolloAction(actual.id, actual.orden, vecino.id, vecino.orden);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
            Paquetes
          </p>
          <p className="text-xs text-muted-foreground">
            Se muestran en /desarrollo-web en este orden. Cada uno arma su propio mensaje de
            WhatsApp para cotizar.
          </p>
        </div>
        <PaqueteFormDialog
          trigger={<Button />}
          triggerContent={
            <>
              <Plus className="size-4" /> Añadir
            </>
          }
          onSubmit={(values) => {
            startTransition(async () => {
              await crearPaqueteDesarrolloAction(values);
              router.refresh();
            });
          }}
        />
      </div>

      <div className="border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                Paquete
              </TableHead>
              <TableHead className="text-right font-mono-technical text-[10px] uppercase tracking-wider">
                Precio
              </TableHead>
              <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                Features
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
            {paquetes.map((p, i) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{p.nombre}</span>
                    {p.destacado && (
                      <span className="flex items-center gap-1 border border-accent bg-accent/15 px-1.5 py-0.5 font-mono-technical text-[9px] uppercase tracking-wider text-primary">
                        <Star className="size-2.5" strokeWidth={2} />
                        Recomendado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{p.tagline}</p>
                </TableCell>
                <TableCell className="text-right font-mono-technical text-xs font-semibold text-primary">
                  {formatPrice(p.precio)}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {p.features.length} ítem{p.features.length === 1 ? "" : "s"}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      p.activo
                        ? "border border-primary bg-primary px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground"
                        : "border border-border px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground"
                    }
                  >
                    {p.activo ? "Visible" : "Oculto"}
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
                      disabled={i === paquetes.length - 1}
                      onClick={() => mover(i, 1)}
                    >
                      <ArrowDown className="size-3.5" />
                    </Button>
                    <PaqueteFormDialog
                      paquete={{
                        id: p.id,
                        nombre: p.nombre,
                        tagline: p.tagline,
                        precio: p.precio,
                        features: p.features,
                        destacado: p.destacado,
                        activo: p.activo,
                      }}
                      trigger={<Button variant="outline" size="icon-sm" />}
                      triggerContent={<Pencil className="size-3.5" />}
                      onSubmit={(values) => {
                        startTransition(async () => {
                          await actualizarPaqueteDesarrolloAction(p.id, values);
                          router.refresh();
                        });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Eliminar paquete"
                      onClick={() =>
                        startTransition(async () => {
                          await eliminarPaqueteDesarrolloAction(p.id);
                          router.refresh();
                        })
                      }
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {paquetes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No hay paquetes creados todavía.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
