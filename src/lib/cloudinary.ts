import { v2 as cloudinary } from "cloudinary";

// La validación/configuración es perezosa (recién al subir o eliminar un
// archivo) para que las páginas que solo LEEN contenido de Cloudinary (Hero,
// banners, etc.) no revienten en un entorno donde aún no se configuraron las
// credenciales — solo las rutas que efectivamente suben/borran las necesitan.
let configured = false;

function ensureConfigured() {
  if (configured) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Faltan variables de entorno de Cloudinary. Define CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en tu .env."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  configured = true;
}

export type CloudinaryResourceType = "image" | "video";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  resourceType: CloudinaryResourceType;
  width: number | null;
  height: number | null;
}

export function uploadBufferToCloudinary(
  buffer: Buffer,
  options: { folder: string; resourceType: CloudinaryResourceType }
): Promise<CloudinaryUploadResult> {
  ensureConfigured();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: options.resourceType,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary no devolvió resultado."));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: options.resourceType,
          width: result.width ?? null,
          height: result.height ?? null,
        });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: CloudinaryResourceType
): Promise<void> {
  ensureConfigured();
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
