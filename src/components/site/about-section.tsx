import Image from "next/image";
import { Award, HandCoins, PackageSearch, ShieldCheck } from "lucide-react";
import { getAboutImagen } from "@/lib/data/landing";

const VALUE_PROPS = [
  {
    icon: ShieldCheck,
    titulo: "Manifiestos verificados",
    descripcion:
      "Cada lote se documenta con manifiesto, origen y certificación aduanera antes de publicarse. Nada se lista sin trazabilidad.",
  },
  {
    icon: HandCoins,
    titulo: "Rentabilidad calculada",
    descripcion:
      "Mostramos el valor retail estimado frente al precio de venta para que tu margen potencial sea claro antes de comprar.",
  },
  {
    icon: PackageSearch,
    titulo: "Modelo de catálogo y liquidación",
    descripcion:
      "Operamos como distribuidores técnicos: cajas listadas con detalle exacto o cajas sorpresa clasificadas por categoría.",
  },
  {
    icon: Award,
    titulo: "Aliado logístico integral",
    descripcion:
      "De la importación a la reventa: cotizaciones a medida, gestión aduanera y desarrollo de catálogos digitales propios.",
  },
];

export async function AboutSection() {
  const aboutImagen = await getAboutImagen();

  return (
    <section id="sobre-nosotros" className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl scroll-mt-24 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-grid-technical">
          <span className="absolute left-0 top-0 z-10 h-4 w-4 border-l-2 border-t-2 border-primary" />
          <span className="absolute right-0 top-0 z-10 h-4 w-4 border-r-2 border-t-2 border-primary" />
          <span className="absolute bottom-0 left-0 z-10 h-4 w-4 border-b-2 border-l-2 border-primary" />
          <span className="absolute bottom-0 right-0 z-10 h-4 w-4 border-b-2 border-r-2 border-primary" />

          {aboutImagen ? (
            <Image
              src={aboutImagen.url}
              alt={aboutImagen.titulo ?? "Casa de Insumos"}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-card">
              <span className="font-mono-technical text-xs uppercase tracking-wider text-muted-foreground">
                Sube una imagen desde el panel administrador
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
              00 — Sobre nosotros
            </span>
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              Expertos en el modelo de catálogo y liquidación
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              Casa de Insumos conecta centros de retorno de Amazon en Europa y Reino Unido con
              revendedores e importadores. Documentamos cada lote con manifiesto técnico,
              certificación aduanera y valor retail estimado, para que compres con datos, no con
              incertidumbre.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {VALUE_PROPS.map((item) => (
              <div key={item.titulo} className="flex flex-col gap-2 border border-border bg-card p-4">
                <span className="flex size-8 items-center justify-center border border-primary/30 bg-primary/5 text-primary">
                  <item.icon className="size-4" strokeWidth={1.5} />
                </span>
                <h3 className="font-heading text-sm font-semibold leading-snug">{item.titulo}</h3>
                <p className="text-xs text-muted-foreground">{item.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
