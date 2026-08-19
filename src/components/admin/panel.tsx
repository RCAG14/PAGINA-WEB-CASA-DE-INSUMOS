import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/60 bg-card shadow-elevation-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  label,
  action,
  icon,
  className,
}: {
  label: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3",
        className
      )}
    >
      <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {action ?? icon}
    </div>
  );
}
