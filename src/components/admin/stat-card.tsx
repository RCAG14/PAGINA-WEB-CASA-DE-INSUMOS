import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  helper?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-elevation-sm">
      <div className="flex items-center justify-between">
        <span className="font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="flex size-7 items-center justify-center rounded-lg border border-border/60 bg-primary/10 text-primary">
          <Icon className="size-3.5" strokeWidth={1.5} />
        </span>
      </div>
      <span className="font-heading text-2xl font-semibold text-foreground">{value}</span>
      {(helper || trend) && (
        <div className="flex items-center justify-between">
          {helper && <span className="text-xs text-muted-foreground">{helper}</span>}
          {trend && (
            <span
              className={cn(
                "font-mono-technical text-[11px] font-medium",
                trend.positive ? "text-primary" : "text-destructive"
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
