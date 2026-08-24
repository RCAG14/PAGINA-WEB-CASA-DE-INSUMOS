import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CatalogHeader } from "@/components/site/catalog-header";
import { BoxVisual } from "@/components/site/box-visual";
import { BoxTypeBadge } from "@/components/site/box-type-badge";
import { ClassificationBadge } from "@/components/site/classification-badge";
import { AddToCartPanel } from "@/components/site/add-to-cart-panel";
import { SpecSheet } from "@/components/site/spec-sheet";
import { CriticalWarningBanner } from "@/components/site/critical-warning-banner";
import { BoxContentList } from "@/components/site/box-content-list";
import { MysteryPanel } from "@/components/site/mystery-panel";
import { FloatingLogo } from "@/components/site/floating-logo";
import { getCajaBySlug } from "@/lib/data/cajas";
import { getLogo } from "@/lib/data/landing";
import { formatPrice } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/locale";

export const dynamic = "force-dynamic";

export default async function ProductPage(props: PageProps<"/productos/[slug]">) {
  const { slug } = await props.params;
  const [box, logo, { dict }] = await Promise.all([
    getCajaBySlug(slug),
    getLogo(),
    getDictionary(),
  ]);

  if (!box) notFound();

  const margen =
    box.valorRetailEstimado > box.precio
      ? Math.round(((box.valorRetailEstimado - box.precio) / box.precio) * 100)
      : null;

  return (
    <>
      <CatalogHeader />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <FloatingLogo url={logo?.url ?? null} />
        <Link
          href="/cajas-devoluciones-amazon-bolivia"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          {dict.productPage.backToCatalog}
        </Link>
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>{dict.productPage.breadcrumbHome}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/cajas-devoluciones-amazon-bolivia" />}>
                {box.clasificacion.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{box.nombre}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
            <BoxVisual box={box} className="aspect-square" iconClassName="size-14" />
            <p className="text-center text-xs text-muted-foreground">
              {dict.productPage.representationNote}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <ClassificationBadge clasificacion={box.clasificacion} />
                <BoxTypeBadge tipo={box.tipo} />
              </div>

              <h1 className="font-heading text-2xl font-semibold sm:text-3xl">{box.nombre}</h1>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-3.5"
                      fill={i < Math.round(box.rating) ? "currentColor" : "none"}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
                <span>
                  {box.rating.toFixed(1)} · {box.numResenas} {dict.productPage.reviewsSuffix}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">{box.descripcionCorta}</p>
              <p className="border-l-2 border-primary/30 pl-3 text-sm text-foreground/80">
                {box.descripcionTecnica}
              </p>
            </div>

            {margen !== null && (
              <div className="flex flex-wrap items-center gap-3 border border-dashed border-accent bg-accent/10 px-3 py-2.5">
                <span className="font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground">
                  {dict.productPage.retailValueLabel}
                </span>
                <span className="font-mono-technical text-sm text-muted-foreground line-through">
                  {formatPrice(box.valorRetailEstimado)}
                </span>
                <span className="ml-auto font-mono-technical text-sm font-bold text-primary">
                  {dict.productPage.marginPotential} +{margen}%
                </span>
              </div>
            )}

            <AddToCartPanel box={box} />

            <SpecSheet specs={box.specs} />

            <CriticalWarningBanner />
          </div>
        </div>

        <div className="mt-10">
          {box.tipo === "listada" ? (
            <BoxContentList items={box.contenido} />
          ) : (
            <MysteryPanel box={box} />
          )}
        </div>
      </div>
    </>
  );
}
