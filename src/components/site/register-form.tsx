"use client";

import Link from "next/link";
import { useActionState } from "react";
import { UserPlus } from "lucide-react";
import { registrarClienteAction } from "@/app/(landing)/registro/actions";
import type { AuthState } from "@/app/(landing)/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { useI18n } from "@/lib/i18n/locale-context";

const INITIAL_STATE: AuthState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registrarClienteAction, INITIAL_STATE);
  const { dict } = useI18n();

  return (
    <section className="bg-blueprint-dark relative flex min-h-screen items-center overflow-hidden">
      <Link
        href="/"
        className="absolute left-4 top-4 font-mono-technical text-[11px] uppercase tracking-wider text-sidebar-foreground/60 transition-colors hover:text-sidebar-foreground sm:left-6 sm:top-6"
      >
        {dict.webdev.backHome}
      </Link>
      <LanguageSwitcher className="absolute right-4 top-4 text-sidebar-foreground sm:right-6 sm:top-6" />

      <div className="relative mx-auto w-full max-w-sm px-4 py-16 sm:px-6">
        <div className="rounded-xl border border-sidebar-foreground/15 bg-card/90 p-6 shadow-elevation-xl backdrop-blur-md">
          <div className="mb-6 flex flex-col items-center gap-2 text-center">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserPlus className="size-5" strokeWidth={2.5} />
            </span>
            <h1 className="font-heading text-lg font-bold">{dict.auth.registerTitle}</h1>
          </div>

          <form action={formAction} className="flex flex-col gap-4">
            {state?.error && (
              <Alert className="border-destructive/50 bg-destructive/10">
                <AlertTitle className="font-mono-technical text-xs uppercase tracking-wider text-destructive">
                  {dict.auth.registerErrorTitle}
                </AlertTitle>
                <AlertDescription className="text-xs text-destructive">{state.error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nombre" className="text-xs">
                {dict.auth.nombre}
              </Label>
              <Input id="nombre" name="nombre" required autoComplete="name" autoFocus />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username" className="text-xs">
                {dict.auth.username}
              </Label>
              <Input id="username" name="username" required autoComplete="username" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-xs">
                {dict.auth.password}
              </Label>
              <Input id="password" name="password" type="password" required autoComplete="new-password" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmar" className="text-xs">
                {dict.auth.confirmPassword}
              </Label>
              <Input id="confirmar" name="confirmar" type="password" required autoComplete="new-password" />
            </div>

            <Button type="submit" size="lg" disabled={pending} className="mt-2">
              {pending ? dict.auth.registerPending : dict.auth.registerSubmit}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {dict.auth.haveAccount}{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              {dict.auth.loginLink}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
