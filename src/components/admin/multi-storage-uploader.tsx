"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import type { StorageAsset } from "@/components/admin/storage-uploader";
import { cn } from "@/lib/utils";

export type { StorageAsset };

interface MultiStorageUploaderProps {
  value: StorageAsset[];
  onChange: (assets: StorageAsset[]) => void;
  /** Carpeta del bucket de destino — debe estar en la lista blanca de /api/upload. */
  folder: string;
  max?: number;
  label?: string;
  className?: string;
}

export function MultiStorageUploader({
  value,
  onChange,
  folder,
  max = 6,
  label,
  className,
}: MultiStorageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    setPending(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("resourceType", "image");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "No se pudo subir el archivo.");
      }

      onChange([...value, { url: data.url, path: data.path }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir el archivo.");
    } finally {
      setPending(false);
    }
  }

  function handleRemove(index: number) {
    const toDelete = value[index];
    onChange(value.filter((_, i) => i !== index));
    void fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: toDelete.path }),
    }).catch(() => {});
  }

  const puedeAgregar = value.length < max;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <span className="font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground">
          {label} — {value.length}/{max}
        </span>
      )}

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {value.map((asset, i) => (
          <div
            key={asset.path}
            className="relative aspect-square overflow-hidden border border-border bg-muted/40"
          >
            {/* Asset externo de Supabase Storage sin dimensiones fijas conocidas de antemano en este preview. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset.url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="Quitar imagen"
              onClick={() => handleRemove(i)}
              className="absolute right-1 top-1 flex size-6 items-center justify-center bg-background/90 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}

        {puedeAgregar && (
          <button
            type="button"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 border border-dashed border-border bg-muted/40 text-muted-foreground hover:border-primary hover:text-primary"
          >
            {pending ? (
              <Loader2 className="size-5 animate-spin text-primary" />
            ) : (
              <>
                <ImagePlus className="size-5" strokeWidth={1.5} />
                <span className="font-mono-technical text-[9px] uppercase tracking-wider">Agregar</span>
              </>
            )}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
      />
    </div>
  );
}
