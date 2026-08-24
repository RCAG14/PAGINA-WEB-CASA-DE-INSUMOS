"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Plus, ShieldCheck, Trash2, UserRound } from "lucide-react";
import {
  actualizarRolUsuarioAction,
  alternarActivoUsuarioAction,
  crearUsuarioAction,
  eliminarUsuarioAction,
} from "@/app/admin/configuracion/usuarios/actions";
import { UsuarioFormDialog } from "@/components/admin/usuario-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { RolStaff } from "@/lib/data/usuarios";
import { toast, getErrorMessage } from "@/lib/toast";

const ROLE_LABEL: Record<RolStaff, string> = { JEFE: "Jefe", SOCIO: "Socio" };

export function UsuariosTable({
  usuarios,
  currentUserId,
}: {
  usuarios: Usuario[];
  currentUserId: string;
}) {
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
            Cuentas de staff
          </p>
          <p className="text-xs text-muted-foreground">
            Jefe: control total del panel. Socio: solo lectura de métricas y reportes.
          </p>
        </div>
        <UsuarioFormDialog
          trigger={<Button />}
          triggerContent={
            <>
              <Plus className="size-4" /> Crear cuenta
            </>
          }
          onSubmit={async (values) => {
            await crearUsuarioAction(values);
            refrescar();
            toast.success("Cuenta creada correctamente.");
          }}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-elevation-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                Usuario
              </TableHead>
              <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                Acceso
              </TableHead>
              <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                Rol
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
            {usuarios.map((u) => {
              const esUsuarioActual = u.id === currentUserId;
              const rol = u.rol as RolStaff;
              return (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="flex size-7 items-center justify-center rounded-lg border border-border/60 bg-muted">
                        <UserRound className="size-3.5 text-primary" strokeWidth={1.5} />
                      </span>
                      <span className="text-sm font-medium">{u.nombre}</span>
                      {esUsuarioActual && (
                        <Badge variant="outline" className="text-[10px]">
                          Tú
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono-technical text-xs text-muted-foreground">
                    {u.username}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={rol}
                      onValueChange={(v) => {
                        if (!v || v === rol) return;
                        run(
                          () => actualizarRolUsuarioAction(u.id, v as RolStaff),
                          `Rol de "${u.nombre}" actualizado a ${ROLE_LABEL[v as RolStaff]}.`,
                          "No se pudo cambiar el rol"
                        );
                      }}
                    >
                      <SelectTrigger size="sm" className="w-28">
                        <SelectValue>
                          {() => (
                            <span className="flex items-center gap-1">
                              {rol === "JEFE" && <ShieldCheck className="size-3.5 text-primary" />}
                              {ROLE_LABEL[rol]}
                            </span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOCIO">Socio</SelectItem>
                        <SelectItem value="JEFE">Jefe</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="font-mono-technical text-xs text-muted-foreground">
                    {u.creado_en.toISOString().slice(0, 10)}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={u.activo}
                      disabled={esUsuarioActual}
                      onCheckedChange={(v) =>
                        run(
                          () => alternarActivoUsuarioAction(u.id, v),
                          v ? "Usuario activado." : "Usuario desactivado.",
                          "No se pudo cambiar el estado del usuario"
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Eliminar usuario"
                        disabled={esUsuarioActual}
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          run(
                            () => eliminarUsuarioAction(u.id),
                            `"${u.nombre}" se eliminó correctamente.`,
                            "No se pudo eliminar el usuario"
                          )
                        }
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {usuarios.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                  No hay cuentas de staff todavía.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
