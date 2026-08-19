import "server-only";
import { cookies } from "next/headers";
import { THEME_COOKIE } from "@/lib/theme/constants";

export type Theme = "dark" | "light";

export const DEFAULT_THEME: Theme = "dark";

export async function getTheme(): Promise<Theme> {
  const cookieStore = await cookies();
  const value = cookieStore.get(THEME_COOKIE)?.value;
  return value === "light" ? "light" : DEFAULT_THEME;
}
