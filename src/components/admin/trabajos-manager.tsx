"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowDown, ArrowUp, ImageOff, Pencil, Plus, Trash2 } from "lucide-react";
import {
  actualizarTrabajoRealizadoAction,
  crearTrabajoRealizadoAction,
  eliminarTrabajoRealizadoAction,
  reordenarTrabajoRealizadoAction,
} from "@/app/admin/desarrollo-web/actions";
import { TrabajoFormDialog } from "@/components/admin/trabajo-form-dialog";
import { Button } from "@/components/ui/button";
import type { TrabajoRealizado } from "@/generated/prisma/client";
import { toast, getErrorMessage } from "@/lib/toast";

export function TrabajosManager({ trabajos }: { trabajos: TrabajoRealizado[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function refrescar() {
    router.refresh();
  }

  function run(action: () => Promise<unknown>, errorTitle: string, successMsg?: string) {
    startTransition(async () => {
      try {
        await action();
        refrescar();
        if (successMsg) toast.success(successMsg);
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
            Trabajos realizados
          </p>
          <p className="text-xs text-muted-foreground">
            Portfolio mostrado en /desarrollo-web. Reemplaza los ejemplos de relleno por casos
            reales cuando los tengas.
          </p>
        </div>
        <TrabajoFormDialog
          trigger={<Button size="sm" />}
          triggerContent={
            <>
              <Plus className="size-4" /> Añadir
            </>
          }
          onSubmit={(values) =>
            run(
              () => crearTrabajoRealizadoAction(values),
              "No se pudo crear el trabajo",
              "Trabajo creado correctamente."
            )
          }
        />
      </div>

      {trabajos.length === 0 ? (
        <p className="border border-dashed border-border bg-card/60 px-4 py-6 text-center text-xs text-muted-foreground">
          Nada cargado todavía.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trabajos.map((trabajo, i) => (
            <div
              key={trabajo.id}
              className="flex flex-col gap-2 border border-border bg-card p-2.5"
            >
              <div className="relative aspect-video w-full overflow-hidden border border-border bg-muted">
                {trabajo.imagen_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={trabajo.imagen_url}
                    alt={trabajo.titulo}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <ImageOff className="size-6" strokeWidth={1.5} />
                  </div>
                )}
                <span
                  className={
                    trabajo.activo
                      ? "absolute right-1.5 top-1.5 border border-primary bg-primary px-1.5 py-0.5 font-mono-technical text-[9px] uppercase tracking-wider text-primary-foreground"
                      : "absolute right-1.5 top-1.5 border border-border bg-background/90 px-1.5 py-0.5 font-mono-technical text-[9px] uppercase tracking-wider text-muted-foreground"
                  }
                >
                  {trabajo.activo ? "Visible" : "Oculto"}
                </span>
              </div>

              <div>
                <p className="truncate text-xs font-medium">{trabajo.titulo}</p>
                <p className="truncate font-mono-technical text-[10px] uppercase tracking-wider text-accent">
                  {trabajo.categoria}
                </p>
              </div>

              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon-xs"
                    aria-label="Mover arriba"
                    disabled={i === 0}
                    onClick={() => {
                      const prev = trabajos[i - 1];
                      run(
                        () =>
                          reordenarTrabajoRealizadoAction(
                            trabajo.id,
                            trabajo.orden,
                            prev.id,
                            prev.orden
                          ),
                        "No se pudo reordenar el trabajo"
                      );
                    }}
                  >
                    <ArrowUp className="size-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-xs"
                    aria-label="Mover abajo"
                    disabled={i === trabajos.length - 1}
                    onClick={() => {
                      const next = trabajos[i + 1];
                      run(
                        () =>
                          reordenarTrabajoRealizadoAction(
                            trabajo.id,
                            trabajo.orden,
                            next.id,
                            next.orden
                          ),
                        "No se pudo reordenar el trabajo"
                      );
                    }}
                  >
                    <ArrowDown className="size-3" />
                  </Button>
                </div>

                <div className="flex items-center gap-1">
                  <TrabajoFormDialog
                    trabajo={{
                      id: trabajo.id,
                      titulo: trabajo.titulo,
                      categoria: trabajo.categoria,
                      descripcion: trabajo.descripcion,
                      imagenUrl: trabajo.imagen_url,
                      imagenPath: trabajo.imagen_path,
                      enlace: trabajo.enlace,
                      activo: trabajo.activo,
                    }}
                    trigger={<Button variant="outline" size="icon-xs" />}
                    triggerContent={<Pencil className="size-3" />}
                    onSubmit={(values) =>
                      run(
                        () => actualizarTrabajoRealizadoAction(trabajo.id, values),
                        "No se pudo actualizar el trabajo",
                        "Trabajo actualizado correctamente."
                      )
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Eliminar"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      run(
                        () => eliminarTrabajoRealizadoAction(trabajo.id),
                        "No se pudo eliminar el trabajo",
                        `"${trabajo.titulo}" se eliminó correctamente.`
                      )
                    }
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
