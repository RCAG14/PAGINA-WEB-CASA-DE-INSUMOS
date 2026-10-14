import type { ReactNode } from "react";
import { ChevronDown, Languages } from "lucide-react";

/**
 * Bloque plegable con los campos en inglés de un formulario del panel.
 * Son opcionales: lo que quede vacío se muestra en español en el sitio.
 */
export function TraduccionIngles({ children }: { children: ReactNode }) {
  return (
    <details className="group rounded-lg border border-border/60">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-xs font-medium [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          <Languages className="size-3.5 text-muted-foreground" />
          Traducción al inglés — opcional
        </span>
        <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="flex flex-col gap-4 border-t border-border/60 p-3">
        <p className="text-xs text-muted-foreground">
          Se muestra a quien navega el sitio en inglés. Lo que dejes vacío se ve en español.
        </p>
        {children}
      </div>
    </details>
  );
}
