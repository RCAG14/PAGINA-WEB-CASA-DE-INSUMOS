"use client";

import * as React from "react";
import { Toast } from "@base-ui/react/toast";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const toastManager = Toast.createToastManager();

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const TYPE_STYLES: Record<string, string> = {
  success: "border-l-emerald-600 [&_[data-slot=toast-icon]]:text-emerald-600",
  error: "border-l-destructive [&_[data-slot=toast-icon]]:text-destructive",
  warning: "border-l-amber-600 [&_[data-slot=toast-icon]]:text-amber-600",
  info: "border-l-primary [&_[data-slot=toast-icon]]:text-primary",
};

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return toasts.map((toast) => {
    const type = toast.type ?? "info";
    const Icon = ICONS[type] ?? Info;

    return (
      <Toast.Root
        key={toast.id}
        toast={toast}
        className={cn(
          "relative flex w-full items-start gap-2.5 rounded-xl border border-border/60 border-l-4 bg-card p-3 text-card-foreground shadow-elevation-lg",
          "data-starting-style:translate-x-full data-starting-style:opacity-0",
          "data-ending-style:translate-x-full data-ending-style:opacity-0",
          "transition-all duration-300",
          TYPE_STYLES[type] ?? TYPE_STYLES.info
        )}
      >
        <Icon data-slot="toast-icon" className="mt-0.5 size-4 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {toast.title && (
            <Toast.Title className="text-sm font-medium text-balance" />
          )}
          {toast.description && (
            <Toast.Description className="text-xs text-muted-foreground text-pretty" />
          )}
        </div>
        <Toast.Close
          aria-label="Cerrar notificación"
          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3.5" />
        </Toast.Close>
      </Toast.Root>
    );
  });
}

export function Toaster() {
  return (
    <Toast.Provider toastManager={toastManager} limit={4}>
      <Toast.Portal>
        <Toast.Viewport className="fixed inset-x-3 bottom-3 z-100 mx-auto flex w-full max-w-sm flex-col-reverse gap-2 outline-none sm:inset-x-auto sm:right-4 sm:bottom-4">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}
