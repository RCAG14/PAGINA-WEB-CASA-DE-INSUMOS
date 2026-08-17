"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { eliminarCajaAction } from "@/app/admin/cajas/inventario/actions";
import { BoxTypeBadge } from "@/components/site/box-type-badge";
import { CLASSIFICATION_ICON_MAP } from "@/components/site/box-visual";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/format";
import type { Box, CategoryMeta } from "@/lib/types";

export function InventarioTable({
  boxes,
  classifications,
}: {
  boxes: Box[];
  classifications: CategoryMeta[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return boxes.filter((b) => {
      const matchSearch =
        search.trim() === "" ||
        b.nombre.toLowerCase().includes(search.toLowerCase()) ||
        b.specs.skuCaja.toLowerCase().includes(search.toLowerCase());
      const matchCategoria = categoria === "todas" || b.clasificacion.slug === categoria;
      return matchSearch && matchCategoria;
    });
  }, [boxes, search, categoria]);

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      await eliminarCajaAction(id);
      router.refresh();
      setDeletingId(null);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o SKU"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={categoria} onValueChange={(v) => setCategoria(v ?? "todas")}>
            <SelectTrigger className="sm:w-56">
              <SelectValue>
                {() =>
                  categoria === "todas"
                    ? "Todas las clasificaciones"
                    : classifications.find((c) => c.slug === categoria)?.label
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las clasificaciones</SelectItem>
              {classifications.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Link href="/admin/cajas/inventario/nueva" className={buttonVariants({})}>
          <Plus className="size-4" /> Nueva caja
        </Link>
      </div>

      <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
        {filtered.length.toString().padStart(2, "0")} de {boxes.length.toString().padStart(2, "0")}{" "}
        cajas mostradas
      </p>

      <div className="border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                Caja
              </TableHead>
              <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                Clasificación
              </TableHead>
              <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
                Tipo
              </TableHead>
              <TableHead className="text-right font-mono-technical text-[10px] uppercase tracking-wider">
                Precio
              </TableHead>
              <TableHead className="text-right font-mono-technical text-[10px] uppercase tracking-wider">
                Stock
              </TableHead>
              <TableHead className="text-right font-mono-technical text-[10px] uppercase tracking-wider">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((box) => {
              const Icon = CLASSIFICATION_ICON_MAP[box.clasificacion.icon];
              const lowStock = box.stock < 15;
              return (
                <TableRow key={box.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden border border-border bg-muted">
                        {box.imagenUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={box.imagenUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Icon className="size-4 text-primary" strokeWidth={1.5} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium leading-tight">{box.nombre}</span>
                        <span className="font-mono-technical text-[10px] text-muted-foreground">
                          {box.specs.skuCaja}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {box.clasificacion.label}
                  </TableCell>
                  <TableCell>
                    <BoxTypeBadge tipo={box.tipo} />
                  </TableCell>
                  <TableCell className="text-right font-mono-technical text-xs font-semibold">
                    {formatPrice(box.precio)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        lowStock
                          ? "border border-destructive/40 bg-destructive/10 px-2 py-0.5 font-mono-technical text-[11px] font-semibold text-destructive"
                          : "font-mono-technical text-xs"
                      }
                    >
                      {box.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/cajas/inventario/${box.id}/editar`}
                        className={buttonVariants({ variant: "outline", size: "icon-sm" })}
                        aria-label="Editar caja"
                      >
                        <Pencil className="size-3.5" />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Eliminar caja"
                        disabled={isPending && deletingId === box.id}
                        onClick={() => handleDelete(box.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No hay cajas que coincidan con la búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
