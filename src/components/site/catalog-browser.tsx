"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutGrid, Search } from "lucide-react";
import { ProductCard } from "@/components/site/product-card";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { useI18n } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";
import type { Box, CategoryMeta } from "@/lib/types";

type TypeFilter = "todas" | "listada" | "sorpresa";
type SortOrder = "destacadas" | "precio-asc" | "precio-desc" | "rating";

const PAGE_SIZE = 12;

export function CatalogBrowser({
  boxes,
  classifications,
}: {
  boxes: Box[];
  classifications: CategoryMeta[];
}) {
  const { dict } = useI18n();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [tipo, setTipo] = useState<TypeFilter>(
    () => (searchParams.get("tipo") as TypeFilter) || "todas"
  );
  const [categoria, setCategoria] = useState(() => searchParams.get("categoria") ?? "todas");
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [orden, setOrden] = useState<SortOrder>(
    () => (searchParams.get("orden") as SortOrder) || "destacadas"
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Refleja los filtros en la URL (sin disparar una navegación/refetch del server).
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (tipo !== "todas") params.set("tipo", tipo);
      if (categoria !== "todas") params.set("categoria", categoria);
      if (query.trim()) params.set("q", query.trim());
      if (orden !== "destacadas") params.set("orden", orden);
      const qs = params.toString();
      window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [tipo, categoria, query, orden, pathname]);

  // Reinicia la paginación cuando cambian los filtros (ajuste de estado durante el render, sin efecto).
  const filterKey = `${tipo}|${categoria}|${query}|${orden}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setVisibleCount(PAGE_SIZE);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = boxes.filter((b) => {
      const matchTipo = tipo === "todas" || b.tipo === tipo;
      const matchCategoria = categoria === "todas" || b.clasificacion.slug === categoria;
      const matchQuery =
        q === "" ||
        b.nombre.toLowerCase().includes(q) ||
        b.specs.skuCaja.toLowerCase().includes(q);
      return matchTipo && matchCategoria && matchQuery;
    });

    return [...result].sort((a, b) => {
      switch (orden) {
        case "precio-asc":
          return a.precio - b.precio;
        case "precio-desc":
          return b.precio - a.precio;
        case "rating":
          return b.rating - a.rating;
        case "destacadas":
        default:
          return Number(b.destacada) - Number(a.destacada);
      }
    });
  }, [boxes, tipo, categoria, query, orden]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 border border-border bg-card p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["todas", dict.catalogBrowser.filterAll],
                ["listada", dict.catalogBrowser.filterListed],
                ["sorpresa", dict.catalogBrowser.filterSurprise],
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

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={dict.catalogBrowser.searchPlaceholder}
                className="w-full border border-border bg-background py-1.5 pl-7 pr-2.5 font-mono-technical text-[11px] uppercase tracking-wider text-foreground placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:w-52"
              />
            </div>
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value as SortOrder)}
              aria-label={dict.catalogBrowser.sortLabel}
              className="border border-border bg-background px-2 py-1.5 font-mono-technical text-[11px] uppercase tracking-wider text-foreground focus:border-primary focus:outline-none"
            >
              <option value="destacadas">{dict.catalogBrowser.sortFeatured}</option>
              <option value="precio-asc">{dict.catalogBrowser.sortPriceAsc}</option>
              <option value="precio-desc">{dict.catalogBrowser.sortPriceDesc}</option>
              <option value="rating">{dict.catalogBrowser.sortRating}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
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
            {dict.catalogBrowser.allClassifications}
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
          {filtered.length.toString().padStart(2, "0")}{" "}
          {filtered.length === 1 ? dict.catalogBrowser.boxWord : dict.catalogBrowser.boxesWord}{" "}
          {dict.catalogBrowser.resultsSuffix}
        </span>
      </div>

      {filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((box, i) => (
              <ScrollReveal key={box.id} delayMs={(i % 8) * 60} className="h-full">
                <ProductCard box={box} />
              </ScrollReveal>
            ))}
          </div>
          {hasMore && (
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="self-center border border-border bg-background px-4 py-2 font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              {dict.catalogBrowser.loadMore}
            </button>
          )}
        </>
      ) : (
        <div className="border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          {dict.catalogBrowser.noResults}
        </div>
      )}
    </div>
  );
}
