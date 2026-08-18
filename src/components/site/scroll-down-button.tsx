"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollDownButton({
  targetId,
  label,
  className,
}: {
  targetId: string;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      aria-label={label}
      className={cn("group flex flex-col items-center gap-1.5", className)}
    >
      <span className="font-mono-technical text-[10px] uppercase tracking-wider opacity-70 transition-opacity group-hover:opacity-100">
        {label}
      </span>
      <span className="flex size-9 animate-bounce items-center justify-center border border-current/40 transition-colors group-hover:border-current">
        <ChevronDown className="size-4" strokeWidth={1.5} />
      </span>
    </button>
  );
}
