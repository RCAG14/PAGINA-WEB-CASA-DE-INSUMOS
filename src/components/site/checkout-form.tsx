"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { CheckCircle2, MessageCircle, QrCode, ShieldCheck, TriangleAlert } from "lucide-react";
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
import { CLASSIFICATION_ICON_MAP } from "@/lib/classification-icons";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n/locale-context";
import { confirmarPedido } from "@/app/(site)/checkout/actions";
import {
  DEFAULT_PHONE_COUNTRY,
  PHONE_COUNTRIES,
  buildFullPhone,
  isValidLocalPhone,
} from "@/lib/phone-countries";

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
  const { dict, locale } = useI18n();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [codigoPedido, setCodigoPedido] = useState<string | null>(null);
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
      setError(dict.checkout.fields.telefonoInvalido);
      return;
    }

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
        setCodigoPedido(codigo);
        const link = buildWhatsAppLink(whatsappNumero, codigo, form.nombre, formatPrice(subtotal));
        window.open(link, "_blank");
        clear();
      } catch {
        setError(dict.checkout.genericError);
      }
    });
  }

  if (codigoPedido) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <span className="flex size-14 items-center justify-center border-2 border-primary text-primary">
          <CheckCircle2 className="size-7" />
        </span>
        <h1 className="font-heading text-2xl font-semibold">
          {dict.checkout.successTitlePrefix} {codigoPedido} {dict.checkout.successTitleSuffix}
        </h1>
        <p className="text-sm text-muted-foreground">{dict.checkout.successDesc}</p>
        <Link href="/" className={buttonVariants({})}>
          {dict.checkout.backToCatalog}
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="font-heading text-xl font-semibold">{dict.checkout.emptyCartTitle}</h1>
        <p className="text-sm text-muted-foreground">{dict.checkout.emptyCartDesc}</p>
        <Link href="/catalogo" className={buttonVariants({})}>
          {dict.checkout.viewCatalog}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-1">
        <span className="font-mono-technical text-xs uppercase tracking-wider text-accent">
          {dict.checkout.eyebrow}
        </span>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">{dict.checkout.title}</h1>
      </div>

      <Alert className="mb-8 border-dashed border-accent bg-accent/10">
        <ShieldCheck className="size-4 text-primary" />
        <AlertTitle className="font-mono-technical text-xs uppercase tracking-wider">
          {dict.checkout.reserveAlertTitle}
        </AlertTitle>
        <AlertDescription className="text-xs">
          {dict.checkout.reserveAlertDescPre}{" "}
          <strong>{dict.checkout.reserveAlertDescStatus}</strong> {dict.checkout.reserveAlertDescPost}
        </AlertDescription>
      </Alert>

      {error && (
        <Alert className="mb-8 border-red-600 bg-red-50">
          <TriangleAlert className="size-4 text-red-600" />
          <AlertTitle className="font-mono-technical text-xs uppercase tracking-wider text-red-600">
            {dict.checkout.errorTitle}
          </AlertTitle>
          <AlertDescription className="text-xs text-red-600">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-8">
          <section className="border border-border">
            <div className="border-b border-border bg-primary px-3 py-2">
              <p className="font-mono-technical text-[11px] uppercase tracking-wider text-primary-foreground">
                {dict.checkout.section1Title}
              </p>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="nombre" className="text-xs">{dict.checkout.fields.nombre}</Label>
                <Input
                  id="nombre"
                  required
                  placeholder={dict.checkout.fields.nombrePlaceholder}
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="telefono" className="text-xs">{dict.checkout.fields.telefono}</Label>
                <div className="flex gap-2">
                  <Select
                    value={telefonoPais}
                    onValueChange={(v) => setTelefonoPais(v ?? DEFAULT_PHONE_COUNTRY)}
                  >
                    <SelectTrigger className="shrink-0" aria-label={dict.checkout.fields.telefonoPais}>
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
                    required
                    placeholder="700 00000"
                    value={telefonoLocal}
                    aria-invalid={telefonoTouched && !telefonoValido}
                    onChange={(e) =>
                      setTelefonoLocal(e.target.value.replace(/\D/g, ""))
                    }
                    onBlur={() => setTelefonoTouched(true)}
                  />
                </div>
                {telefonoTouched && !telefonoValido && (
                  <p className="text-[11px] text-red-600">{dict.checkout.fields.telefonoInvalido}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-xs">{dict.checkout.fields.email}</Label>
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
                <Label htmlFor="ciudad" className="text-xs">{dict.checkout.fields.ciudad}</Label>
                <Input
                  id="ciudad"
                  required
                  placeholder={dict.checkout.fields.ciudad}
                  value={form.ciudad}
                  onChange={(e) => setForm((f) => ({ ...f, ciudad: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="direccion" className="text-xs">{dict.checkout.fields.direccion}</Label>
                <Input
                  id="direccion"
                  required
                  placeholder={dict.checkout.fields.direccionPlaceholder}
                  value={form.direccion}
                  onChange={(e) => setForm((f) => ({ ...f, direccion: e.target.value }))}
                />
              </div>
            </div>
          </section>

          <section className="border border-border">
            <div className="border-b border-border bg-primary px-3 py-2">
              <p className="font-mono-technical text-[11px] uppercase tracking-wider text-primary-foreground">
                {dict.checkout.section2Title}
              </p>
            </div>
            <div className="flex flex-col gap-3 p-4">
              <div className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-xs text-muted-foreground">{dict.checkout.paymentInfo1}</p>
              </div>
              <div className="flex items-start gap-3">
                <QrCode className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-xs text-muted-foreground">
                  {dict.checkout.paymentInfo2Pre} <strong>{dict.checkout.paymentInfo2Bold}</strong>{" "}
                  {dict.checkout.paymentInfo2Post}
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="flex h-fit flex-col gap-4 border border-border bg-card p-4">
          <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
            {dict.checkout.summaryTitle}
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
            <span className="text-muted-foreground">
              {dict.checkout.subtotalPrefix} ({totalItems} {dict.checkout.boxesSuffix})
            </span>
            <span className="font-mono-technical">{formatPrice(subtotal)}</span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="font-medium">{dict.checkout.total}</span>
            <span className="font-mono-technical text-lg font-semibold text-primary">
              {formatPrice(subtotal)}
            </span>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? dict.checkout.submitPending : dict.checkout.submitIdle}
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">{dict.checkout.disclaimer}</p>
        </div>
      </form>
    </div>
  );
}
