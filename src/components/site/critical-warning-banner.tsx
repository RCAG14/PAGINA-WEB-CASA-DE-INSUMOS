import { AlertTriangle } from "lucide-react";
import { getDictionary } from "@/lib/i18n/locale";

export async function CriticalWarningBanner() {
  const { dict } = await getDictionary();
  return (
    <div className="border-2 border-red-600">
      <div
        className="h-1.5 w-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #dc2626, #dc2626 10px, #fef2f2 10px, #fef2f2 20px)",
        }}
      />
      <div className="flex items-start gap-3 bg-red-50 px-4 py-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-600" strokeWidth={2} />
        <p className="text-sm font-bold leading-snug text-red-600">{dict.criticalWarning.text}</p>
      </div>
    </div>
  );
}
