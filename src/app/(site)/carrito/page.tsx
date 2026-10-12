"use client";

import Link from "next/link";
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QuantityStepper } from "@/components/site/quantity-stepper";
import { BoxTypeBadge } from "@/components/site/box-type-badge";
import { CartThumb } from "@/components/site/cart-thumb";
import { PurchaseSteps } from "@/components/site/purchase-steps";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n/locale-context";
import { HOME_CONTAINER } from "@/lib/layout";
import { cn } from "@/lib/utils";

const CATALOGO = "/cajas-devoluciones-amazon-bolivia#catalogo";

export default function CartPage() {
  const { lines, subtotal, totalItems, removeLine, setQty, hydrated } = useCart();
  const { dict } = useI18n();
  const t = dict.cartPage;

  if (hydrated && lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-secondary">
          <ShoppingCart className="size-7 text-primary" strokeWidth={1.5} />
        </span>
        <h1 className="font-heading text-2xl font-semibold">{t.emptyTitle}</h1>
        <p className="text-base text-muted-foreground">{t.emptyDesc}</p>
        <Link href={CATALOGO} className={buttonVariants({ size: "lg" })}>
          {t.viewCatalog}
        </Link>
      </div>
    );
  }

  return (
    <div className={cn(HOME_CONTAINER, "py-8 lg:py-12")}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          {totalItems > 0
            ? `${totalItems} ${totalItems === 1 ? dict.catalogBrowser.boxWord : dict.catalogBrowser.boxesWord} ${t.boxSuffix}`
            : t.loadingCart}
        </h1>
        <PurchaseSteps actual={0} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        {/* Cada caja como una fila clara: foto, nombre, tipo, cantidad, total y quitar. */}
        <ul className="flex flex-col divide-y divide-border/60 rounded-xl border border-border/60 bg-card shadow-elevation-sm">
          {lines.map((line) => (
            <li key={line.boxId} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-4">
                <CartThumb line={line} />
                <div className="flex min-w-0 flex-col gap-1">
                  <Link
                    href={`/productos/${line.slug}`}
                    className="font-medium leading-snug transition-colors hover:text-primary"
                  >
                    {line.nombre}
                  </Link>
                  <span className="text-sm text-muted-foreground">{line.clasificacionLabel}</span>
                  <BoxTypeBadge tipo={line.tipo} className="w-fit" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <QuantityStepper
                  value={line.cantidad}
                  max={line.stock}
                  onChange={(v) => setQty(line.boxId, v)}
                />
                <span className="w-28 text-right font-heading text-lg font-semibold text-primary">
                  {formatPrice(line.precio * line.cantidad)}
                </span>
                <button
                  onClick={() => removeLine(line.boxId)}
                  aria-label={t.removeFromCart}
                  className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-5 shadow-elevation-sm lg:sticky lg:top-24">
          <h2 className="font-heading text-lg font-semibold">{t.summaryTitle}</h2>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t.subtotalPrefix} ({totalItems} {t.boxesSuffix})
            </span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t.shipping}</span>
            <span className="text-muted-foreground">{t.shippingValue}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="font-semibold">{t.total}</span>
            <span className="font-heading text-2xl font-bold text-primary">
              {formatPrice(subtotal)}
            </span>
          </div>
          <Button size="lg" render={<Link href="/checkout" />} nativeButton={false} className="w-full">
            {t.buy}
            <ArrowRight className="size-4" />
          </Button>
          <Link
            href={CATALOGO}
            className="text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {t.continueBrowsing}
          </Link>
        </div>
      </div>
    </div>
  );
}
