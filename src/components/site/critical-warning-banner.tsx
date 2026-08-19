import { AlertTriangle } from "lucide-react";
import { getDictionary } from "@/lib/i18n/locale";

export async function CriticalWarningBanner() {
  const { dict } = await getDictionary();
  return (
    <div className="overflow-hidden rounded-xl border-2 border-destructive/60 shadow-glow-accent">
      <div
        className="h-1.5 w-full opacity-80"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--destructive), var(--destructive) 10px, transparent 10px, transparent 20px)",
        }}
      />
      <div className="flex items-start gap-3 bg-destructive/10 px-4 py-3 backdrop-blur-sm">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" strokeWidth={2} />
        <p className="text-sm font-bold leading-snug text-destructive">{dict.criticalWarning.text}</p>
      </div>
    </div>
  );
}
