import "server-only";
import { cookies } from "next/headers";
import { MONEDA_COOKIE, type Moneda } from "@/lib/moneda/constants";

export async function getMoneda(): Promise<Moneda> {
  const cookieStore = await cookies();
  return cookieStore.get(MONEDA_COOKIE)?.value === "BOB" ? "BOB" : "USD";
}
