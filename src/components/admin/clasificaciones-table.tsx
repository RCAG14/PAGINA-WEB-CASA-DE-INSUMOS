"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  actualizarClasificacionAction,
  crearClasificacionAction,
  eliminarClasificacionAction,
} from "@/app/admin/cajas/clasificaciones/actions";
import { ClassificationFormDialog } from "@/components/admin/classification-form-dialog";
import { CLASSIFICATION_ICON_MAP } from "@/components/site/box-visual";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CategoryMeta } from "@/lib/types";

export function ClasificacionesTable({
  classifications,
  counts,
}: {
  classifications: CategoryMeta[];
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete(id: string) {
    setError(null);
    startTransition(async () => {
      try {
        await eliminarClasificacionAction(id);
        router.refresh();
      } catch {
        setError(
          "No se pudo eliminar: hay cajas que todavía usan esta clasificación. Reasígnalas antes de eliminarla."
        );
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <Alert className="border-red-600 bg-red-50">
          <AlertTitle className="font-mono-technical text-xs uppercase tracking-wider text-red-600">
            No se pudo eliminar la clasificación
          </AlertTitle>
          <AlertDescription className="text-xs text-red-600">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
          {classifications.length.toString().padStart(2, "0")} clasificaciones activas
        </p>
        <ClassificationFormDialog
          trigger={<Button />}
          triggerContent={
            <>
              <Plus className="size-4" /> Añadir
            </>
          }
          onSubmit={(values) => {
            startTransition(async () => {
              await crearClasificacionAction({
                nombre: values.label,
                descripcion: values.descripcion,
                icono: values.icon,
              });
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
                Clasificación
              </TableHead>
              <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                Slug
              </TableHead>
              <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                Descripción
              </TableHead>
              <TableHead className="text-right font-mono-technical text-[10px] uppercase tracking-wider">
                Cajas asociadas
              </TableHead>
              <TableHead className="text-right font-mono-technical text-[10px] uppercase tracking-wider">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classifications.map((c) => {
              const Icon = CLASSIFICATION_ICON_MAP[c.icon];
              return (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center border border-border bg-muted">
                        <Icon className="size-4 text-primary" strokeWidth={1.5} />
                      </div>
                      <span className="text-sm font-medium leading-tight">{c.label}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono-technical text-xs text-muted-foreground">
                    {c.slug}
                  </TableCell>
                  <TableCell className="max-w-xs text-xs text-muted-foreground">
                    {c.descripcion}
                  </TableCell>
                  <TableCell className="text-right font-mono-technical text-xs font-semibold">
                    {counts[c.id] ?? 0}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1.5">
                      <ClassificationFormDialog
                        classification={c}
                        trigger={<Button variant="outline" size="icon-sm" />}
                        triggerContent={<Pencil className="size-3.5" />}
                        onSubmit={(values) => {
                          startTransition(async () => {
                            await actualizarClasificacionAction(c.id, {
                              nombre: values.label,
                              descripcion: values.descripcion,
                              icono: values.icon,
                            });
                            router.refresh();
                          });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Eliminar clasificación"
                        onClick={() => handleDelete(c.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {classifications.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No hay clasificaciones creadas todavía.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
