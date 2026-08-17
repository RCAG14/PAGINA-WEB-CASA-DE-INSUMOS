"use client";

import { useMemo, useState } from "react";
import { LayoutGrid } from "lucide-react";
import { ProductCard } from "@/components/site/product-card";
import { cn } from "@/lib/utils";
import type { Box, CategoryMeta } from "@/lib/types";

type TypeFilter = "todas" | "listada" | "sorpresa";

export function CatalogBrowser({
  boxes,
  classifications,
}: {
  boxes: Box[];
  classifications: CategoryMeta[];
}) {
  const [tipo, setTipo] = useState<TypeFilter>("todas");
  const [categoria, setCategoria] = useState<string>("todas");

  const filtered = useMemo(() => {
    return boxes.filter((b) => {
      const matchTipo = tipo === "todas" || b.tipo === tipo;
      const matchCategoria = categoria === "todas" || b.clasificacion.slug === categoria;
      return matchTipo && matchCategoria;
    });
  }, [boxes, tipo, categoria]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["todas", "Todas"],
              ["listada", "Listadas"],
              ["sorpresa", "Sorpresa"],
            ] as [TypeFilter, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTipo(value)}
              className={cn(
                "border px-3 py-1.5 font-mono-technical text-[11px] uppercase tracking-wider transition-colors",
                tipo === value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <LayoutGrid className="size-3.5 shrink-0 text-muted-foreground" />
          <button
            onClick={() => setCategoria("todas")}
            className={cn(
              "border px-2.5 py-1 font-mono-technical text-[10px] uppercase tracking-wider transition-colors",
              categoria === "todas"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Todas las clasificaciones
          </button>
          {classifications.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCategoria(c.slug)}
              className={cn(
                "border px-2.5 py-1 font-mono-technical text-[10px] uppercase tracking-wider transition-colors",
                categoria === c.slug
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-baseline justify-between font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>
          {filtered.length.toString().padStart(2, "0")} caja
          {filtered.length === 1 ? "" : "s"} listadas
        </span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((box) => (
            <ProductCard key={box.id} box={box} />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No hay cajas que coincidan con este filtro.
        </div>
      )}
    </div>
  );
}
