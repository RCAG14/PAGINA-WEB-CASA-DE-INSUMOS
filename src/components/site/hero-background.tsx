"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface HeroBackgroundProps {
  video: { url: string } | null;
  imagenes: { url: string }[];
  /** Milisegundos entre imágenes del carrusel (ignorado si hay video). */
  intervalMs?: number;
  /** Clases del velo sobre la imagen/video — por defecto, degradé oscuro para texto claro. */
  overlayClassName?: string;
  /** Atributo `sizes` de next/image — por defecto, fondo a todo el ancho del viewport. */
  sizes?: string;
}

const DEFAULT_OVERLAY = "bg-linear-to-t from-sidebar/92 via-sidebar/72 to-sidebar/55";
const CROSSFADE_MS = 1800;

export function HeroBackground({
  video,
  imagenes,
  intervalMs = 6000,
  overlayClassName = DEFAULT_OVERLAY,
  sizes = "100vw",
}: HeroBackgroundProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMedia = Boolean(video) || imagenes.length > 0;

  useEffect(() => {
    if (video || imagenes.length < 2) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % imagenes.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [video, imagenes.length, intervalMs]);

  return (
    <div className="absolute inset-0 z-0">
      {video ? (
        <video
          src={video.url}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : imagenes.length > 0 ? (
        // Todas montadas a la vez, cruzando opacidad entre la saliente y la
        // entrante: da una transición real en vez de un corte seco.
        imagenes.map((imagen, i) => (
          <Image
            key={imagen.url}
            src={imagen.url}
            alt=""
            fill
            priority={i === 0}
            sizes={sizes}
            className={cn(
              "object-cover transition-opacity ease-in-out motion-reduce:transition-none",
              i === activeIndex ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDuration: `${CROSSFADE_MS}ms` }}
          />
        ))
      ) : (
        <div className="h-full w-full bg-blueprint-dark" />
      )}

      {hasMedia && (
        // Velo siempre lo bastante marcado para que el texto sea legible sin
        // importar el brillo/contenido del video o imagen que suba el admin.
        <div className={cn("absolute inset-0", overlayClassName)} />
      )}
    </div>
  );
}
