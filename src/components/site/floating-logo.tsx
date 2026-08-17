import Image from "next/image";

/** Insignia flotante del logo, centrada verticalmente en el borde derecho de la página. */
export function FloatingLogo({ url }: { url: string | null }) {
  if (!url) return null;

  return (
    <div className="pointer-events-none fixed right-3 top-1/2 z-20 hidden -translate-y-1/2 sm:block lg:right-6">
      <div className="border border-border bg-card/90 p-2 shadow-md backdrop-blur-sm">
        <Image
          src={url}
          alt="Casa de Insumos"
          width={64}
          height={64}
          className="h-10 w-10 object-contain lg:h-14 lg:w-14"
        />
      </div>
    </div>
  );
}
