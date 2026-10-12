"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Boxes, MonitorCog, X } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/locale-context";
import { MENSAJES_WHATSAPP, type ServicioWhatsApp } from "@/lib/whatsapp";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  );
}

const MENSAJES = MENSAJES_WHATSAPP;

const ICONOS = { cajas: Boxes, webdev: MonitorCog } as const;

/**
 * Botón de WhatsApp que antes de abrir el chat pregunta sobre qué servicio
 * quiere consultar el visitante (portada, donde conviven los dos negocios).
 * El panel se abre encima del botón y se cierra con clic afuera o Escape.
 */
export function WhatsAppServicePicker({
  numero,
  className,
  children,
}: {
  numero: string | null;
  className?: string;
  children: React.ReactNode;
}) {
  const { dict } = useI18n();
  const t = dict.whatsappBubble;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!numero) return null;

  const opciones: ServicioWhatsApp[] = ["cajas", "webdev"];

  return (
    <div ref={ref} className="relative shrink-0">
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={t.question}
          className="absolute bottom-full left-0 z-50 mb-3 w-72 max-w-[calc(100vw-2rem)] origin-bottom-left animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 rounded-2xl border border-border bg-card p-4 text-left text-foreground shadow-elevation-lg sm:left-auto sm:right-0 sm:origin-bottom-right"
        >
          <p className="font-heading text-sm font-semibold">{t.question}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{t.hint}</p>
          <div className="mt-3 flex flex-col gap-2">
            {opciones.map((s) => {
              const Icon = ICONOS[s];
              return (
                <a
                  key={s}
                  href={buildWhatsAppLink(numero, MENSAJES[s])}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:border-primary focus-visible:bg-primary/5 focus-visible:outline-none"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  {t.options[s]}
                </a>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        className={className}
      >
        {open ? <X className="size-4" strokeWidth={2} /> : <WhatsAppIcon className="size-4" />}
        {children}
      </button>
    </div>
  );
}
