"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Link2, MessageCircle, Pencil, Plus, Trash2 } from "lucide-react";
import {
  actualizarNumeroContactoAction,
  actualizarRedSocialAction,
  crearNumeroContactoAction,
  crearRedSocialAction,
  eliminarNumeroContactoAction,
  eliminarRedSocialAction,
} from "@/app/admin/configuracion/contacto/actions";
import { RedSocialFormDialog } from "@/components/admin/red-social-form-dialog";
import { NumeroContactoFormDialog } from "@/components/admin/numero-contacto-form-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RedSocial, NumeroContacto } from "@/generated/prisma/client";
import { getPlataformaRedSocial } from "@/lib/redes-sociales";

export function ConfiguracionTables({
  redesSociales,
  numerosContacto,
}: {
  redesSociales: RedSocial[];
  numerosContacto: NumeroContacto[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function refrescar() {
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
              Redes sociales
            </p>
            <p className="text-xs text-muted-foreground">
              Aparecen como íconos enlazados en el pie de página de la tienda.
            </p>
          </div>
          <RedSocialFormDialog
            trigger={<Button />}
            triggerContent={
              <>
                <Plus className="size-4" /> Añadir
              </>
            }
            onSubmit={(values) => {
              startTransition(async () => {
                await crearRedSocialAction(values);
                refrescar();
              });
            }}
          />
        </div>

        <div className="border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                  Plataforma
                </TableHead>
                <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                  Enlace
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
              {redesSociales.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="flex size-7 items-center justify-center border border-border bg-muted">
                        <Link2 className="size-3.5 text-primary" strokeWidth={1.5} />
                      </span>
                      <span className="text-sm font-medium">
                        {getPlataformaRedSocial(r.plataforma)?.label ?? r.plataforma}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate font-mono-technical text-xs text-muted-foreground">
                    {r.url}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        r.activo
                          ? "border border-primary bg-primary px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground"
                          : "border border-border px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground"
                      }
                    >
                      {r.activo ? "Visible" : "Oculto"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1.5">
                      <RedSocialFormDialog
                        redSocial={r}
                        trigger={<Button variant="outline" size="icon-sm" />}
                        triggerContent={<Pencil className="size-3.5" />}
                        onSubmit={(values) => {
                          startTransition(async () => {
                            await actualizarRedSocialAction(r.id, values);
                            refrescar();
                          });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Eliminar red social"
                        onClick={() =>
                          startTransition(async () => {
                            await eliminarRedSocialAction(r.id);
                            refrescar();
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
              {redesSociales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                    No hay redes sociales configuradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
              Números de redireccionamiento
            </p>
            <p className="text-xs text-muted-foreground">
              El primero activo (por orden de creación) es el que recibe al cliente desde el
              checkout vía WhatsApp.
            </p>
          </div>
          <NumeroContactoFormDialog
            trigger={<Button />}
            triggerContent={
              <>
                <Plus className="size-4" /> Añadir
              </>
            }
            onSubmit={(values) => {
              startTransition(async () => {
                await crearNumeroContactoAction(values);
                refrescar();
              });
            }}
          />
        </div>

        <div className="border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                  Etiqueta
                </TableHead>
                <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                  Número
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
              {numerosContacto.map((n, i) => (
                <TableRow key={n.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="flex size-7 items-center justify-center border border-border bg-muted">
                        <MessageCircle className="size-3.5 text-primary" strokeWidth={1.5} />
                      </span>
                      <span className="text-sm font-medium">{n.etiqueta}</span>
                      {i === 0 && n.activo && (
                        <span className="border border-accent bg-accent/15 px-1.5 py-0.5 font-mono-technical text-[9px] uppercase tracking-wider text-primary">
                          Principal
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono-technical text-xs text-muted-foreground">
                    +{n.numero}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        n.activo
                          ? "border border-primary bg-primary px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground"
                          : "border border-border px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground"
                      }
                    >
                      {n.activo ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1.5">
                      <NumeroContactoFormDialog
                        numeroContacto={n}
                        trigger={<Button variant="outline" size="icon-sm" />}
                        triggerContent={<Pencil className="size-3.5" />}
                        onSubmit={(values) => {
                          startTransition(async () => {
                            await actualizarNumeroContactoAction(n.id, values);
                            refrescar();
                          });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Eliminar número"
                        onClick={() =>
                          startTransition(async () => {
                            await eliminarNumeroContactoAction(n.id);
                            refrescar();
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
              {numerosContacto.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                    No hay números de contacto configurados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
