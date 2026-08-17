"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface HeroBackgroundProps {
  video: { url: string } | null;
  imagenes: { url: string }[];
}

export function HeroBackground({ video, imagenes }: HeroBackgroundProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMedia = Boolean(video) || imagenes.length > 0;

  useEffect(() => {
    if (video || imagenes.length < 2) return;
    const id = setInterval(() => {
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
        imagenes.map((img, i) => (
          // Fondo decorativo del Hero, sin valor semántico propio.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.url}
            src={img.url}
            alt=""
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
              i === activeIndex ? "opacity-100" : "opacity-0"
            )}
          />
        ))
      ) : (
        <div className="h-full w-full bg-blueprint-dark" />
      )}

      {hasMedia && <div className="absolute inset-0 bg-primary/70" />}
    </div>
  );
}
