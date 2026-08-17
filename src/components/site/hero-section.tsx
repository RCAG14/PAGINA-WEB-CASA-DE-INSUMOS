import Link from "next/link";
import { ArrowRight, Boxes, ClipboardCheck, PackageCheck, ScanBarcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroBackground } from "@/components/site/hero-background";
import { getHeroImagenes, getHeroVideo } from "@/lib/data/landing";

const STATS = [
  { label: "Margen potencial promedio", value: "+180%" },
  { label: "Clasificaciones activas", value: "8" },
  { label: "Origen verificado", value: "6+ países UE/UK" },
  { label: "Lotes con certificación aduanera", value: "100%" },
];

const TRUST_ITEMS = [
  { icon: PackageCheck, label: "Manifiesto verificado por lote" },
  { icon: ClipboardCheck, label: "Certificación de seguridad aduanera" },
  { icon: ScanBarcode, label: "Trazabilidad de origen y centro de retorno" },
  { icon: Boxes, label: "Clasificación transparente por categoría" },
];

export async function HeroSection() {
  const [heroVideo, heroImagenes] = await Promise.all([getHeroVideo(), getHeroImagenes()]);

  return (
    <section className="relative overflow-hidden border-b border-border bg-primary">
      <HeroBackground
        video={heroVideo ? { url: heroVideo.url } : null}
        imagenes={heroImagenes.map((i) => ({ url: i.url }))}
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
        <div className="flex flex-col gap-6">
          <span className="animate-in fade-in-0 slide-in-from-bottom-2 inline-flex w-fit items-center gap-2 border border-dashed border-primary-foreground/40 px-2.5 py-1 font-mono-technical text-[11px] uppercase tracking-wider text-primary-foreground/80 duration-700 fill-mode-backwards">
            Cajas de retorno de Amazon · Liquidación por lote · Ed. 2026
          </span>
          <h1 className="animate-in fade-in-0 slide-in-from-bottom-3 max-w-xl font-heading text-3xl font-semibold leading-tight text-primary-foreground duration-700 delay-100 fill-mode-backwards sm:text-4xl lg:text-5xl">
            Cajas de retorno de Amazon con potencial de electrónica, joyería y artículos de alto
            valor a precio de liquidación.
          </h1>
          <p className="animate-in fade-in-0 slide-in-from-bottom-3 max-w-lg text-sm text-primary-foreground/75 duration-700 delay-200 fill-mode-backwards sm:text-base">
            Compra por lote con manifiesto verificado o arriesga con una caja sorpresa de mayor
            margen. Cada ficha técnica documenta origen, certificación aduanera y valor retail
            estimado para que calcules tu rentabilidad de reventa antes de comprar.
          </p>
          <div className="animate-in fade-in-0 slide-in-from-bottom-3 flex flex-wrap gap-3 duration-700 delay-300 fill-mode-backwards">
            <Button
              render={<Link href="#catalogo" />}
              nativeButton={false}
              size="lg"
              variant="secondary"
              className="group"
            >
              Ver catálogo
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              render={<Link href="#servicios" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              Cómo funciona
            </Button>
          </div>

          <dl className="animate-in fade-in-0 mt-4 grid grid-cols-2 gap-px overflow-hidden border border-primary-foreground/15 duration-700 delay-500 fill-mode-backwards sm:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-primary-foreground/5 px-3 py-3 backdrop-blur-sm"
              >
                <dt className="font-mono-technical text-[10px] uppercase tracking-wider text-primary-foreground/60">
                  {s.label}
                </dt>
                <dd className="font-heading text-lg font-semibold text-primary-foreground">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          id="como-funciona"
          className="animate-in fade-in-0 slide-in-from-right-4 relative border border-primary-foreground/15 bg-primary-foreground/[0.04] p-5 duration-700 delay-200 fill-mode-backwards"
        >
          <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-accent" />
          <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-accent" />
          <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-accent" />
          <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-accent" />

          <p className="mb-4 font-mono-technical text-[11px] uppercase tracking-wider text-primary-foreground/60">
            Ficha de trazabilidad — cómo funciona
          </p>
          <ul className="flex flex-col gap-3">
            {TRUST_ITEMS.map((item, i) => (
              <li
                key={item.label}
                className="flex items-center gap-3 border border-primary-foreground/10 bg-primary/40 px-3 py-2.5"
              >
                <span className="flex size-7 shrink-0 items-center justify-center border border-accent/50 font-mono-technical text-[11px] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <item.icon className="size-4 shrink-0 text-accent" strokeWidth={1.5} />
                <span className="text-sm text-primary-foreground/90">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
