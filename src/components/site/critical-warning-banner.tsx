import { AlertTriangle } from "lucide-react";

export function CriticalWarningBanner() {
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
        <p className="text-sm font-bold leading-snug text-red-600">
          ESTADO NO CONFIRMADO: Al ser productos de retorno de liquidación, no se garantiza el
          estado estético ni la funcionalidad individual de los artículos.
        </p>
      </div>
    </div>
  );
}
