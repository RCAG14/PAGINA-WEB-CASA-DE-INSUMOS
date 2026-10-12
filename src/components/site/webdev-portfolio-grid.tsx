"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Grilla de trabajos realizados que muestra solo la primera fila hasta que el
 * visitante pide ver todos (12+ trabajos alargaban mucho la página).
 *
 * Columnas: celular = carrusel horizontal (se ven todos deslizando), sm = 2,
 * lg = 3, 2xl = 4. Plegada, en sm+ se ocultan los que no entran en la
 * primera fila de cada breakpoint: el 3.º entre sm y lg, el 4.º entre sm y
 * 2xl, y del 5.º en adelante siempre.
 */
export function WebDevPortfolioGrid({
  items,
  showAllLabel,
  showLessLabel,
}: {
  items: ReactNode[];
  showAllLabel: string;
  showLessLabel: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const plegable = items.length > 4;

  function claseOculta(i: number) {
    if (expanded || !plegable) return "";
    if (i >= 4) return "sm:hidden";
    if (i === 3) return "sm:max-2xl:hidden";
    if (i === 2) return "sm:max-lg:hidden";
    return "";
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 2xl:grid-cols-4">
        {items.map((item, i) => (
          <div
            key={i}
            className={cn("h-full w-[82%] shrink-0 snap-start sm:w-auto", claseOculta(i))}
          >
            {item}
          </div>
        ))}
      </div>

      {plegable && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="hidden items-center gap-2 self-center rounded-lg border border-primary/40 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 sm:flex"
        >
          {expanded ? showLessLabel : `${showAllLabel} (${items.length})`}
          <ChevronDown className={cn("size-4 transition-transform", expanded && "rotate-180")} />
        </button>
      )}
    </div>
  );
}
