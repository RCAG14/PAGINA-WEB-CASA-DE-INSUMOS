import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { dictionaries, type Locale } from "@/lib/i18n/dictionaries";
import { LOCALE_COOKIE } from "@/lib/i18n/constants";

export const DEFAULT_LOCALE: Locale = "es";

/** Memoizado por render: muchos componentes de una misma página piden el diccionario por su cuenta. */
export const getLocale = cache(async (): Promise<Locale> => {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return value === "en" ? "en" : DEFAULT_LOCALE;
});

export const getDictionary = cache(async () => {
  const locale = await getLocale();
  return { locale, dict: dictionaries[locale] };
});

export type { Locale };
