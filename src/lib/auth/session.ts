import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { decryptSession, encryptSession, type SessionPayload } from "@/lib/auth/jwt";

export const SESSION_COOKIE = "cdi_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12; // 12 horas

export async function createSession(payload: SessionPayload) {
  const token = await encryptSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + SESSION_DURATION_MS),
    path: "/",
  });
}

/** Memoizado por render: header, footer y layout piden la sesión cada uno por su cuenta. */
export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  return decryptSession(cookieStore.get(SESSION_COOKIE)?.value);
});

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
