import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, Star } from "lucide-react";
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
import { getCajaBySlug } from "@/lib/data/cajas";
import { getNumeroWhatsappPrincipal } from "@/lib/data/contacto";
import { formatPrice } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/locale";
import { HOME_CONTAINER } from "@/lib/layout";
import { buildWhatsAppLink, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const CATALOGO = "/cajas-devoluciones-amazon-bolivia";

export default async function ProductPage(props: PageProps<"/productos/[slug]">) {
  const { slug } = await props.params;
  const [box, whatsappNumero, { dict }] = await Promise.all([
    getCajaBySlug(slug),
    getNumeroWhatsappPrincipal(),
    getDictionary(),
  ]);

  if (!box) notFound();

  const t = dict.productPage;
  const outOfStock = box.stock === 0;
  const tieneValorEstimado = box.valorRetailEstimado > box.precio;
  const mensajeWhatsapp = `Hola, vengo de la página de Casa Insumos y quisiera consultar por la caja "${box.nombre}" (${box.specs.skuCaja}).`;

  return (
    <>
      <CatalogHeader containerClassName={HOME_CONTAINER} />
      <div className={cn(HOME_CONTAINER, "py-6 lg:py-10")}>
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href={`${CATALOGO}#catalogo`} />}>
                {t.catalogLabel}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {/* Abre el catálogo ya filtrado por esta categoría. */}
              <BreadcrumbLink
                render={
                  <Link href={`${CATALOGO}?categoria=${box.clasificacion.slug}#catalogo`} />
                }
              >
                {box.clasificacion.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{box.nombre}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Arriba: lo necesario para decidir y comprar (foto, precio, estado, botón). */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          <div className="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
            <BoxVisual
              box={box}
              className={cn("aspect-4/3 sm:aspect-square", outOfStock && "grayscale")}
              iconClassName="size-14"
            />
            {!box.imagenUrl && (
              <p className="text-center text-xs text-muted-foreground">{t.representationNote}</p>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <ClassificationBadge clasificacion={box.clasificacion} />
                <BoxTypeBadge tipo={box.tipo} />
              </div>
              <h1 className="font-heading text-2xl font-semibold leading-tight sm:text-3xl">
                {box.nombre}
              </h1>
              {/* Sin reseñas no se muestra nada (antes decía "0.0 · 0 reseñas"). */}
              {box.numResenas > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-0.5 text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-4"
                        fill={i < Math.round(box.rating) ? "currentColor" : "none"}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  {box.rating.toFixed(1)} · {box.numResenas} {t.reviewsSuffix}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-heading text-3xl font-bold text-primary">
                {formatPrice(box.precio)}
              </p>
              {tieneValorEstimado && (
                <p className="text-sm text-muted-foreground">
                  {t.retailValueLabel}: {formatPrice(box.valorRetailEstimado)}
                </p>
              )}
              <p
                className={cn(
                  "text-sm font-semibold",
                  outOfStock ? "text-destructive" : "text-accent"
                )}
              >
                {outOfStock ? t.soldOut : `${box.stock} ${t.available}`}
              </p>
            </div>

            <AddToCartPanel box={box} />

            {whatsappNumero && (
              <a
                href={buildWhatsAppLink(whatsappNumero, mensajeWhatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-primary/40 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                <MessageCircle className="size-4" strokeWidth={2} />
                {t.whatsappCta}
              </a>
            )}

            <div className="flex flex-col gap-2 border-t border-border/60 pt-5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t.descriptionLabel}
              </h2>
              <p className="text-sm leading-relaxed text-foreground/85">{box.descripcionCorta}</p>
              {box.descripcionTecnica && box.descripcionTecnica !== box.descripcionCorta && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {box.descripcionTecnica}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Abajo: qué trae la caja (lo que más pesa en la decisión), y al lado la
            ficha técnica y el aviso sobre el estado de los artículos. */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
          {box.tipo === "listada" ? (
            <BoxContentList items={box.contenido} />
          ) : (
            <MysteryPanel box={box} />
          )}
          <div className="flex flex-col gap-4">
            <SpecSheet specs={box.specs} />
            <CriticalWarningBanner />
          </div>
        </div>
      </div>
    </>
  );
}
