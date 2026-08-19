"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BoxVisual } from "@/components/site/box-visual";
import { formatPrice } from "@/lib/format";
import type { Box, CategoryMeta } from "@/lib/types";

export function ProductPickerDialog({
  boxes,
  classifications,
  trigger,
  triggerContent,
  onSelect,
}: {
  /** Se asume ordenado por fecha de creación descendente (ver getCajas). */
  boxes: Box[];
  classifications: CategoryMeta[];
  trigger: React.ReactElement;
  triggerContent: ReactNode;
  onSelect: (box: Box) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [soloUltimos5, setSoloUltimos5] = useState(false);

  const filtered = useMemo(() => {
    const result = boxes.filter((b) => {
      const matchSearch =
        search.trim() === "" || b.nombre.toLowerCase().includes(search.toLowerCase());
      const matchCategoria = categoria === "todas" || b.clasificacion.slug === categoria;
      const matchMin = precioMin === "" || b.precio >= Number(precioMin);
      const matchMax = precioMax === "" || b.precio <= Number(precioMax);
      return matchSearch && matchCategoria && matchMin && matchMax;
    });
    return soloUltimos5 ? result.slice(0, 5) : result;
  }, [boxes, search, categoria, precioMin, precioMax, soloUltimos5]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setSearch("");
      setCategoria("todas");
      setPrecioMin("");
      setPrecioMax("");
      setSoloUltimos5(false);
    }
  }

  function handleSelect(box: Box) {
    onSelect(box);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger}>{triggerContent}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-mono-technical text-sm uppercase tracking-wider">
            Elegir producto de destino
          </DialogTitle>
          <DialogDescription>
            El botón del banner redirigirá a la ficha del producto que elijas aquí.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-[160px] flex-1">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={categoria} onValueChange={(v) => setCategoria(v ?? "todas")}>
              <SelectTrigger className="w-44">
                <SelectValue>
                  {() =>
                    categoria === "todas"
                      ? "Todas las categorías"
                      : (classifications.find((c) => c.slug === categoria)?.label ??
                        "Todas las categorías")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las categorías</SelectItem>
                {classifications.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="number"
              placeholder="Precio mín."
              min={0}
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
              className="w-28"
            />
            <span className="text-xs text-muted-foreground">—</span>
            <Input
              type="number"
              placeholder="Precio máx."
              min={0}
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              className="w-28"
            />
            <Button
              type="button"
              size="sm"
              variant={soloUltimos5 ? "default" : "outline"}
              onClick={() => setSoloUltimos5((v) => !v)}
              className="ml-auto"
            >
              Últimos 5 agregados
            </Button>
          </div>

          <div className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
            {filtered.map((box) => (
              <button
                key={box.id}
                type="button"
                onClick={() => handleSelect(box)}
                className="flex flex-col gap-1.5 rounded-lg border border-border/60 p-2 text-left transition-colors hover:border-primary"
              >
                <BoxVisual box={box} className="aspect-square" iconClassName="size-6" />
                <span className="line-clamp-2 text-xs font-medium leading-tight">
                  {box.nombre}
                </span>
                <span className="font-mono-technical text-[11px] font-semibold text-primary">
                  {formatPrice(box.precio)}
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full py-8 text-center text-xs text-muted-foreground">
                No hay productos que coincidan con los filtros.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
