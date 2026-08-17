"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { CheckCircle2, MessageCircle, QrCode, ShieldCheck, TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CLASSIFICATION_ICON_MAP } from "@/components/site/box-visual";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { confirmarPedido } from "@/app/(site)/checkout/actions";

function buildWhatsAppLink(
  numero: string | null,
  codigoPedido: string,
  nombre: string,
  total: string
) {
  const mensaje = [
    `Hola, soy ${nombre}.`,
    `Quiero confirmar mi pedido *${codigoPedido}*.`,
    `Total estimado: ${total}.`,
    "Quedo atento/a a la coordinación de pago y envío.",
  ].join(" ");
  return `https://wa.me/${numero ?? ""}?text=${encodeURIComponent(mensaje)}`;
}

export function CheckoutForm({ whatsappNumero }: { whatsappNumero: string | null }) {
  const { lines, subtotal, totalItems, clear } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [codigoPedido, setCodigoPedido] = useState<string | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    direccion: "",
    ciudad: "",
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const codigo = await confirmarPedido(form, lines.map((l) => ({
          cajaId: l.boxId,
          cantidad: l.cantidad,
          precioUnitario: l.precio,
        })));
        setCodigoPedido(codigo);
        const link = buildWhatsAppLink(whatsappNumero, codigo, form.nombre, formatPrice(subtotal));
        window.open(link, "_blank");
        clear();
      } catch {
        setError(
          "No se pudo registrar el pedido. Verifica la conexión a la base de datos e inténtalo de nuevo."
        );
      }
    });
  }

  if (codigoPedido) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <span className="flex size-14 items-center justify-center border-2 border-primary text-primary">
          <CheckCircle2 className="size-7" />
        </span>
        <h1 className="font-heading text-2xl font-semibold">Pedido {codigoPedido} registrado</h1>
        <p className="text-sm text-muted-foreground">
          Reservamos el stock por 48 horas mientras coordinamos el pago y el envío por WhatsApp,
          donde te enviaremos el código QR para pagar. Si la ventana no se abrió
          automáticamente, contáctanos mencionando el código del pedido.
        </p>
        <Link href="/" className={buttonVariants({})}>
          Volver al catálogo
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="font-heading text-xl font-semibold">No hay cajas en tu carrito</h1>
        <p className="text-sm text-muted-foreground">
          Agrega al menos una caja para continuar con el checkout.
        </p>
        <Link href="/#catalogo" className={buttonVariants({})}>
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-1">
        <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
          Checkout
        </span>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">Finalizar pedido</h1>
      </div>

      <Alert className="mb-8 border-dashed border-accent bg-accent/10">
        <ShieldCheck className="size-4 text-primary" />
        <AlertTitle className="font-mono-technical text-xs uppercase tracking-wider">
          Reserva sin pasarela de pago
        </AlertTitle>
        <AlertDescription className="text-xs">
          Al confirmar se crea el pedido en la base de datos con estado <strong>Pendiente</strong>{" "}
          y se reserva el stock por 48 horas. El pago y el envío se coordinan directamente por
          WhatsApp.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert className="mb-8 border-red-600 bg-red-50">
          <TriangleAlert className="size-4 text-red-600" />
          <AlertTitle className="font-mono-technical text-xs uppercase tracking-wider text-red-600">
            No se pudo confirmar el pedido
          </AlertTitle>
          <AlertDescription className="text-xs text-red-600">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-8">
          <section className="border border-border">
            <div className="border-b border-border bg-primary px-3 py-2">
              <p className="font-mono-technical text-[11px] uppercase tracking-wider text-primary-foreground">
                01 — Datos de contacto y envío
              </p>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="nombre" className="text-xs">Nombre completo</Label>
                <Input
                  id="nombre"
                  required
                  placeholder="Nombre y apellido"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="telefono" className="text-xs">Teléfono (WhatsApp)</Label>
                <Input
                  id="telefono"
                  type="tel"
                  required
                  placeholder="+591 700 00000"
                  value={form.telefono}
                  onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-xs">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ciudad" className="text-xs">Ciudad</Label>
                <Input
                  id="ciudad"
                  required
                  placeholder="Ciudad"
                  value={form.ciudad}
                  onChange={(e) => setForm((f) => ({ ...f, ciudad: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="direccion" className="text-xs">Dirección de envío</Label>
                <Input
                  id="direccion"
                  required
                  placeholder="Calle, número, zona"
                  value={form.direccion}
                  onChange={(e) => setForm((f) => ({ ...f, direccion: e.target.value }))}
                />
              </div>
            </div>
          </section>

          <section className="border border-border">
            <div className="border-b border-border bg-primary px-3 py-2">
              <p className="font-mono-technical text-[11px] uppercase tracking-wider text-primary-foreground">
                02 — Pago y envío
              </p>
            </div>
            <div className="flex flex-col gap-3 p-4">
              <div className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-xs text-muted-foreground">
                  No procesamos pagos en línea. El pago y el envío se coordinan directamente por
                  WhatsApp con el equipo de Casa de Insumos.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <QrCode className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-xs text-muted-foreground">
                  Ahí mismo te enviaremos el <strong>código QR</strong> para realizar el pago una
                  vez acordado el método y el envío.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="flex h-fit flex-col gap-4 border border-border bg-card p-4">
          <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
            Resumen del pedido
          </p>

          <ul className="flex max-h-64 flex-col divide-y divide-border overflow-y-auto">
            {lines.map((line) => {
              const Icon = CLASSIFICATION_ICON_MAP[line.clasificacionIcono];
              return (
                <li key={line.boxId} className="flex items-center gap-3 py-2.5">
                  <div className="flex size-10 shrink-0 items-center justify-center border border-border bg-muted">
                    <Icon className="size-4 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-xs font-medium leading-tight">{line.nombre}</span>
                    <span className="font-mono-technical text-[10px] text-muted-foreground">
                      x{line.cantidad}
                    </span>
                  </div>
                  <span className="font-mono-technical text-xs font-semibold">
                    {formatPrice(line.precio * line.cantidad)}
                  </span>
                </li>
              );
            })}
          </ul>

          <Separator />

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal ({totalItems} cajas)</span>
            <span className="font-mono-technical">{formatPrice(subtotal)}</span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="font-medium">Total estimado</span>
            <span className="font-mono-technical text-lg font-semibold text-primary">
              {formatPrice(subtotal)}
            </span>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? "Registrando pedido..." : "Confirmar pedido por WhatsApp"}
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            Se reserva el stock por 48 horas. No se realiza ningún cargo en esta pantalla.
          </p>
        </div>
      </form>
    </div>
  );
}
