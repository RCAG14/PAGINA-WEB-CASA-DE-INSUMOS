import { NextResponse } from "next/server";
import sharp from "sharp";
import { deleteFromSupabaseStorage, uploadToSupabaseStorage } from "@/lib/supabase";

// Carpetas del bucket permitidas — evita que el cliente suba a rutas arbitrarias.
const ALLOWED_FOLDERS = new Set([
  "casa-de-insumos/landing/hero",
  "casa-de-insumos/landing/hero-decoracion",
  "casa-de-insumos/landing/about",
  "casa-de-insumos/landing/banners",
  "casa-de-insumos/landing/logo",
  "casa-de-insumos/productos",
  "casa-de-insumos/desarrollo-web/trabajos",
  "casa-de-insumos/desarrollo-web/hero",
]);

const LOGO_FOLDER = "casa-de-insumos/landing/logo";

/**
 * Recorta el borde vacío (transparente o del color de fondo) del logo para que
 * el dibujo ocupe toda la caja de BrandMark — si no, un PNG de 500×500 con el
 * isotipo al centro se ve diminuto. Se guarda como PNG para conservar la
 * transparencia. SVG y GIF se dejan tal cual.
 */
async function recortarLogo(buffer: Buffer, fileName: string, contentType: string) {
  if (contentType === "image/svg+xml" || contentType === "image/gif") {
    return { buffer, fileName, contentType };
  }
  try {
    const recortado = await sharp(buffer).trim().png().toBuffer();
    return {
      buffer: recortado,
      fileName: fileName.replace(/\.[^.]+$/, "") + ".png",
      contentType: "image/png",
    };
  } catch {
    // `trim` falla si la imagen es de un solo color — se sube sin tocar.
    return { buffer, fileName, contentType };
  }
}

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

  const original = Buffer.from(await file.arrayBuffer());
  const { buffer, fileName, contentType } =
    folder === LOGO_FOLDER
      ? await recortarLogo(original, file.name, file.type)
      : { buffer: original, fileName: file.name, contentType: file.type };

  try {
    const result = await uploadToSupabaseStorage(buffer, { folder, fileName, contentType });
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
