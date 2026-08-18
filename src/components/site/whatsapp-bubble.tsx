"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildWhatsAppLink } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/locale-context";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  );
}

export function WhatsAppBubble({ numero }: { numero: string | null }) {
  const [open, setOpen] = useState(false);
  const { dict } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  if (!numero) return null;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const nombre = String(formData.get("nombre") ?? "").trim();
    const telefono = String(formData.get("telefono") ?? "").trim();
    if (!nombre || !telefono) return;

    const mensaje = `Hola, soy ${nombre} (${telefono}). Quiero más información sobre Casa de Insumos.`;
    window.open(buildWhatsAppLink(numero!, mensaje), "_blank", "noopener,noreferrer");
    setOpen(false);
    form.reset();
  }

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 left-4 z-50 flex flex-col items-start gap-3 sm:bottom-6 sm:left-6"
    >
      {open && (
        <div className="w-72 border border-border bg-card shadow-lg sm:w-80">
          <div className="flex items-center justify-between gap-2 border-b border-border bg-primary px-3 py-2.5">
            <div className="flex items-center gap-2 text-primary-foreground">
              <WhatsAppIcon className="size-4" />
              <span className="font-mono-technical text-[11px] uppercase tracking-wider">
                {dict.whatsappBubble.title}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={dict.whatsappBubble.close}
              className="text-primary-foreground/70 hover:text-primary-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-3.5">
            <p className="text-xs text-muted-foreground">{dict.whatsappBubble.subtitle}</p>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="wa-nombre" className="text-xs">
                {dict.whatsappBubble.nameLabel}
              </Label>
              <Input
                id="wa-nombre"
                name="nombre"
                required
                placeholder={dict.whatsappBubble.namePlaceholder}
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="wa-telefono" className="text-xs">
                {dict.whatsappBubble.phoneLabel}
              </Label>
              <Input
                id="wa-telefono"
                name="telefono"
                type="tel"
                required
                placeholder={dict.whatsappBubble.phonePlaceholder}
              />
            </div>

            <Button type="submit" className="mt-1 w-full">
              <Send className="size-4" />
              {dict.whatsappBubble.submit}
            </Button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? dict.whatsappBubble.close : dict.whatsappBubble.open}
        className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X className="size-6" /> : <WhatsAppIcon className="size-6" />}
      </button>
    </div>
  );
}
