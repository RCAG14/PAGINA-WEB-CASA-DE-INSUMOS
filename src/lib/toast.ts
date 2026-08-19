import { toastManager } from "@/components/ui/toaster";

type ToastInput = string | { title: string; description?: string };

function normalize(input: ToastInput) {
  return typeof input === "string" ? { title: input } : input;
}

export const toast = {
  success(input: ToastInput) {
    return toastManager.add({ ...normalize(input), type: "success", timeout: 4000 });
  },
  error(input: ToastInput) {
    return toastManager.add({ ...normalize(input), type: "error", timeout: 7000 });
  },
  warning(input: ToastInput) {
    return toastManager.add({ ...normalize(input), type: "warning", timeout: 6000 });
  },
  info(input: ToastInput) {
    return toastManager.add({ ...normalize(input), type: "info", timeout: 5000 });
  },
};

export function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof Error && err.message ? err.message : fallback;
}
