"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Loader2, Trash2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface StorageAsset {
  url: string;
  path: string;
}

interface StorageUploaderProps {
  value: StorageAsset | null;
  onChange: (asset: StorageAsset | null) => void;
  resourceType: "image" | "video";
  /** Carpeta del bucket de destino — debe estar en la lista blanca de /api/upload. */
  folder: string;
  label?: string;
  className?: string;
}

export function StorageUploader({
  value,
  onChange,
  resourceType,
  folder,
  label,
  className,
}: StorageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    setPending(true);
    const previous = value;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("resourceType", resourceType);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "No se pudo subir el archivo.");
      }

      onChange({ url: data.url, path: data.path });

      if (previous) {
        void fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: previous.path }),
        }).catch(() => {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir el archivo.");
    } finally {
      setPending(false);
    }
  }

  function handleRemove() {
    if (!value) return;
    const toDelete = value;
    onChange(null);
    void fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: toDelete.path }),
    }).catch(() => {});
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <span className="font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      )}

      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-border/60 bg-muted/40">
        {value ? (
          resourceType === "video" ? (
            <video
              src={value.url}
              className="h-full w-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            // Asset externo de Supabase Storage sin dimensiones fijas conocidas de antemano en este preview.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.url} alt="" className="h-full w-full object-cover" />
          )
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
            {resourceType === "video" ? (
              <Video className="size-6" strokeWidth={1.5} />
            ) : (
              <ImagePlus className="size-6" strokeWidth={1.5} />
            )}
            <span className="font-mono-technical text-[10px] uppercase tracking-wider">
              Sin archivo
            </span>
          </div>
        )}

        {pending && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
        >
          {pending ? "Subiendo..." : value ? "Reemplazar" : "Subir archivo"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pending}
            onClick={handleRemove}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3.5" /> Quitar
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={resourceType === "video" ? "video/*" : "image/*"}
        className="hidden"
        onChange={handleFileSelected}
      />
    </div>
  );
}
