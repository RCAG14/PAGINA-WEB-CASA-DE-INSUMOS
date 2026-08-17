import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "@/generated/prisma/client";
import type * as sql from "mssql";

function parseSqlServerUrl(url: string): sql.config {
  const withoutScheme = url.replace(/^sqlserver:\/\//i, "");
  const [hostPort, ...pairs] = withoutScheme.split(";").filter(Boolean);
  const [server, portStr] = hostPort.split(":");

  const params: Record<string, string> = {};
  for (const pair of pairs) {
    const idx = pair.indexOf("=");
    if (idx === -1) continue;
    params[pair.slice(0, idx).trim().toLowerCase()] = pair.slice(idx + 1).trim();
  }

  return {
    server,
    port: portStr ? Number(portStr) : 1433,
    database: params["database"],
    user: params["user"],
    password: params["password"],
    options: {
      encrypt: params["encrypt"] !== "false",
      trustServerCertificate: params["trustservercertificate"] === "true",
    },
  };
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL no está configurada. Copia .env.example a .env y define la cadena de conexión de SQL Server."
    );
  }
  const adapter = new PrismaMssql(parseSqlServerUrl(url));
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
