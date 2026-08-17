import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export type Rol = "JEFE" | "SOCIO";

export interface SessionPayload extends JWTPayload {
  userId: string;
  username: string;
  nombre: string;
  rol: Rol;
}

const SESSION_DURATION = "12h";

function getEncodedKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "Falta SESSION_SECRET en tu .env. Genera uno con `openssl rand -base64 32` (o `node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\"` en Windows)."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function encryptSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getEncodedKey());
}

export async function decryptSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getEncodedKey(), { algorithms: ["HS256"] });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
