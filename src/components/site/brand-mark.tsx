import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Isotipo de respaldo cuando no hay logo cargado desde el panel: caja
 * hexagonal minimalista con una hoja integrada, en el verde de marca.
 */
function BrandGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M16 2 28 9v14L16 30 4 23V9z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M4 9 16 16 28 9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 16v14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path
        d="M16 12c0-3.5 2.2-5.5 5-6-0.5 3-1.8 5.4-5 6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BrandMark({
  logoUrl,
  size = 32,
  className,
  glyphClassName,
}: {
  logoUrl?: string | null;
  size?: number;
  className?: string;
  glyphClassName?: string;
}) {
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg",
        // Sin chip de fondo para el logo real: se muestra tal cual, con su
        // propia transparencia. El respaldo SVG sí lleva un fondo tenue,
        // porque su trazo usa currentColor y necesita contraste.
        !logoUrl && "bg-primary/8 text-primary",
        className
      )}
      style={{ width: size, height: size }}
    >
      {logoUrl ? (
        <Image src={logoUrl} alt="Casa Insumos" fill sizes={`${size}px`} className="object-contain" />
      ) : (
        <BrandGlyph className={cn("size-2/3", glyphClassName)} />
      )}
    </span>
  );
}
