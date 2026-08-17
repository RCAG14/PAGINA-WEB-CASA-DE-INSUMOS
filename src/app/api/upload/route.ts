import { NextResponse } from "next/server";
import { deleteFromSupabaseStorage, uploadToSupabaseStorage } from "@/lib/supabase";

// Carpetas del bucket permitidas — evita que el cliente suba a rutas arbitrarias.
const ALLOWED_FOLDERS = new Set([
  "casa-de-insumos/landing/hero",
  "casa-de-insumos/landing/about",
  "casa-de-insumos/landing/banners",
  "casa-de-insumos/landing/logo",
  "casa-de-insumos/productos",
]);

const MAX_SIZE_BYTES: Record<"image" | "video", number> = {
  image: 10 * 1024 * 1024,
  video: 100 * 1024 * 1024,
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder");
  const resourceType = formData.get("resourceType");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo a subir." }, { status: 400 });
  }
  if (typeof folder !== "string" || !ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Carpeta de destino inválida." }, { status: 400 });
  }
  if (resourceType !== "image" && resourceType !== "video") {
    return NextResponse.json({ error: "Tipo de recurso inválido." }, { status: 400 });
  }
  if (resourceType === "image" && !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "El archivo debe ser una imagen." }, { status: 400 });
  }
  if (resourceType === "video" && !file.type.startsWith("video/")) {
    return NextResponse.json({ error: "El archivo debe ser un video." }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES[resourceType]) {
    const maxMb = MAX_SIZE_BYTES[resourceType] / (1024 * 1024);
    return NextResponse.json(
      { error: `El archivo supera el máximo permitido de ${maxMb}MB.` },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await uploadToSupabaseStorage(buffer, {
      folder,
      fileName: file.name,
      contentType: file.type,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error subiendo a Supabase Storage:", error);
    return NextResponse.json({ error: "No se pudo subir el archivo." }, { status: 502 });
  }
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => null);
  const path = body?.path;

  if (typeof path !== "string" || !path) {
    return NextResponse.json({ error: "Datos inválidos para eliminar el archivo." }, { status: 400 });
  }

  try {
    await deleteFromSupabaseStorage(path);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error eliminando de Supabase Storage:", error);
    return NextResponse.json({ error: "No se pudo eliminar el archivo." }, { status: 502 });
  }
}
