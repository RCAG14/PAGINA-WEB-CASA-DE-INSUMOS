"use client";

import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, dict } = useI18n();

  return (
    <div
      role="group"
      aria-label={dict.languageSwitcher.label}
      className={cn(
        "flex items-center gap-1 border border-current/20 font-mono-technical text-[10px] uppercase tracking-wider",
        className
      )}
    >
      <Languages className="ml-1.5 size-3 shrink-0 opacity-60" strokeWidth={1.5} />
      <button
        type="button"
        onClick={() => setLocale("es")}
        aria-pressed={locale === "es"}
        className={cn(
          "px-1.5 py-1 transition-colors",
          locale === "es" ? "font-semibold opacity-100" : "opacity-50 hover:opacity-80"
        )}
      >
        ES
      </button>
      <span className="opacity-30">/</span>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={cn(
          "px-1.5 py-1 transition-colors",
          locale === "en" ? "font-semibold opacity-100" : "opacity-50 hover:opacity-80"
        )}
      >
        EN
      </button>
    </div>
  );
}
