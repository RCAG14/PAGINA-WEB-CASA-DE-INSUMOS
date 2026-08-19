"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface HeroBackgroundProps {
  video: { url: string } | null;
  imagenes: { url: string }[];
}

export function HeroBackground({ video, imagenes }: HeroBackgroundProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const hasMedia = Boolean(video) || imagenes.length > 0;

  useEffect(() => {
    if (video || imagenes.length < 2) return;
    const id = setInterval(() => {
      setLoaded(false);
      setActiveIndex((i) => (i + 1) % imagenes.length);
    }, 6000);
    return () => clearInterval(id);
  }, [video, imagenes.length]);

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
        // Solo se monta la imagen activa: evita descargar todas las imágenes
        // del hero de una sola vez (impacto directo en el tiempo de carga inicial).
        <Image
          key={imagenes[activeIndex].url}
          src={imagenes[activeIndex].url}
          alt=""
          fill
          priority={activeIndex === 0}
          sizes="100vw"
          className={cn(
            "object-cover transition-opacity duration-700 motion-reduce:transition-none",
            loaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <div className="h-full w-full bg-blueprint-dark" />
      )}

      {hasMedia && (
        // Overlay siempre lo bastante oscuro para que el texto sea legible sin
        // importar el brillo/contenido del video o imagen que suba el admin.
        <div className="absolute inset-0 bg-linear-to-t from-sidebar/92 via-sidebar/72 to-sidebar/55" />
      )}
    </div>
  );
}
