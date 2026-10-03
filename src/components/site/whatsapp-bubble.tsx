"use client";

import { useEffect, useRef, useState } from "react";
import { Boxes, MonitorCog, X } from "lucide-react";
import { buildWhatsAppLink, cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/locale-context";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  );
}

export type ServicioWhatsApp = "cajas" | "webdev";

// El mensaje llega al negocio, por eso va siempre en español sin importar el
// idioma que esté viendo el visitante.
const MENSAJES: Record<ServicioWhatsApp, string> = {
  cajas:
    "Hola, vengo de la página de Casa Insumos y quisiera más información sobre las cajas de devoluciones de Amazon.",
  webdev:
    "Hola, vengo de la página de Casa Insumos y quisiera más información sobre el servicio de desarrollo web.",
};

const ICONOS = { cajas: Boxes, webdev: MonitorCog } as const;

const BUBBLE_CLASS =
  "flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40";

/**
 * Botón flotante de WhatsApp. Con `servicio` abre el chat directo con un
 * mensaje sobre ese servicio; sin él (portada) primero pregunta cuál de los
 * dos servicios quiere consultar el visitante.
 */
export function WhatsAppBubble({
  numero,
  servicio,
}: {
  numero: string | null;
  servicio?: ServicioWhatsApp;
}) {
  const { dict } = useI18n();
  const t = dict.whatsappBubble;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  if (servicio) {
    return (
      <a
        href={buildWhatsAppLink(numero, MENSAJES[servicio])}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.ariaChat}
        className={cn("fixed bottom-5 left-4 z-50 sm:bottom-6 sm:left-6", BUBBLE_CLASS)}
      >
        <WhatsAppIcon className="size-6" />
      </a>
    );
  }

  const opciones: ServicioWhatsApp[] = ["cajas", "webdev"];

  return (
    <div ref={ref} className="fixed bottom-5 left-4 z-50 flex flex-col items-start gap-3 sm:bottom-6 sm:left-6">
      {open && (
        <div
          id="whatsapp-opciones"
          role="dialog"
          aria-label={t.question}
          className="w-72 origin-bottom-left animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 rounded-2xl border border-border bg-card p-4 shadow-elevation-lg"
        >
          <p className="font-heading text-sm font-semibold text-foreground">{t.question}</p>
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
        aria-label={open ? t.ariaClose : t.ariaChat}
        aria-expanded={open}
        aria-controls="whatsapp-opciones"
        className={BUBBLE_CLASS}
      >
        {open ? <X className="size-6" /> : <WhatsAppIcon className="size-6" />}
      </button>
    </div>
  );
}
