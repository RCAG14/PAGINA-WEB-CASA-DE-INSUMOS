import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const ruta = typeof body?.ruta === "string" ? body.ruta.slice(0, 500) : "/";

  await prisma.metricaVisita.create({ data: { ruta } });

  return NextResponse.json({ ok: true });
}
