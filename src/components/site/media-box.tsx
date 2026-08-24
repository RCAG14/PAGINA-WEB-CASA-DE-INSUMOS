import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { cn } from "@/lib/utils";

interface MediaBoxProps {
  imagen: { url: string; titulo?: string | null } | null;
  alt: string;
  placeholderLabel: string;
  placeholderIcon?: LucideIcon;
  priority?: boolean;
  sizes: string;
  className?: string;
}

/** Foto de landing (hero/about) con fallback si aún no se sube nada desde el panel. */
export function MediaBox({
  imagen,
  alt,
  placeholderLabel,
  placeholderIcon: Icon,
  priority,
  sizes,
  className,
}: MediaBoxProps) {
  return (
    <ScrollReveal
      className={cn(
        "relative aspect-4/3 w-full overflow-hidden rounded-xl border border-border shadow-elevation-md",
        className
      )}
    >
      {imagen ? (
        <Image
          src={imagen.url}
          alt={imagen.titulo ?? alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-secondary">
          {Icon && <Icon className="size-16 text-primary" strokeWidth={1.25} />}
          <span className="font-mono-technical text-xs text-muted-foreground">
            {placeholderLabel}
          </span>
        </div>
      )}
    </ScrollReveal>
  );
}
