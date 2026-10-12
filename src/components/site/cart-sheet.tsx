"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { CartThumb } from "@/components/site/cart-thumb";
import { BoxTypeBadge } from "@/components/site/box-type-badge";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n/locale-context";

export function CartSheet() {
  const { lines, subtotal, totalItems, removeLine, setQty } = useCart();
  const { dict } = useI18n();

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label={dict.cartSheet.openCart}
            className="relative"
          />
        }
      >
        <ShoppingCart className="size-4" />
        {totalItems > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
            {totalItems}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="border-b border-border/60">
          <SheetTitle className="font-heading text-lg font-semibold">
            {dict.cartSheet.title} ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
            <ShoppingCart className="size-8 text-muted-foreground" strokeWidth={1.2} />
            <p className="text-sm text-muted-foreground">{dict.cartSheet.empty}</p>
            <SheetClose
              render={
                <Link
                  href="/cajas-devoluciones-amazon-bolivia#catalogo"
                  className={buttonVariants({ variant: "secondary", size: "sm" })}
                />
              }
              nativeButton={false}
            >
              {dict.cartSheet.viewCatalog}
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <ul className="flex flex-col divide-y divide-border">
                {lines.map((line) => {
                  return (
                    <li key={line.boxId} className="flex gap-3 py-3">
                      <CartThumb line={line} />
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/productos/${line.slug}`}
                            className="text-sm font-medium leading-snug transition-colors hover:text-primary"
                          >
                            {line.nombre}
                          </Link>
                          <button
                            onClick={() => removeLine(line.boxId)}
                            aria-label={dict.cartSheet.removeFromCart}
                            className="text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <BoxTypeBadge tipo={line.tipo} className="w-fit" />
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center overflow-hidden rounded-lg border border-border/60">
                            <button
                              onClick={() => setQty(line.boxId, line.cantidad - 1)}
                              disabled={line.cantidad <= 1}
                              className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                              aria-label={dict.cartSheet.decreaseQty}
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold">
                              {line.cantidad}
                            </span>
                            <button
                              onClick={() => setQty(line.boxId, line.cantidad + 1)}
                              disabled={line.cantidad >= line.stock}
                              className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                              aria-label={dict.cartSheet.increaseQty}
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <span className="font-heading text-base font-semibold text-primary">
                            {formatPrice(line.precio * line.cantidad)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <SheetFooter className="border-t border-border/60">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{dict.cartSheet.subtotal}</span>
                <span className="font-heading text-xl font-bold text-primary">{formatPrice(subtotal)}</span>
              </div>
              <Separator />
              {/* "Comprar" es la acción principal; ver el carrito completo, secundaria. */}
              <SheetClose
                render={
                  <Link
                    href="/checkout"
                    className={buttonVariants({ size: "lg", className: "w-full" })}
                  />
                }
                nativeButton={false}
              >
                {dict.cartSheet.buy}
              </SheetClose>
              <SheetClose
                render={
                  <Link
                    href="/carrito"
                    className={buttonVariants({ variant: "outline", className: "w-full" })}
                  />
                }
                nativeButton={false}
              >
                {dict.cartSheet.viewFullCart}
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
