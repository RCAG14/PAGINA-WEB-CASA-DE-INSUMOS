import { Info } from "lucide-react";
import { getDictionary } from "@/lib/i18n/locale";

/**
 * Aviso sobre el estado de los artículos de devolución. Es información
 * importante pero no un error: tono informativo (ámbar), no rojo en mayúsculas.
 */
export async function CriticalWarningBanner() {
  const { dict } = await getDictionary();
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-amber-950">
      <Info className="mt-0.5 size-5 shrink-0 text-amber-600" strokeWidth={2} />
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold">{dict.criticalWarning.title}</p>
        <p className="text-sm leading-snug text-amber-900/90">{dict.criticalWarning.text}</p>
      </div>
    </div>
  );
}
