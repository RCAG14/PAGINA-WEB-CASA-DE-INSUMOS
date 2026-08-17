import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getUltimasOfertas } from "@/lib/data/landing";

export async function OffersStrip() {
  const ofertas = await getUltimasOfertas(2);
  if (ofertas.length === 0) return null;

  return (
    <section className="border-b border-border bg-primary">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="size-3.5 text-accent" strokeWidth={1.5} />
          <span className="font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground/70">
            Ofertas activas
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {ofertas.map((oferta) => {
            const content = (
              <div className="group flex items-center gap-3 border border-primary-foreground/15 bg-primary-foreground/[0.04] p-2.5 transition-colors hover:border-accent">
                <div className="relative size-14 shrink-0 overflow-hidden border border-primary-foreground/10">
                  <Image
                    src={oferta.url}
                    alt={oferta.titulo ?? "Oferta"}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  {oferta.titulo && (
                    <p className="truncate font-heading text-sm font-semibold text-primary-foreground">
                      {oferta.titulo}
                    </p>
                  )}
                  {oferta.subtitulo && (
                    <p className="truncate text-xs text-primary-foreground/70">{oferta.subtitulo}</p>
                  )}
                </div>
                {oferta.texto_cta && (
                  <span className="hidden shrink-0 items-center gap-1 font-mono-technical text-[10px] uppercase tracking-wider text-accent sm:flex">
                    {oferta.texto_cta}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                )}
              </div>
            );

            return oferta.enlace_cta ? (
              <Link key={oferta.id} href={oferta.enlace_cta}>
                {content}
              </Link>
            ) : (
              <div key={oferta.id}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
