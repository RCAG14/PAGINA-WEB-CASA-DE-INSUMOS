"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QuantityStepper } from "@/components/site/quantity-stepper";
import { BoxTypeBadge } from "@/components/site/box-type-badge";
import { CLASSIFICATION_ICON_MAP } from "@/lib/classification-icons";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useLogo } from "@/lib/logo-context";
import { useI18n } from "@/lib/i18n/locale-context";

function LetterheadLogo({ url }: { url: string | null }) {
  if (!url) return null;
  return (
    <span className="absolute right-4 top-6 flex items-center rounded-lg bg-sidebar-foreground/95 px-2 py-1.5 shadow-elevation-sm sm:right-6">
      <Image
        src={url}
        alt="Casa de Insumos"
        width={160}
        height={40}
        className="h-8 w-auto object-contain sm:h-10"
      />
    </span>
  );
}

export default function CartPage() {
  const { lines, subtotal, totalItems, removeLine, setQty, hydrated } = useCart();
  const logoUrl = useLogo();
  const { dict } = useI18n();

  if (hydrated && lines.length === 0) {
    return (
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
        <LetterheadLogo url={logoUrl} />
        <ShoppingCart className="size-10 text-muted-foreground" strokeWidth={1.2} />
        <h1 className="font-heading text-xl font-semibold">{dict.cartPage.emptyTitle}</h1>
        <p className="text-sm text-muted-foreground">{dict.cartPage.emptyDesc}</p>
        <Link href="/catalogo" className={buttonVariants({})}>
          {dict.cartPage.viewCatalog}
        </Link>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <LetterheadLogo url={logoUrl} />
      <div className="mb-8 flex flex-col gap-1">
        <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
          {dict.cartPage.eyebrow}
        </span>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          {totalItems > 0
            ? `${totalItems} ${totalItems === 1 ? dict.catalogBrowser.boxWord : dict.catalogBrowser.boxesWord} ${dict.cartPage.boxSuffix}`
            : dict.cartPage.loadingCart}
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-elevation-sm">
          <div className="hidden grid-cols-[1fr_140px_120px_110px_40px] gap-4 border-b border-border/60 bg-muted/50 px-4 py-2 font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground sm:grid">
            <span>{dict.cartPage.headerBox}</span>
            <span>{dict.cartPage.headerType}</span>
            <span className="text-center">{dict.cartPage.headerQty}</span>
            <span className="text-right">{dict.cartPage.headerTotal}</span>
            <span />
          </div>
          <ul className="divide-y divide-border">
            {lines.map((line) => {
              const Icon = CLASSIFICATION_ICON_MAP[line.clasificacionIcono];
              return (
                <li
                  key={line.boxId}
                  className="grid grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-[1fr_140px_120px_110px_40px] sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted">
                      <Icon className="size-5 text-primary" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <Link
                        href={`/productos/${line.slug}`}
                        className="text-sm font-medium transition-colors hover:text-primary"
                      >
                        {line.nombre}
                      </Link>
                      <span className="font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground">
                        {line.skuCaja} · {line.clasificacionLabel}
                      </span>
                    </div>
                  </div>

                  <div>
                    <BoxTypeBadge tipo={line.tipo} />
                  </div>

                  <div className="flex justify-start sm:justify-center">
                    <QuantityStepper
                      value={line.cantidad}
                      max={line.stock}
                      onChange={(v) => setQty(line.boxId, v)}
                    />
                  </div>

                  <div className="text-left font-mono-technical text-sm font-semibold text-primary sm:text-right">
                    {formatPrice(line.precio * line.cantidad)}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => removeLine(line.boxId)}
                      aria-label={dict.cartPage.removeFromCart}
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex h-fit flex-col gap-4 rounded-xl border border-border/60 bg-card/80 p-4 shadow-elevation-sm backdrop-blur-md">
          <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
            {dict.cartPage.summaryTitle}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {dict.cartPage.subtotalPrefix} ({totalItems} {dict.cartPage.boxesSuffix})
            </span>
            <span className="font-mono-technical font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{dict.cartPage.shipping}</span>
            <span className="font-mono-technical text-muted-foreground">
              {dict.cartPage.shippingValue}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="font-medium">{dict.cartPage.total}</span>
            <span className="font-mono-technical text-lg font-semibold text-primary">
              {formatPrice(subtotal)}
            </span>
          </div>
          <Button size="lg" render={<Link href="/checkout" />} nativeButton={false} className="w-full">
            {dict.cartPage.buy}
            <ArrowRight className="size-4" />
          </Button>
          <Link
            href="/catalogo"
            className="text-center font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
          >
            {dict.cartPage.continueBrowsing}
          </Link>
        </div>
      </div>
    </div>
  );
}
