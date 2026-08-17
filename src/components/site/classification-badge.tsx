import { CLASSIFICATION_ICON_MAP } from "@/components/site/box-visual";
import { cn } from "@/lib/utils";
import type { CategoryMeta } from "@/lib/types";

export function ClassificationBadge({
  clasificacion,
  className,
}: {
  clasificacion: CategoryMeta;
  className?: string;
}) {
  const Icon = CLASSIFICATION_ICON_MAP[clasificacion.icon];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border border-primary/30 bg-primary/5 px-2 py-0.5 font-mono-technical text-[10px] font-medium uppercase tracking-wider text-primary",
        className
      )}
    >
      <Icon className="size-3" strokeWidth={1.75} />
      {clasificacion.label}
    </span>
  );
}
