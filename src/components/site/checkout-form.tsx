"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { CheckCircle2, Info, MessageCircle, QrCode, TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CartThumb } from "@/components/site/cart-thumb";
import { PurchaseSteps } from "@/components/site/purchase-steps";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n/locale-context";
import { HOME_CONTAINER } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { confirmarPedido } from "@/app/(site)/checkout/actions";
import {
  DEFAULT_PHONE_COUNTRY,
  PHONE_COUNTRIES,
  buildFullPhone,
  isValidLocalPhone,
} from "@/lib/phone-countries";

const CATALOGO = "/cajas-devoluciones-amazon-bolivia#catalogo";

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

const SECTION = "overflow-hidden rounded-xl border border-border/60 bg-card shadow-elevation-sm";
const SECTION_HEADER = "border-b border-border/60 bg-secondary px-4 py-3 font-heading text-base font-semibold text-primary";

export function CheckoutForm({ whatsappNumero }: { whatsappNumero: string | null }) {
  const { lines, subtotal, totalItems, clear } = useCart();
  const { dict, locale } = useI18n();
  const t = dict.checkout;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [codigoPedido, setCodigoPedido] = useState<string | null>(null);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
  const [telefonoPais, setTelefonoPais] = useState(DEFAULT_PHONE_COUNTRY);
  const [telefonoLocal, setTelefonoLocal] = useState("");
  const [telefonoTouched, setTelefonoTouched] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    direccion: "",
    ciudad: "",
  });

  const telefonoValido = isValidLocalPhone(telefonoPais, telefonoLocal);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!telefonoValido) {
      setTelefonoTouched(true);
      setError(t.fields.telefonoInvalido);
      return;
    }

    // La pestaña de WhatsApp se abre YA, dentro del clic: si se abriera después
    // del await, el navegador (sobre todo en celulares) la bloquearía como
    // ventana emergente. Cuando el pedido queda registrado se le asigna el enlace.
    const ventana = whatsappNumero ? window.open("about:blank", "_blank") : null;
    if (ventana) ventana.opener = null;

    startTransition(async () => {
      try {
        const codigo = await confirmarPedido(
          { ...form, telefono: buildFullPhone(telefonoPais, telefonoLocal) },
          lines.map((l) => ({
            cajaId: l.boxId,
            cantidad: l.cantidad,
            precioUnitario: l.precio,
          }))
        );
        const link = buildWhatsAppLink(whatsappNumero, codigo, form.nombre, formatPrice(subtotal));
        setCodigoPedido(codigo);
        setWhatsappLink(link);
        if (ventana) ventana.location.href = link;
        clear();
      } catch {
        ventana?.close();
        setError(t.genericError);
      }
    });
  }

  if (codigoPedido) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-4 py-16 text-center sm:py-24">
        <PurchaseSteps actual={2} completo />
        <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="font-heading text-2xl font-semibold">
          {t.successTitlePrefix} {codigoPedido} {t.successTitleSuffix}
        </h1>
        <p className="text-base text-muted-foreground">{t.successDesc}</p>
        {whatsappLink && whatsappNumero && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "lg", className: "gap-2" })}
          >
            <MessageCircle className="size-4" />
            {t.openWhatsapp}
          </a>
        )}
        <Link href={CATALOGO} className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          {t.backToCatalog}
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-semibold">{t.emptyCartTitle}</h1>
        <p className="text-base text-muted-foreground">{t.emptyCartDesc}</p>
        <Link href={CATALOGO} className={buttonVariants({ size: "lg" })}>
          {t.viewCatalog}
        </Link>
      </div>
    );
  }

  return (
    <div className={cn(HOME_CONTAINER, "py-8 lg:py-12")}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">{t.title}</h1>
        <PurchaseSteps actual={1} />
      </div>

      {/* Qué pasa al confirmar, en una sola frase clara (antes: dos avisos técnicos). */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/15 bg-secondary px-4 py-3">
        <Info className="mt-0.5 size-5 shrink-0 text-primary" />
        <div className="flex flex-col gap-0.5 text-sm">
          <p className="font-semibold text-primary">{t.reserveAlertTitle}</p>
          <p className="text-foreground/80">
            {t.reserveAlertDescPre} {t.reserveAlertDescPost}
          </p>
        </div>
      </div>

      {error && (
        <Alert className="mb-6 border-destructive/50 bg-destructive/10">
          <TriangleAlert className="size-4 text-destructive" />
          <AlertTitle className="text-sm font-semibold text-destructive">{t.errorTitle}</AlertTitle>
          <AlertDescription className="text-sm text-destructive">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div className="flex flex-col gap-6">
          <section className={SECTION}>
            <h2 className={SECTION_HEADER}>{t.section1Title}</h2>
            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="nombre">{t.fields.nombre}</Label>
                <Input
                  id="nombre"
                  required
                  autoComplete="name"
                  placeholder={t.fields.nombrePlaceholder}
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="telefono">{t.fields.telefono}</Label>
                <div className="flex gap-2">
                  <Select
                    value={telefonoPais}
                    onValueChange={(v) => setTelefonoPais(v ?? DEFAULT_PHONE_COUNTRY)}
                  >
                    <SelectTrigger className="shrink-0" aria-label={t.fields.telefonoPais}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PHONE_COUNTRIES.map((c) => (
                        <SelectItem key={c.iso2} value={c.iso2}>
                          +{c.dial} {locale === "en" ? c.nameEn : c.nameEs}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="telefono"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    required
                    placeholder="700 00000"
                    value={telefonoLocal}
                    aria-invalid={telefonoTouched && !telefonoValido}
                    onChange={(e) => setTelefonoLocal(e.target.value.replace(/\D/g, ""))}
                    onBlur={() => setTelefonoTouched(true)}
                  />
                </div>
                {telefonoTouched && !telefonoValido && (
                  <p className="text-xs text-destructive">{t.fields.telefonoInvalido}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">{t.fields.email}</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ciudad">{t.fields.ciudad}</Label>
                <Input
                  id="ciudad"
                  required
                  autoComplete="address-level2"
                  placeholder={t.fields.ciudad}
                  value={form.ciudad}
                  onChange={(e) => setForm((f) => ({ ...f, ciudad: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="direccion">{t.fields.direccion}</Label>
                <Input
                  id="direccion"
                  required
                  autoComplete="street-address"
                  placeholder={t.fields.direccionPlaceholder}
                  value={form.direccion}
                  onChange={(e) => setForm((f) => ({ ...f, direccion: e.target.value }))}
                />
              </div>
            </div>
          </section>

          <section className={SECTION}>
            <h2 className={SECTION_HEADER}>{t.section2Title}</h2>
            <div className="flex flex-col gap-3 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="text-sm text-foreground/80">{t.paymentInfo1}</p>
              </div>
              <div className="flex items-start gap-3">
                <QrCode className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="text-sm text-foreground/80">
                  {t.paymentInfo2Pre} <strong>{t.paymentInfo2Bold}</strong> {t.paymentInfo2Post}
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-5 shadow-elevation-sm lg:sticky lg:top-24">
          <h2 className="font-heading text-lg font-semibold">{t.summaryTitle}</h2>

          <ul className="flex max-h-72 flex-col divide-y divide-border/60 overflow-y-auto">
            {lines.map((line) => (
              <li key={line.boxId} className="flex items-center gap-3 py-2.5">
                <CartThumb line={line} className="size-12" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">{line.nombre}</span>
                  <span className="text-xs text-muted-foreground">x{line.cantidad}</span>
                </div>
                <span className="text-sm font-semibold">
                  {formatPrice(line.precio * line.cantidad)}
                </span>
              </li>
            ))}
          </ul>

          <Separator />

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t.subtotalPrefix} ({totalItems} {t.boxesSuffix})
            </span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">{t.total}</span>
            <span className="font-heading text-2xl font-bold text-primary">
              {formatPrice(subtotal)}
            </span>
          </div>

          <Button type="submit" size="lg" className="w-full gap-2" disabled={pending}>
            <MessageCircle className="size-4" />
            {pending ? t.submitPending : t.submitIdle}
          </Button>
          <p className="text-center text-xs text-muted-foreground">{t.disclaimer}</p>
        </div>
      </form>
    </div>
  );
}
