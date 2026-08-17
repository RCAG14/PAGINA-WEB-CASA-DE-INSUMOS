"use client";

import { useActionState } from "react";
import { Lock, Square } from "lucide-react";
import { loginAction, type LoginState } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const INITIAL_STATE: LoginState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, INITIAL_STATE);

  return (
    <div className="flex min-h-svh items-center justify-center bg-blueprint-dark px-4 py-10">
      <div className="w-full max-w-sm border border-primary-foreground/15 bg-card p-6">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex size-10 items-center justify-center border-2 border-primary text-primary">
            <Square className="size-5" strokeWidth={2.5} />
          </span>
          <div>
            <p className="font-heading text-base font-bold uppercase tracking-wide">
              Casa de Insumos
            </p>
            <p className="font-mono-technical text-[10px] uppercase tracking-wider text-muted-foreground">
              Acceso al panel administrador
            </p>
          </div>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={next ?? ""} />

          {state?.error && (
            <Alert className="border-red-600 bg-red-50">
              <Lock className="size-4 text-red-600" />
              <AlertTitle className="font-mono-technical text-xs uppercase tracking-wider text-red-600">
                No se pudo iniciar sesión
              </AlertTitle>
              <AlertDescription className="text-xs text-red-600">{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username" className="text-xs">
              Usuario
            </Label>
            <Input id="username" name="username" required autoComplete="username" autoFocus />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" className="text-xs">
              Contraseña
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" size="lg" disabled={pending} className="mt-2">
            {pending ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
